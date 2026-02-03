// Six Flags MCP Server Types

export interface Park {
  product_name: string;
  product_code: string;
  tier: string;
  brand: string;
  location: {
    address: string;
    city: string;
    state: string;
    region: string;
    coordinates: {
      lat: string;
      lon: string;
    };
    unique_feature?: string;
  };
  primary_dmas: string;
  secondary_dmas: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  attachments?: FileAttachment[];
}

export interface ToolCall {
  id: string;
  name: string;
  status: 'running' | 'success' | 'error';
  parameters?: Record<string, unknown>;
  result?: unknown;
  duration?: number;
  startTime: number;
  endTime?: number;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type ClaudeModel = 
  | 'claude-sonnet-4-20250514'
  | 'claude-opus-4-20250514'
  | 'claude-3-7-sonnet-20250219';

export interface ClaudeConfig {
  apiKey: string;
  model: ClaudeModel;
}

export interface ValidationResult {
  type?: 'campaign' | 'placement' | 'io';
  input: string;
  campaign_name?: string;
  placement_name?: string;
  isValid: boolean;
  is_valid: boolean;
  violations: Array<{
    field: string;
    issue: string;
    current_value: string;
    expected: string;
  }>;
  parsed_fields?: Record<string, string>;
  recommendations: string[];
  channel_specific_validation?: Record<string, unknown>;
  timestamp: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
  category: 'validation' | 'search' | 'generation' | 'translation';
  fields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'select' | 'date';
    placeholder?: string;
    options?: string[];
    required: boolean;
  }>;
}

export interface MCPTool {
  name: string;
  description: string;
  status: 'available' | 'unavailable' | 'error';
  category: string;
}

export interface DMAInsight {
  dma_name: string;
  coverage: {
    primary_parks: Array<{
      code: string;
      name: string;
      tier: string;
    }>;
    secondary_parks: Array<{
      code: string;
      name: string;
      tier: string;
    }>;
  };
  strategic_notes?: string[];
}

export interface MetricTranslation {
  standard_name: string;
  all_variations: string[];
}

export interface CampaignNameComponents {
  client_code: string;
  park_code: string;
  channel: string;
  partner: string;
  campaign_type: string;
  initiative: string;
  period: string;
  start_month: string;
  end_month: string;
}
