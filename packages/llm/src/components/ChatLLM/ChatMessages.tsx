import type { Message } from '@low-code/llm';
import type { PropType } from 'vue';
import { parseReasoning } from '@low-code/llm';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import { NImage, NSpin, NTooltip } from 'naive-ui';
import { defineComponent } from 'vue';
import ThinkingArea from './ThinkingArea';
import ToolCallConfirmation from './ToolCallConfirmation';

export default defineComponent({
  name: 'ChatMessages',
  props: {
    messages: Array as PropType<Message[]>,
  },
  setup(props) {
    // 初始化markdown解析器
    const md = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
      highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          }
          catch {}
        }
        return ''; // 使用默认转义
      },
    });

    const renderMarkdown = (content: string) => {
      return md.render(content);
    };

    // 解析消息内容，提取文本和工具调用标记
    const parseMessageContent = (content: string) => {
      const parts: Array<{
        type: 'text' | 'tool-call' | 'reasoning';
        content: string;
        toolStatus?: string;
        toolName?: string;
        toolRound?: number;
        toolDetails?: {
          arguments?: string;
          result?: string;
          error?: string;
        };
      }> = [];

      // 首先解析推理内容
      const reasoningParts = parseReasoning(content);

      for (const reasoningPart of reasoningParts) {
        if (reasoningPart.type === 'reasoning') {
          parts.push({
            type: 'reasoning',
            content: reasoningPart.content,
          });
        }
        else {
          // 对于非推理内容，继续解析工具调用标记
          const textContent = reasoningPart.content;
          const toolCallRegex = /<tool-call\s+status="([^"]+)"\s+name="([^"]+)"\s+round="([^"]+)"(?:\s+arguments="([^"]*)")?(?:\s+result="([^"]*)")?(?:\s+error="([^"]*)")?\s*\/>/g;

          let lastIndex = 0;
          let match;
          let hasToolCalls = false;

          while ((match = toolCallRegex.exec(textContent)) !== null) {
            hasToolCalls = true;

            // 添加工具调用前的文本
            if (match.index > lastIndex) {
              const beforeText = textContent.slice(lastIndex, match.index).trim();
              if (beforeText) {
                parts.push({
                  type: 'text',
                  content: beforeText,
                });
              }
            }

            // 解码工具调用详情
            const toolDetails: any = {};
            if (match[4]) { // arguments
              try {
                toolDetails.arguments = decodeURIComponent(atob(match[4]));
              }
              catch (e) {
                console.warn('解析工具参数失败:', e);
              }
            }
            if (match[5]) { // result
              try {
                toolDetails.result = decodeURIComponent(atob(match[5]));
              }
              catch (e) {
                console.warn('解析工具结果失败:', e);
              }
            }
            if (match[6]) { // error
              try {
                toolDetails.error = decodeURIComponent(atob(match[6]));
              }
              catch (e) {
                console.warn('解析工具错误失败:', e);
              }
            }

            // 添加工具调用标记
            parts.push({
              type: 'tool-call',
              content: '',
              toolStatus: match[1],
              toolName: match[2],
              toolRound: Number.parseInt(match[3]),
              toolDetails: Object.keys(toolDetails).length > 0 ? toolDetails : undefined,
            });

            lastIndex = match.index + match[0].length;
          }

          // 如果有工具调用，添加最后剩余的文本
          if (hasToolCalls && lastIndex < textContent.length) {
            const remainingText = textContent.slice(lastIndex).trim();
            if (remainingText) {
              parts.push({
                type: 'text',
                content: remainingText,
              });
            }
          }

          // 如果没有工具调用标记，添加整个文本
          if (!hasToolCalls && textContent.trim()) {
            parts.push({
              type: 'text',
              content: textContent,
            });
          }
        }
      }

      return parts;
    };

    // 渲染单个工具调用状态
    const renderToolCallIndicator = (
      status: string,
      toolName: string,
      round: number,
      details?: {
        arguments?: string;
        result?: string;
        error?: string;
      },
    ) => {
      // 构建工具提示内容
      const renderTooltipContent = () => {
        if (!details || status === 'executing') {
          return (
            <div style={{ maxWidth: '300px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {toolName}
                {' '}
                (第
                {round}
                轮)
              </div>
              <div style={{ color: '#666' }}>
                {status === 'executing' ? '正在执行中...' : '暂无详细信息'}
              </div>
            </div>
          );
        }

        // 格式化JSON参数
        const formatJson = (jsonStr: string) => {
          try {
            const parsed = JSON.parse(jsonStr);
            return JSON.stringify(parsed, null, 2);
          }
          catch {
            return jsonStr;
          }
        };

        return (
          <div style={{ maxWidth: '500px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
              {toolName}
              {' '}
              (第
              {round}
              轮)
            </div>

            {details.arguments && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontWeight: 'bold',
                  marginBottom: '6px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                >
                  调用参数:
                </div>
                <div style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '200px',
                  overflow: 'auto',
                  border: '1px solid #e9ecef',
                  lineHeight: '1.4',
                  color: '#333',
                }}
                >
                  {formatJson(details.arguments)}
                </div>
              </div>
            )}

            {details.result && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{
                  fontWeight: 'bold',
                  marginBottom: '6px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                >
                  返回结果:
                </div>
                <div style={{
                  background: '#f6ffed',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '250px',
                  overflow: 'auto',
                  border: '1px solid #b7eb8f',
                  lineHeight: '1.4',
                  color: '#333',
                }}
                >
                  {details.result}
                </div>
              </div>
            )}

            {details.error && (
              <div>
                <div style={{
                  fontWeight: 'bold',
                  marginBottom: '6px',
                  color: '#d03050',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                >
                  ❌ 错误信息:
                </div>
                <div style={{
                  background: '#fff2f0',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '150px',
                  overflow: 'auto',
                  border: '1px solid #ffccc7',
                  lineHeight: '1.4',
                }}
                >
                  {details.error}
                </div>
              </div>
            )}
          </div>
        );
      };

      const indicator = (
        <div
          class="lc-llm-tool-status"
          style={{
            cursor: details || status !== 'executing' ? 'help' : 'default',
            transition: 'all 0.2s ease',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
          onMouseenter={(e: MouseEvent) => {
            if (details || status !== 'executing') {
              (e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              (e.target as HTMLElement).style.borderColor = 'rgba(0, 0, 0, 0.2)';
            }
          }}
          onMouseleave={(e: MouseEvent) => {
            (e.target as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
            (e.target as HTMLElement).style.borderColor = 'rgba(0, 0, 0, 0.1)';
          }}
        >
          <div class="lc-llm-tool-status__indicator">
            {status === 'executing'
              ? (
                  <NSpin
                    size={14}
                    contentStyle={{ color: '#1890ff' }}
                    class="lc-llm-tool-status__spinner"
                  >
                  </NSpin>
                )
              : status === 'completed'
                ? (
                    <span class="lc-llm-tool-status__icon lc-llm-tool-status__icon--completed">
                      <svg viewBox="-2 -2 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z" /></svg>
                    </span>
                  )
                : (
                    <span class="lc-llm-tool-status__icon lc-llm-tool-status__icon--failed">
                      <svg viewBox="-2 -2 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6zM7.9 7.5L10.3 5l.7.7-2.4 2.5 2.4 2.5-.7.7-2.4-2.5-2.4 2.5-.7-.7 2.4-2.5-2.4-2.5.7-.7 2.4 2.5z" />
                      </svg>
                    </span>
                  )}
          </div>
          <span class="lc-llm-tool-status__name">{toolName}</span>
        </div>
      );

      // 如果有详细信息或者状态不是executing，显示工具提示
      if (details || status !== 'executing') {
        return (
          <NTooltip trigger="hover" placement="top">
            {{
              trigger: () => indicator,
              default: () => renderTooltipContent(),
            }}
          </NTooltip>
        );
      }

      return indicator;
    };

    return () => props.messages?.map((message, index) => (
      <div class="lc-llm-chat-messages__message" key={index}>
        <div class="lc-llm-chat-messages__container">
          <div class="lc-llm-chat-messages__content">
            <span class={`lc-llm-chat-messages__name ${message.isBot ? 'lc-llm-chat-messages__name--bot' : 'lc-llm-chat-messages__name--user'}`}>
              {message.isBot ? message.name || 'Assistant' : 'You'}
            </span>
            <div class="lc-llm-chat-messages__body">
              {message.isBot
                ? (
                    <div>
                      {/* 解析并渲染消息内容（包含工具调用标记） */}
                      {parseMessageContent(message.message).map((part, i) => {
                        if (part.type === 'reasoning') {
                          return (
                            <ThinkingArea content={part.content} key={i} />
                          );
                        }
                        else if (part.type === 'tool-call') {
                          return (
                            <div key={i}>
                              {renderToolCallIndicator(
                                part.toolStatus!,
                                part.toolName!,
                                part.toolRound!,
                                part.toolDetails,
                              )}
                            </div>
                          );
                        }
                        else {
                          // 普通文本内容
                          return <div class="prose dark:prose-invert lc-llm-chat-messages__text" key={i} innerHTML={renderMarkdown(part.content)} />;
                        }
                      })}

                      {/* 工具调用轮次确认 */}
                      {message.toolCallConfirmation?.show && (
                        <ToolCallConfirmation
                          currentRound={message.toolCallConfirmation.currentRound}
                          maxRound={message.toolCallConfirmation.maxRound}
                          onContinue={message.toolCallConfirmation.onContinue || (() => {})}
                          onCancel={message.toolCallConfirmation.onCancel || (() => {})}
                        />
                      )}
                    </div>
                  )
                : (
                    <div>
                      <div
                        class={`prose dark:prose-invert lc-llm-chat-messages__text lc-llm-chat-messages__text--user ${
                          message.messageType ? 'lc-llm-chat-messages__text--user-system' : ''}`}
                      >
                        {message.message}
                      </div>
                      {message.images?.[0]
                        ? <NImage src={message.images[0]}></NImage>
                        : null}
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    ));
  },
});
