import { createClient } from '@blinkdotnew/sdk';
import type { Conversation, Message, ValidationResult } from '../types';

const blink = createClient({
  projectId: 'six-flags-media-planning-dashboard-mi1g6uof',
  authRequired: false
});

export class DatabaseService {
  private userId: string = 'default-user'; // Will be replaced with actual auth later

  // User Settings
  async saveUserSettings(settings: {
    apiKey?: string;
    weatherApiKey?: string;
    selectedModel?: string;
    theme?: 'light' | 'dark';
  }): Promise<void> {
    const existing = await this.getUserSettings();
    const now = Date.now();

    // Convert camelCase to snake_case for Blink DB
    const dbSettings: any = {};
    if (settings.apiKey !== undefined) dbSettings.api_key = settings.apiKey;
    if (settings.weatherApiKey !== undefined) dbSettings.weather_api_key = settings.weatherApiKey;
    if (settings.selectedModel !== undefined) dbSettings.selected_model = settings.selectedModel;
    if (settings.theme !== undefined) dbSettings.theme = settings.theme;

    if (existing) {
      await blink.db.user_settings.update(existing.id, {
        ...dbSettings,
        updated_at: now
      });
    } else {
      await blink.db.user_settings.create({
        id: `settings-${this.userId}-${now}`,
        user_id: this.userId,
        ...dbSettings,
        created_at: now,
        updated_at: now
      });
    }
  }

  async getUserSettings(): Promise<any | null> {
    const settings = await blink.db.user_settings.list({
      where: { user_id: this.userId },
      limit: 1
    });
    return settings.length > 0 ? settings[0] : null;
  }

  async getApiKey(): Promise<string | null> {
    const settings = await this.getUserSettings();
    return settings?.api_key || null;
  }

  async getWeatherApiKey(): Promise<string | null> {
    const settings = await this.getUserSettings();
    return settings?.weather_api_key || null;
  }

  async getModel(): Promise<string | null> {
    const settings = await this.getUserSettings();
    return settings?.selected_model || null;
  }

  async getTheme(): Promise<'light' | 'dark' | null> {
    const settings = await this.getUserSettings();
    return settings?.theme || null;
  }

  // Conversations
  async saveConversation(conversation: Conversation): Promise<void> {
    const existing = await blink.db.conversations.list({
      where: { id: conversation.id },
      limit: 1
    });

    if (existing.length > 0) {
      await blink.db.conversations.update(conversation.id, {
        title: conversation.title,
        model: conversation.model,
        updated_at: Date.now()
      });
    } else {
      await blink.db.conversations.create({
        id: conversation.id,
        user_id: this.userId,
        title: conversation.title,
        model: conversation.model,
        created_at: conversation.createdAt,
        updated_at: Date.now()
      });
    }

    // Save messages
    for (const message of conversation.messages) {
      await this.saveMessage(conversation.id, message);
    }
  }

  async getAllConversations(): Promise<Conversation[]> {
    const conversations = await blink.db.conversations.list({
      where: { user_id: this.userId },
      orderBy: { updated_at: 'desc' }
    });

    // Load messages for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await this.getMessages(conv.id);
        return {
          id: conv.id,
          title: conv.title,
          model: conv.model,
          messages,
          createdAt: Number(conv.created_at),
          updatedAt: Number(conv.updated_at)
        };
      })
    );

    return conversationsWithMessages;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const conversations = await blink.db.conversations.list({
      where: { id },
      limit: 1
    });

    if (conversations.length === 0) return null;

    const conv = conversations[0];
    const messages = await this.getMessages(id);

    return {
      id: conv.id,
      title: conv.title,
      model: conv.model,
      messages,
      createdAt: Number(conv.created_at),
      updatedAt: Number(conv.updated_at)
    };
  }

  async deleteConversation(id: string): Promise<void> {
    // Delete messages first
    const messages = await blink.db.messages.list({
      where: { conversation_id: id }
    });

    for (const message of messages) {
      await blink.db.messages.delete(message.id);
    }

    // Delete conversation
    await blink.db.conversations.delete(id);
  }

  // Messages
  private async saveMessage(conversationId: string, message: Message): Promise<void> {
    const existing = await blink.db.messages.list({
      where: { id: message.id },
      limit: 1
    });

    const messageData = {
      conversation_id: conversationId,
      user_id: this.userId,
      role: message.role,
      content: JSON.stringify(message.content),
      tool_calls: message.toolCalls ? JSON.stringify(message.toolCalls) : null,
      timestamp: message.timestamp
    };

    if (existing.length > 0) {
      await blink.db.messages.update(message.id, messageData);
    } else {
      await blink.db.messages.create({
        id: message.id,
        ...messageData
      });
    }
  }

  private async getMessages(conversationId: string): Promise<Message[]> {
    const messages = await blink.db.messages.list({
      where: { conversation_id: conversationId },
      orderBy: { timestamp: 'asc' }
    });

    return messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: JSON.parse(msg.content),
      toolCalls: msg.tool_calls ? JSON.parse(msg.tool_calls) : undefined,
      timestamp: Number(msg.timestamp)
    }));
  }

  // Validation History
  async saveValidationResult(result: ValidationResult): Promise<void> {
    await blink.db.validation_history.create({
      id: `validation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: this.userId,
      validation_type: result.type || 'campaign',
      input_value: result.input,
      result: JSON.stringify(result),
      is_valid: result.isValid ? 1 : 0,
      timestamp: result.timestamp
    });
  }

  async getValidationHistory(limit: number = 50): Promise<ValidationResult[]> {
    const history = await blink.db.validation_history.list({
      where: { user_id: this.userId },
      orderBy: { timestamp: 'desc' },
      limit
    });

    return history.map(item => JSON.parse(item.result));
  }

  async clearValidationHistory(): Promise<void> {
    const history = await blink.db.validation_history.list({
      where: { user_id: this.userId }
    });

    for (const item of history) {
      await blink.db.validation_history.delete(item.id);
    }
  }

  // Export/Import
  async exportAllData(): Promise<string> {
    const conversations = await this.getAllConversations();
    const validationHistory = await this.getValidationHistory();
    const settings = await this.getUserSettings();

    const data = {
      conversations,
      validationHistory,
      settings,
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);

      // Import conversations
      if (data.conversations) {
        for (const conv of data.conversations) {
          await this.saveConversation(conv);
        }
      }

      // Import validation history
      if (data.validationHistory) {
        for (const result of data.validationHistory) {
          await this.saveValidationResult(result);
        }
      }

      // Import settings
      if (data.settings) {
        await this.saveUserSettings({
          selectedModel: data.settings.selectedModel,
          theme: data.settings.theme
        });
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format');
    }
  }

  async clearAllData(): Promise<void> {
    // Clear conversations and messages
    const conversations = await this.getAllConversations();
    for (const conv of conversations) {
      await this.deleteConversation(conv.id);
    }

    // Clear validation history
    await this.clearValidationHistory();

    // Clear settings (keep API keys for security)
    await this.saveUserSettings({
      selectedModel: 'claude-sonnet-4-20250514',
      theme: 'light'
    });
  }

  // Current conversation tracking (in-memory for now, can be moved to DB if needed)
  private currentConversationId: string | null = null;

  setCurrentConversationId(id: string): void {
    this.currentConversationId = id;
  }

  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }
}

export const databaseService = new DatabaseService();
