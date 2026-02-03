import type { Conversation, ClaudeConfig } from '../types';
import { databaseService } from './database';

const STORAGE_KEYS = {
  API_KEY: 'sixflags_anthropic_api_key',
  WEATHER_API_KEY: 'sixflags_weather_api_key',
  MODEL: 'sixflags_claude_model',
  CONVERSATIONS: 'sixflags_conversations',
  CURRENT_CONVERSATION: 'sixflags_current_conversation',
  THEME: 'sixflags_theme',
  VALIDATION_HISTORY: 'sixflags_validation_history'
} as const;

export class StorageService {
  private useDatabase = true; // Toggle to use database vs localStorage
  // API Key Management
  async saveApiKey(apiKey: string): Promise<void> {
    if (this.useDatabase) {
      await databaseService.saveUserSettings({ apiKey });
    } else {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    }
  }

  async getApiKey(): Promise<string | null> {
    if (this.useDatabase) {
      return await databaseService.getApiKey();
    }
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  }

  async clearApiKey(): Promise<void> {
    if (this.useDatabase) {
      await databaseService.saveUserSettings({ apiKey: '' });
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }
  }

  // Weather API Key Management
  async saveWeatherApiKey(apiKey: string): Promise<void> {
    if (this.useDatabase) {
      await databaseService.saveUserSettings({ weatherApiKey: apiKey });
    } else {
      localStorage.setItem(STORAGE_KEYS.WEATHER_API_KEY, apiKey);
    }
  }

  async getWeatherApiKey(): Promise<string | null> {
    if (this.useDatabase) {
      return await databaseService.getWeatherApiKey();
    }
    return localStorage.getItem(STORAGE_KEYS.WEATHER_API_KEY);
  }

  async clearWeatherApiKey(): Promise<void> {
    if (this.useDatabase) {
      await databaseService.saveUserSettings({ weatherApiKey: '' });
    } else {
      localStorage.removeItem(STORAGE_KEYS.WEATHER_API_KEY);
    }
  }

  // Model Selection
  async saveModel(model: string): Promise<void> {
    if (this.useDatabase) {
      await databaseService.saveUserSettings({ selectedModel: model });
    } else {
      localStorage.setItem(STORAGE_KEYS.MODEL, model);
    }
  }

  async getModel(): Promise<string | null> {
    if (this.useDatabase) {
      return await databaseService.getModel();
    }
    return localStorage.getItem(STORAGE_KEYS.MODEL);
  }

  // Conversations
  async saveConversation(conversation: Conversation): Promise<void> {
    if (this.useDatabase) {
      await databaseService.saveConversation(conversation);
    } else {
      const conversations = await this.getAllConversations();
      const index = conversations.findIndex(c => c.id === conversation.id);
      
      if (index >= 0) {
        conversations[index] = conversation;
      } else {
        conversations.push(conversation);
      }
      
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
  }

  async getAllConversations(): Promise<Conversation[]> {
    if (this.useDatabase) {
      return await databaseService.getAllConversations();
    }
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  }

  async getConversation(id: string): Promise<Conversation | null> {
    if (this.useDatabase) {
      return await databaseService.getConversation(id);
    }
    const conversations = await this.getAllConversations();
    return conversations.find(c => c.id === id) || null;
  }

  async deleteConversation(id: string): Promise<void> {
    if (this.useDatabase) {
      await databaseService.deleteConversation(id);
    } else {
      const conversations = await this.getAllConversations();
      const filtered = conversations.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filtered));
    }
  }

  setCurrentConversationId(id: string): void {
    if (this.useDatabase) {
      databaseService.setCurrentConversationId(id);
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, id);
  }

  getCurrentConversationId(): string | null {
    if (this.useDatabase) {
      return databaseService.getCurrentConversationId();
    }
    return localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  }

  // Theme
  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    if (this.useDatabase) {
      await databaseService.saveUserSettings({ theme });
    } else {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }
  }

  async getTheme(): Promise<'light' | 'dark' | null> {
    if (this.useDatabase) {
      return await databaseService.getTheme();
    }
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : null;
  }

  // Validation History
  async saveValidationResult(result: any): Promise<void> {
    const validationResult = {
      ...result,
      timestamp: result.timestamp || Date.now(),
      isValid: result.isValid ?? result.is_valid ?? false,
      is_valid: result.is_valid ?? result.isValid ?? false,
      input: result.input || result.campaign_name || result.placement_name || ''
    };

    if (this.useDatabase) {
      await databaseService.saveValidationResult(validationResult);
    } else {
      const history = await this.getValidationHistory();
      history.unshift(validationResult);
      
      // Keep only last 50 validations
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem(STORAGE_KEYS.VALIDATION_HISTORY, JSON.stringify(history));
    }
  }

  async getValidationHistory(): Promise<unknown[]> {
    if (this.useDatabase) {
      return await databaseService.getValidationHistory();
    }
    const data = localStorage.getItem(STORAGE_KEYS.VALIDATION_HISTORY);
    return data ? JSON.parse(data) : [];
  }

  async clearValidationHistory(): Promise<void> {
    if (this.useDatabase) {
      await databaseService.clearValidationHistory();
    } else {
      localStorage.removeItem(STORAGE_KEYS.VALIDATION_HISTORY);
    }
  }

  // Export/Import
  async exportAllData(): Promise<string> {
    if (this.useDatabase) {
      return await databaseService.exportAllData();
    }
    const data = {
      conversations: await this.getAllConversations(),
      validationHistory: await this.getValidationHistory(),
      model: await this.getModel(),
      theme: await this.getTheme(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    if (this.useDatabase) {
      await databaseService.importData(jsonData);
      return;
    }
    
    try {
      const data = JSON.parse(jsonData);
      
      if (data.conversations) {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(data.conversations));
      }
      
      if (data.validationHistory) {
        localStorage.setItem(STORAGE_KEYS.VALIDATION_HISTORY, JSON.stringify(data.validationHistory));
      }
      
      if (data.model) {
        await this.saveModel(data.model);
      }
      
      if (data.theme) {
        await this.saveTheme(data.theme);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format');
    }
  }

  async clearAllData(): Promise<void> {
    if (this.useDatabase) {
      await databaseService.clearAllData();
    }
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storageService = new StorageService();
