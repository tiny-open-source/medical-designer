/**
 * MCP Canvas Tools Configuration
 * Defines metadata and JSON Schema for all available tools
 */

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Configuration definitions for all MCP tools
 */
export const MCP_CANVAS_TOOLS: Record<string, MCPToolDefinition> = {
  // Component operation tools
  addComponent: {
    name: 'addComponent',
    description: 'Add a new component to the canvas. Supports setting component type, position, style and properties.',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Component type, supports button, text, container, img, qrcode, overlay',
        },
        name: {
          type: 'string',
          description: 'Component display name',
        },
        style: {
          type: 'object',
          description: 'Component styles',
          properties: {
            display: { type: 'string' },
            flexDirection: { type: 'string' },
            justifyContent: { type: 'string' },
            alignItems: { type: 'string' },
            flexWrap: { type: 'string' },
            marginTop: { type: 'string' },
            marginRight: { type: 'string' },
            marginBottom: { type: 'string' },
            marginLeft: { type: 'string' },
            paddingTop: { type: 'string' },
            paddingRight: { type: 'string' },
            paddingBottom: { type: 'string' },
            paddingLeft: { type: 'string' },
            width: { type: 'string' },
            height: { type: 'string' },
            overflow: { type: 'string' },
            fontSize: { type: 'string' },
            lineHeight: { type: 'string' },
            fontWeight: { type: 'string' },
            color: { type: 'string' },
            textAlign: { type: 'string' },
            backgroundColor: { type: 'string' },
            backgroundImage: { type: 'string' },
            backgroundSize: { type: 'string' },
            backgroundPosition: { type: 'string' },
            backgroundRepeat: { type: 'string' },
            position: { type: 'string' },
            zIndex: { type: 'number' },
            top: { type: 'string' },
            right: { type: 'string' },
            bottom: { type: 'string' },
            left: { type: 'string' },
            borderTopLeftRadius: { type: 'string' },
            borderTopRightRadius: { type: 'string' },
            borderBottomRightRadius: { type: 'string' },
            borderBottomLeftRadius: { type: 'string' },
            borderTopWidth: { type: 'string' },
            borderTopStyle: { type: 'string' },
            borderTopColor: { type: 'string' },
            borderRightColor: { type: 'string' },
            borderRightWidth: { type: 'string' },
            borderRightStyle: { type: 'string' },
            borderBottomWidth: { type: 'string' },
            borderBottomStyle: { type: 'string' },
            borderBottomColor: { type: 'string' },
            borderLeftStyle: { type: 'string' },
            borderLeftWidth: { type: 'string' },
            borderLeftColor: { type: 'string' },
            borderWidth: { type: 'string' },
            borderStyle: { type: 'string' },
            borderColor: { type: 'string' },
            transform: { type: 'object', description: 'CSS transform property', properties: {
              translate: { type: 'object', description: 'Translation values, such as "0px,0px"' },
              rotate: { type: 'string', description: 'Rotation value, such as "45deg"' },
              scale: { type: 'string', description: 'Scale value, such as "1,1"' },
              matrix: { type: 'string', description: 'Matrix transformation value, such as "1,0,0,1,0,0"' },
            } },
          },
        },
        position: {
          type: 'object',
          description: 'Component position coordinates',
          properties: {
            x: { type: 'number', description: 'X coordinate in pixels' },
            y: { type: 'number', description: 'Y coordinate in pixels' },
          },
          required: ['x', 'y'],
        },
        parentId: {
          type: ['string', 'number'],
          description: 'Parent container ID. If not specified, will add to currently selected container',
        },
        properties: {
          type: 'object',
          description: 'Component-specific properties, such as text, src, etc.',
        },
      },
      required: ['type', 'name', 'style', 'position'],
    },
  },

  removeComponent: {
    name: 'removeComponent',
    description: 'Remove specified component from canvas',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: ['string', 'number'],
          description: 'ID of component to remove',
        },
      },
      required: ['id'],
    },
  },

  updateComponent: {
    name: 'updateComponent',
    description: 'Update component properties, styles or name',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: ['string', 'number'],
          description: 'ID of component to update',
        },
        style: {
          type: 'object',
          description: 'Similar to the style attribute of addComponent, new style properties will be merged with existing styles',
        },
        properties: {
          type: 'object',
          description: 'New component properties, such as text, src, etc.',
        },
        name: {
          type: 'string',
          description: 'New component name',
        },
      },
      required: ['id'],
    },
  },

  selectComponent: {
    name: 'selectComponent',
    description: 'Select specified component. Can select directly by ID or find component by type, name and other conditions',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: ['string', 'number'],
          description: 'ID of component to select',
        },
        selector: {
          type: 'object',
          description: 'Component selector for finding components',
          properties: {
            type: {
              type: 'string',
              description: 'Find by component type',
            },
            name: {
              type: 'string',
              description: 'Find by component name',
            },
            index: {
              type: 'number',
              description: 'If multiple matches found, select the nth one (starting from 0)',
              default: 0,
            },
          },
        },
      },
    },
  },

  moveComponent: {
    name: 'moveComponent',
    description: 'Move component position. Can specify absolute position or relative offset',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: ['string', 'number'],
          description: 'ID of component to move',
        },
        position: {
          type: 'object',
          description: 'New absolute position',
          properties: {
            x: { type: 'number', description: 'X coordinate in pixels' },
            y: { type: 'number', description: 'Y coordinate in pixels' },
          },
          required: ['x', 'y'],
        },
        deltaX: {
          type: 'number',
          description: 'Relative offset on X axis in pixels',
        },
        deltaY: {
          type: 'number',
          description: 'Relative offset on Y axis in pixels',
        },
      },
      required: ['id'],
    },
  },

  copyComponent: {
    name: 'copyComponent',
    description: 'Copy specified component to clipboard',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: ['string', 'number'],
          description: 'ID of component to copy',
        },
      },
      required: ['id'],
    },
  },

  pasteComponent: {
    name: 'pasteComponent',
    description: 'Paste component from clipboard to specified position',
    parameters: {
      type: 'object',
      properties: {
        position: {
          type: 'object',
          description: 'Paste position. If not specified, will use default position',
          properties: {
            x: { type: 'number', description: 'X coordinate in pixels' },
            y: { type: 'number', description: 'Y coordinate in pixels' },
          },
          required: ['x', 'y'],
        },
      },
    },
  },
  // Query tools
  getComponentInfo: {
    name: 'getComponentInfo',
    description: 'Get detailed information of specified component, including properties, styles, position, child components, etc.',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: ['string', 'number'],
          description: 'Component ID',
        },
      },
      required: ['id'],
    },
  },

  getCanvasState: {
    name: 'getCanvasState',
    description: 'Get current canvas state, including selected component, total component count, current page, undo/redo state, etc.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },

  getPageStructure: {
    name: 'getPageStructure',
    description: 'Get complete component structure tree of current page, including hierarchical relationships of all components',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
};
