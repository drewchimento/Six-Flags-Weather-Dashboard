import Anthropic from '@anthropic-ai/sdk';
import type { ClaudeModel, ToolCall } from '../types';

export class AnthropicService {
  private client: Anthropic | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  isConfigured(): boolean {
    return !!this.client && !!this.apiKey;
  }

  async sendMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    model: ClaudeModel = 'claude-sonnet-4-20250514',
    systemPrompt?: string,
    onToolUse?: (tool: ToolCall) => void
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized. Please set API key.');
    }

    const toolCalls: ToolCall[] = [];

    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: 4096,
        system: systemPrompt || this.getDefaultSystemPrompt(),
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        tools: this.getMCPTools()
      });

      // Process tool use if present
      for (const content of response.content) {
        if (content.type === 'tool_use') {
          const toolCall: ToolCall = {
            id: content.id,
            name: content.name,
            status: 'running',
            parameters: content.input as Record<string, unknown>,
            startTime: Date.now()
          };
          
          toolCalls.push(toolCall);
          if (onToolUse) {
            onToolUse(toolCall);
          }

          // Simulate tool execution (in real implementation, this would call the MCP server)
          const result = await this.simulateToolExecution(content.name, content.input);
          
          toolCall.status = 'success';
          toolCall.result = result;
          toolCall.endTime = Date.now();
          toolCall.duration = toolCall.endTime - toolCall.startTime;
        }
      }

      // Extract text response
      const textContent = response.content.find(c => c.type === 'text');
      const responseText = textContent && 'text' in textContent ? textContent.text : '';

      return {
        response: responseText,
        toolCalls
      };
    } catch (error) {
      console.error('Error sending message to Anthropic:', error);
      throw error;
    }
  }

  private getDefaultSystemPrompt(): string {
    return `You are a Six Flags Media Planning expert assistant connected to the Six Flags MCP server. You have access to:

- Complete park intelligence for all 29 Six Flags parks
- Campaign and placement naming convention validation
- DMA market coverage analysis
- Metric translation between platforms
- Campaign name generation tools

When users ask questions:
1. Use the appropriate MCP tools to get accurate data
2. Provide clear, actionable insights
3. Use friendly, professional language with occasional theme park terminology
4. Validate names proactively and suggest corrections
5. Always cite specific park codes and DMAs in your responses

Remember: You're helping busy media planners make better decisions faster. Be concise but complete.`;
  }

  private getMCPTools() {
    return [
      {
        name: 'sixflags_validate_campaign_name',
        description: 'Validate Six Flags campaign naming convention compliance. Use this when users provide a campaign name to check.',
        input_schema: {
          type: 'object',
          properties: {
            campaign_name: {
              type: 'string',
              description: 'Campaign name to validate (e.g., CDFR_SFGA_DISP_MPART_X_X_Q3Q4_JUL2025_NOV2025)'
            },
            output_format: {
              type: 'string',
              enum: ['json', 'markdown'],
              description: 'Response format'
            }
          },
          required: ['campaign_name']
        }
      },
      {
        name: 'sixflags_validate_placement_name',
        description: 'Validate Six Flags placement naming convention compliance. Use this for placement-level name checks.',
        input_schema: {
          type: 'object',
          properties: {
            placement_name: {
              type: 'string',
              description: 'Placement name to validate'
            },
            output_format: {
              type: 'string',
              enum: ['json', 'markdown'],
              description: 'Response format'
            }
          },
          required: ['placement_name']
        }
      },
      {
        name: 'sixflags_get_park_intelligence',
        description: 'Get strategic intelligence for Six Flags parks including location, DMAs, and tier information.',
        input_schema: {
          type: 'object',
          properties: {
            park_code: {
              type: 'string',
              description: '4-character park code (e.g., SFGA, CPCP). Leave empty for all parks.'
            },
            detail_level: {
              type: 'string',
              enum: ['concise', 'detailed'],
              description: 'Level of detail in response'
            }
          }
        }
      },
      {
        name: 'sixflags_get_dma_insights',
        description: 'Get DMA market intelligence showing which parks serve specific markets.',
        input_schema: {
          type: 'object',
          properties: {
            dma_name: {
              type: 'string',
              description: 'DMA name to query (e.g., CHICAGO, LOS ANGELES)'
            }
          }
        }
      },
      {
        name: 'sixflags_translate_metric_names',
        description: 'Translate platform-specific metric names to Six Flags standard taxonomy.',
        input_schema: {
          type: 'object',
          properties: {
            metric_names: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of metric names to translate'
            }
          },
          required: ['metric_names']
        }
      },
      {
        name: 'sixflags_generate_campaign_name',
        description: 'Generate a Six Flags-compliant campaign name from components.',
        input_schema: {
          type: 'object',
          properties: {
            client_code: {
              type: 'string',
              description: 'Client code (e.g., CDFR)'
            },
            park_code: {
              type: 'string',
              description: 'Park code (e.g., SFGA)'
            },
            channel: {
              type: 'string',
              description: 'Media channel (e.g., DISP, CTV)'
            },
            partner: {
              type: 'string',
              description: 'Partner platform (e.g., MPART, META)'
            },
            period: {
              type: 'string',
              description: 'Time period (e.g., Q3Q4, FY25)'
            },
            start_month: {
              type: 'string',
              description: 'Start month in MMMYYYY format'
            },
            end_month: {
              type: 'string',
              description: 'End month in MMMYYYY format'
            }
          },
          required: ['park_code', 'channel', 'partner', 'period', 'start_month', 'end_month']
        }
      }
    ];
  }

  private async simulateToolExecution(toolName: string, input: unknown): Promise<unknown> {
    // This is a simulation - in production, this would call the actual MCP server
    // For now, return mock responses based on tool name
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    switch (toolName) {
      case 'sixflags_validate_campaign_name':
        return {
          is_valid: true,
          violations: [],
          recommendations: ['Campaign name is compliant with Six Flags standards.'],
          parsed_fields: input
        };
      
      case 'sixflags_get_park_intelligence':
        return {
          product_code: 'SFGA',
          product_name: 'Six Flags Great America',
          tier: '1',
          primary_dmas: 'CHICAGO, MILWAUKEE'
        };
      
      default:
        return { success: true, data: input };
    }
  }

  async streamMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    model: ClaudeModel,
    onChunk: (text: string) => void,
    onToolUse?: (tool: ToolCall) => void
  ): Promise<{ toolCalls: ToolCall[] }> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized.');
    }

    const toolCalls: ToolCall[] = [];

    try {
      const stream = await this.client.messages.stream({
        model,
        max_tokens: 4096,
        system: this.getDefaultSystemPrompt(),
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        tools: this.getMCPTools()
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && 'delta' in event && event.delta.type === 'text_delta') {
          onChunk(event.delta.text);
        }
        
        if (event.type === 'content_block_start' && 'content_block' in event && event.content_block.type === 'tool_use') {
          const toolCall: ToolCall = {
            id: event.content_block.id,
            name: event.content_block.name,
            status: 'running',
            parameters: {},
            startTime: Date.now()
          };
          toolCalls.push(toolCall);
          if (onToolUse) {
            onToolUse(toolCall);
          }
        }
      }

      return { toolCalls };
    } catch (error) {
      console.error('Error streaming message:', error);
      throw error;
    }
  }
}

// Singleton instance
export const anthropicService = new AnthropicService();
