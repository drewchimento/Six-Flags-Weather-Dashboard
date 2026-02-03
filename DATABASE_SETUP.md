# Six Flags Dashboard - Blink Database Setup

## Overview

The Six Flags Media Planning Dashboard now uses **Blink Database** for persistent data storage instead of localStorage. This provides better scalability, security, and cross-device synchronization.

## Database Schema

### Tables

#### 1. `user_settings`
Stores user preferences and API keys per user.

```sql
- id (TEXT): Primary key
- userId (TEXT): User identifier
- apiKey (TEXT): Anthropic API key (encrypted)
- weatherApiKey (TEXT): OpenWeather API key (encrypted)
- selectedModel (TEXT): Preferred Claude model (default: 'claude-sonnet-4-20250514')
- theme (TEXT): UI theme preference (light/dark, default: 'light')
- createdAt (INTEGER): Creation timestamp
- updatedAt (INTEGER): Last update timestamp
```

#### 2. `conversations`
Stores chat conversation metadata.

```sql
- id (TEXT): Primary key
- userId (TEXT): Owner user ID
- title (TEXT): Conversation title
- model (TEXT): Claude model used
- createdAt (INTEGER): Creation timestamp
- updatedAt (INTEGER): Last update timestamp
```

#### 3. `messages`
Stores individual messages within conversations.

```sql
- id (TEXT): Primary key
- conversationId (TEXT): Foreign key to conversations
- userId (TEXT): Message author
- role (TEXT): 'user' or 'assistant'
- content (TEXT): JSON-encoded message content
- toolCalls (TEXT): JSON-encoded tool call data
- timestamp (INTEGER): Message timestamp
```

#### 4. `validation_history`
Stores campaign/placement validation results.

```sql
- id (TEXT): Primary key
- userId (TEXT): User who ran validation
- validationType (TEXT): 'campaign', 'placement', or 'io'
- inputValue (TEXT): Original input
- result (TEXT): JSON-encoded validation result
- isValid (INTEGER): 1 if valid, 0 if invalid
- timestamp (INTEGER): Validation timestamp
```

## Migration from localStorage

If you have existing data in localStorage, migrate it to the database:

### Automatic Migration

```typescript
import { migrateLocalStorageToDatabase, hasLegacyData, clearLegacyLocalStorage } from './utils/migrate-to-database';

// Check if migration is needed
if (hasLegacyData()) {
  const result = await migrateLocalStorageToDatabase();
  
  if (result.success) {
    console.log(`Migrated:
      - Settings: ${result.migrated.settings}
      - Conversations: ${result.migrated.conversations}
      - Validations: ${result.migrated.validations}
    `);
    
    // Optionally clear localStorage
    clearLegacyLocalStorage();
  } else {
    console.error('Migration errors:', result.errors);
  }
}
```

### Manual Migration

1. Export your localStorage data from Settings → Export Data
2. Save the JSON file
3. Clear localStorage (optional)
4. Import the data from Settings → Import Data

## Usage in Components

The storage service automatically uses the database. All methods are now async:

```typescript
import { storageService } from './services/storage';

// API Keys
await storageService.saveApiKey('your-key');
const apiKey = await storageService.getApiKey();

// Conversations
await storageService.saveConversation(conversation);
const conversations = await storageService.getAllConversations();
const conv = await storageService.getConversation(id);
await storageService.deleteConversation(id);

// Settings
await storageService.saveModel('claude-sonnet-4-20250514');
await storageService.saveTheme('dark');

// Validation
await storageService.saveValidationResult(result);
const history = await storageService.getValidationHistory();
```

## Direct Database Access

For advanced queries, use the database service directly:

```typescript
import { databaseService } from './services/database';

// Custom queries
const settings = await databaseService.getUserSettings();
const recentConversations = await databaseService.getAllConversations();
```

## Database Operations

### Create Tables (Already Done)
The tables are automatically created when the app initializes. See `src/services/database.ts`.

### Query Data
```typescript
// Using Blink SDK
import { createClient } from '@blinkdotnew/sdk';
const blink = createClient({ projectId: 'your-project-id' });

const conversations = await blink.db.conversations.list({
  where: { userId: 'current-user' },
  orderBy: { updatedAt: 'desc' },
  limit: 10
});
```

### Update Data
```typescript
await blink.db.user_settings.update(settingsId, {
  theme: 'dark',
  updatedAt: Date.now()
});
```

### Delete Data
```typescript
await blink.db.conversations.delete(conversationId);
```

## Performance Considerations

1. **Indexes**: Created on `userId` and `conversationId` for fast queries
2. **Batch Operations**: Messages are saved in batches per conversation
3. **Pagination**: Use `limit` parameter for large result sets
4. **Caching**: Consider implementing client-side caching for frequently accessed data

## Security

- API keys are stored in the database (consider encryption for production)
- All data is scoped to `userId` to prevent cross-user access
- SQLite backend with Blink's security layer

## Backup & Export

Users can export all their data:

```typescript
const jsonData = await storageService.exportAllData();
// Save to file or cloud storage
```

## Troubleshooting

### Data not persisting
- Check that the Blink SDK is initialized correctly
- Verify database tables exist (check browser console)
- Ensure `userId` is set correctly in database service

### Migration issues
- Check browser console for detailed error messages
- Verify localStorage data format
- Try manual export/import as fallback

### Performance issues
- Check network tab for slow database queries
- Consider implementing pagination for large datasets
- Use indexes for frequently queried fields

## Future Enhancements

- [ ] User authentication integration
- [ ] Real-time sync across devices
- [ ] Offline support with queue
- [ ] Data encryption at rest
- [ ] Automatic backup to cloud storage
