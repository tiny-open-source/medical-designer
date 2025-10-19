import type { MApp, MNode, MPage } from '@low-code/schema';
import type { FigmaJson, FigmaLayersNode, FigmaPageNode } from './figma-json';
import { NodeType } from '@low-code/schema';

// 基础样式接口
interface BaseStyle {
  position: 'absolute';
  width: number;
  height: number;
  top: number;
  left: number;
  [key: string]: any;
}

// 添加节点位置接口
interface NodePosition {
  relativeX: number; // 相对于页面根节点的绝对位置
  relativeY: number;
}

// 基础节点访问者
abstract class NodeVisitor {
  abstract visit(node: any, parentPosition?: NodePosition): MNode;

  protected calculateRelativePosition(frame: any, parentPosition?: NodePosition): { top: number; left: number } {
    if (!parentPosition) {
      return {
        top: frame.top,
        left: frame.left,
      };
    }

    // 计算相对于最近绝对定位父元素的位置
    return {
      top: parentPosition.relativeY,
      left: parentPosition.relativeX,
    };
  }

  protected createBaseStyle(frame: any, parentPosition?: NodePosition): BaseStyle {
    const { top, left } = this.calculateRelativePosition(frame, parentPosition);

    return {
      position: 'absolute',
      width: +frame.width,
      height: +frame.height,
      top: +top,
      left: +left,
      right: undefined,
      bottom: undefined,
      // 背景相关
      backgroundImage: '',
      backgroundColor: 'transparent',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      backgroundPosition: '',

      // 文字相关
      color: '',
      fontSize: '',
      fontWeight: '',
      lineHeight: '',
      textAlign: '',

      // 布局相关
      display: '',
      flexDirection: '',
      justifyContent: '',
      alignItems: '',
      flexWrap: '',

      // 间距相关
      marginTop: '',
      marginRight: '',
      marginBottom: '',
      marginLeft: '',
      paddingTop: '',
      paddingRight: '',
      paddingBottom: '',
      paddingLeft: '',

      // 其他
      opacity: 1,
      overflow: 'initial',
      zIndex: '',

      // 变换
      transform: {
        rotate: '',
        scale: '',
      },

      // 边框相关
      borderTopLeftRadius: '',
      borderTopRightRadius: '',
      borderBottomRightRadius: '',
      borderBottomLeftRadius: '',
      borderTopWidth: '',
      borderTopStyle: '',
      borderTopColor: '',
      borderRightWidth: '',
      borderRightStyle: '',
      borderRightColor: '',
      borderBottomWidth: '',
      borderBottomStyle: '',
      borderBottomColor: '',
      borderLeftWidth: '',
      borderLeftStyle: '',
      borderLeftColor: '',
      borderWidth: '',
      borderStyle: '',
      borderColor: '',
    };
  }

  protected parseFills(styleObject: any, fills: any[]): object {
    if (!fills.length)
      return styleObject;
    fills.forEach((fill) => {
      if (fill.type === 'gradient') {
        const gradient = fill.gradient;
        if (gradient.type === 0) { // 线性渐变
          const stops = gradient.stops.map((stop: any) => {
            const color = stop.color.value;
            const position = stop.position * 100;
            return `${color} ${position}%`;
          }).join(', ');

          // 计算渐变角度
          const from = gradient.from;
          const to = gradient.to;
          const angle = calcDeg(from, to);

          styleObject.backgroundImage = `linear-gradient(${angle}deg, ${stops})`;
        }
      }
      else if (fill.type === 'color') {
        styleObject.backgroundColor = fill?.color?.value;
      }
    });

    return styleObject;
  }

  protected parseStyle(node: any, parentPosition?: NodePosition): object {
    const baseStyle = this.createBaseStyle(node.frame, parentPosition);

    if (node.style?.fills) {
      this.parseFills(baseStyle, node.style.fills);
    }

    // 处理透明度
    if (node.opacity) {
      baseStyle.opacity = node.opacity;
    }

    // 处理边框圆角
    if (node.paths?.[0]?.radius) {
      const radius = node.paths[0].radius;
      baseStyle.borderTopLeftRadius = radius.topLeft;
      baseStyle.borderTopRightRadius = radius.topRight;
      baseStyle.borderBottomRightRadius = radius.bottomRight;
      baseStyle.borderBottomLeftRadius = radius.bottomLeft;
    }

    return baseStyle;
  }
}

// 页面节点访问者
class PageNodeVisitor extends NodeVisitor {
  visit(node: FigmaPageNode, parentPosition?: NodePosition): MNode {
    return {
      type: 'page',
      id: `page_${node.id}`,
      name: node.name,
      title: '',
      layout: 'absolute',
      style: {
        ...this.parseStyle(node, parentPosition),
        ...{
          top: 0,
          left: 0,
        },
      },
      items: node.layers ?? [],
    };
  }
}

// 其他访问者类同样优化
class ArtBoardNodeVisitor extends NodeVisitor {
  visit(node: any, parentPosition?: NodePosition): MNode {
    return {
      id: `component_${node.id}`,
      type: 'container',
      name: node.name,
      layout: 'absolute',
      style: this.parseStyle(node, parentPosition),
      events: [],
      created: '',
      items: node.layers ?? [],
    };
  }
}

class ShapeLayerNodeVisitor extends NodeVisitor {
  visit(node: any, parentPosition?: NodePosition): MNode {
    return {
      id: `component_${node.id}`,
      type: 'container',
      name: node.name,
      layout: 'absolute',
      style: this.parseStyle(node, parentPosition),
      events: [],
      created: '',
      items: [],
    };
  }
}

class GroupLayerNodeVisitor extends NodeVisitor {
  visit(node: FigmaLayersNode, parentPosition?: NodePosition): MNode {
    return {
      id: `component_${node.id}`,
      type: 'container',
      name: node.name,
      layout: 'absolute',
      style: this.parseStyle(node, parentPosition),
      events: [],
      created: '',
      items: node.layers ?? [],
    };
  }
}

class TextLayerNodeVisitor extends NodeVisitor {
  visit(node: FigmaLayersNode, parentPosition?: NodePosition): MNode {
    return {
      id: `component_${node.id}`,
      type: 'text',
      name: node.name,
      text: node.text?.value,
      style: {
        ...this.parseStyle(node, parentPosition),
        backgroundColor: '',
        color: node.style?.fills?.[0]?.color?.value,
        fontSize: node.text?.style.font.size,
        fontWeight: node.text?.style.font.fontWeight,
        lineHeight: calcLineHeight(node.text?.style.font.lineHeight, node.text?.style.font.size),
      },
      events: [],
      created: '',
    };
  }
}

class NodeParser {
  private visitors: Map<string, NodeVisitor>;
  private static instance: NodeParser;

  private constructor() {
    this.visitors = new Map();
    this.registerDefaultVisitors();
  }

  static getInstance(): NodeParser {
    if (!NodeParser.instance) {
      NodeParser.instance = new NodeParser();
    }
    return NodeParser.instance;
  }

  private registerDefaultVisitors() {
    this.visitors.set('page', new PageNodeVisitor());
    this.visitors.set('artboard', new ArtBoardNodeVisitor());
    this.visitors.set('shapeLayer', new ShapeLayerNodeVisitor());
    this.visitors.set('groupLayer', new GroupLayerNodeVisitor());
    this.visitors.set('textLayer', new TextLayerNodeVisitor());
  }

  parse(node: any, type?: string, parentPosition?: NodePosition): MNode {
    const visitor = this.visitors.get(type ?? node.type);
    if (!visitor) {
      throw new Error(`Unsupported node type: ${type ?? node.type}`);
    }
    try {
      return visitor.visit(node, parentPosition);
    }
    catch (error: any) {
      throw new Error(`Parse error: ${error.message}`);
    }
  }
}

export class FigmaParser {
  private nodeParser: NodeParser;

  constructor() {
    this.nodeParser = NodeParser.getInstance();
  }

  parse(figmaJson: FigmaJson): MApp {
    try {
      this.validateFigmaJson(figmaJson);
      const { artboard, meta } = figmaJson;
      return {
        type: NodeType.ROOT,
        name: meta.device,
        id: meta.id,
        items: [this.parsePage(artboard)],
      };
    }
    catch (error: any) {
      throw new Error(`Figma parse error: ${error.message}`);
    }
  }

  private validateFigmaJson(figmaJson: FigmaJson): void {
    if (!figmaJson) {
      throw new Error('Figma JSON is empty');
    }
    if (!figmaJson.artboard) {
      throw new Error('Figma JSON must have an artboard node');
    }
    if (!figmaJson.meta) {
      throw new Error('Figma JSON must have a meta node');
    }
  }

  private parsePage(node: FigmaPageNode): MPage {
    // 页面是第一个绝对定位元素
    const pagePosition: NodePosition = {
      relativeX: 0,
      relativeY: 0,
    };

    const result = this.nodeParser.parse(node, 'page');
    result.items = Array.isArray(result.items)
      ? result.items.map(child => this.parseNode(child, [pagePosition]))
      : [];
    return result as MPage;
  }

  private parseNode(node: FigmaLayersNode, parentPosition: NodePosition[]): MNode {
    // 计算当前节点的绝对位置
    const currentPosition: NodePosition = {
      relativeX: (node.frame?.left || 0) - parentPosition.reduce((acc, cur) => acc + cur.relativeX, 0),
      relativeY: (node.frame?.top || 0) - parentPosition.reduce((acc, cur) => acc + cur.relativeY, 0),
    };

    const parsedNode = this.nodeParser.parse(node, node.type, currentPosition);

    if (Array.isArray(parsedNode.items)) {
      parsedNode.items = parsedNode.items.map(child =>
        this.parseNode(child, parentPosition.concat(currentPosition)),
      );
    }

    return parsedNode;
  }
}
function calcLineHeight(t: any, e: any) {
  return typeof t === 'object' && t ? (t == null ? void 0 : t.unit.toUpperCase()) === 'PERCENT' ? t.value * e / 100 : (t == null ? void 0 : t.unit.toUpperCase()) === 'AUTO' ? 1.171875 * e : t == null ? void 0 : t.value : t;
}
function calcDeg(from: { x: number; y: number }, to: { x: number; y: number }) {
  const i = from;
  const o = to;
  const a = o.x - i.x;
  const r = o.y - i.y;
  let n = 180 * Math.atan2(r, a) / Math.PI + 90;
  if (n < 0) {
    n += 360;
  }
  return n;
}
// const parser = new FigmaParser();
// const dsl = parser.parse(mockFigmaJson);
// console.dir(dsl, { depth: 1 });
