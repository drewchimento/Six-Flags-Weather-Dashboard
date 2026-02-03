/**
 * Migration utility to move data from localStorage to Blink Database
 * Run this once to migrate existing user data
 */

import { databaseService } from '../services/database';

const LEGACY_STORAGE_KEYS = {
  API_KEY: 'sixflags_anthropic_api_key',
  WEATHER_API_KEY: 'sixflags_weather_api_key',
  MODEL: 'sixflags_claude_model',
  CONVERSATIONS: 'sixflags_conversations',
  THEME: 'sixflags_theme',
  VALIDATION_HISTORY: 'sixflags_validation_history'
};

export async function migrateLocalStorageToDatabase(): Promise<{
  success: boolean;
  migrated: {
    settings: boolean;
    conversations: number;
    validations: number;
  };
  errors: string[];
}> {
  const result = {
    success: true,
    migrated: {
      settings: false,
      conversations: 0,
      validations: 0
    },
    errors: [] as string[]
  };

  try {
    // Migrate settings
    const apiKey = localStorage.getItem(LEGACY_STORAGE_KEYS.API_KEY);
    const weatherApiKey = localStorage.getItem(LEGACY_STORAGE_KEYS.WEATHER_API_KEY);
    const model = localStorage.getItem(LEGACY_STORAGE_KEYS.MODEL);
    const theme = localStorage.getItem(LEGACY_STORAGE_KEYS.THEME) as 'light' | 'dark' | null;

    if (apiKey || weatherApiKey || model || theme) {
      await databaseService.saveUserSettings({
        apiKey: apiKey || undefined,
        weatherApiKey: weatherApiKey || undefined,
        selectedModel: model || undefined,
        theme: theme || undefined
      });
      result.migrated.settings = true;
    }

    // Migrate conversations
    const conversationsData = localStorage.getItem(LEGACY_STORAGE_KEYS.CONVERSATIONS);
    if (conversationsData) {
      try {
        const conversations = JSON.parse(conversationsData);
        for (const conv of conversations) {
          await databaseService.saveConversation(conv);
          result.migrated.conversations++;
        }
      } catch (error) {
        result.errors.push(`Failed to migrate conversations: ${error}`);
        result.success = false;
      }
    }

    // Migrate validation history
    const validationData = localStorage.getItem(LEGACY_STORAGE_KEYS.VALIDATION_HISTORY);
    if (validationData) {
      try {
        const validations = JSON.parse(validationData);
        for (const validation of validations) {
          await databaseService.saveValidationResult({
            ...validation,
            timestamp: validation.timestamp || Date.now(),
            isValid: validation.isValid ?? validation.is_valid ?? false,
            is_valid: validation.is_valid ?? validation.isValid ?? false,
            input: validation.input || validation.campaign_name || validation.placement_name || ''
          });
          result.migrated.validations++;
        }
      } catch (error) {
        result.errors.push(`Failed to migrate validation history: ${error}`);
        result.success = false;
      }
    }

    // Clear localStorage after successful migration (optional)
    if (result.success) {
      console.log('Migration successful! You can now clear localStorage if desired.');
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(`Migration failed: ${error}`);
    return result;
  }
}

export function clearLegacyLocalStorage(): void {
  Object.values(LEGACY_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('Legacy localStorage cleared');
}

export function hasLegacyData(): boolean {
  return Object.values(LEGACY_STORAGE_KEYS).some(key => 
    localStorage.getItem(key) !== null
  );
}
