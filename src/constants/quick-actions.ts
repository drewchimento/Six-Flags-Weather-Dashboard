import type { QuickAction } from '../types';

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'validate-campaign',
    title: 'Validate Campaign Name',
    description: 'Check if your campaign name follows Six Flags naming standards',
    icon: '✓',
    category: 'validation',
    prompt: 'Validate this campaign name: ',
    fields: [
      {
        name: 'campaignName',
        label: 'Campaign Name',
        type: 'text',
        placeholder: 'CDFR_SFGA_DISP_MPART_X_X_Q3Q4_JUL2025_NOV2025',
        required: true
      }
    ]
  },
  {
    id: 'validate-placement',
    title: 'Validate Placement Name',
    description: 'Verify placement name compliance before trafficking',
    icon: '📍',
    category: 'validation',
    prompt: 'Validate this placement name: ',
    fields: [
      {
        name: 'placementName',
        label: 'Placement Name',
        type: 'text',
        placeholder: 'ZGTD_CTV_PROGO_INSVID_VAST15_X_AWAR_FAM2549_X_X_DMA_CHICAGO_SFGABASEFALL',
        required: true
      }
    ]
  },
  {
    id: 'search-parks',
    title: 'Search for Parks',
    description: 'Find parks by tier, region, or market coverage',
    icon: '🎢',
    category: 'search',
    prompt: 'Find parks matching: ',
    fields: [
      {
        name: 'query',
        label: 'Search Query',
        type: 'text',
        placeholder: 'e.g., Tier 1 parks in California',
        required: true
      }
    ]
  },
  {
    id: 'dma-coverage',
    title: 'Find DMA Coverage',
    description: 'See which parks serve a specific market',
    icon: '📊',
    category: 'search',
    prompt: 'Which parks serve the ',
    fields: [
      {
        name: 'dmaName',
        label: 'DMA Name',
        type: 'text',
        placeholder: 'CHICAGO',
        required: true
      }
    ]
  },
  {
    id: 'generate-campaign',
    title: 'Generate Campaign Name',
    description: 'Create a compliant campaign name from components',
    icon: '✨',
    category: 'generation',
    prompt: 'Generate a campaign name with these components: ',
    fields: [
      {
        name: 'parkCode',
        label: 'Park Code',
        type: 'text',
        placeholder: 'SFGA',
        required: true
      },
      {
        name: 'channel',
        label: 'Channel',
        type: 'select',
        options: ['DISP', 'CTV', 'OOH', 'SEM', 'AUD', 'OLV'],
        required: true
      },
      {
        name: 'partner',
        label: 'Partner',
        type: 'text',
        placeholder: 'MPART',
        required: true
      },
      {
        name: 'startMonth',
        label: 'Start Month',
        type: 'text',
        placeholder: 'JUL2025',
        required: true
      },
      {
        name: 'endMonth',
        label: 'End Month',
        type: 'text',
        placeholder: 'NOV2025',
        required: true
      }
    ]
  },
  {
    id: 'generate-placement',
    title: 'Generate Placement Name',
    description: 'Build a valid placement name step-by-step',
    icon: '🎯',
    category: 'generation',
    prompt: 'Generate a placement name with: ',
    fields: [
      {
        name: 'partner',
        label: 'Partner',
        type: 'text',
        placeholder: 'ZGTD',
        required: true
      },
      {
        name: 'channel',
        label: 'Channel',
        type: 'select',
        options: ['CTV', 'DISP', 'DOOH', 'AUD', 'SEM', 'OLV'],
        required: true
      },
      {
        name: 'dmaName',
        label: 'DMA Name',
        type: 'text',
        placeholder: 'CHICAGO',
        required: true
      },
      {
        name: 'parkCode',
        label: 'Park Code',
        type: 'text',
        placeholder: 'SFGA',
        required: true
      }
    ]
  }
];

export const MCP_TOOLS = [
  {
    name: 'sixflags_validate_campaign_name',
    description: 'Validate Six Flags campaign naming convention compliance',
    status: 'available' as const,
    category: 'Naming & Validation'
  },
  {
    name: 'sixflags_validate_placement_name',
    description: 'Validate Six Flags placement naming convention compliance',
    status: 'available' as const,
    category: 'Naming & Validation'
  },
  {
    name: 'sixflags_generate_campaign_name',
    description: 'Generate a Six Flags-compliant campaign name from components',
    status: 'available' as const,
    category: 'Naming & Validation'
  },
  {
    name: 'sixflags_get_park_intelligence',
    description: 'Retrieve strategic intelligence for Six Flags parks',
    status: 'available' as const,
    category: 'Park Intelligence'
  },
  {
    name: 'sixflags_get_dma_insights',
    description: 'Get DMA market intelligence and park relationships',
    status: 'available' as const,
    category: 'Park Intelligence'
  },
  {
    name: 'sixflags_translate_metric_names',
    description: 'Translate platform-specific metric names to Six Flags standards',
    status: 'available' as const,
    category: 'Data Translation'
  }
];
