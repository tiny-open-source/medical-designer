import type { Message } from '@low-code/llm';
import type { PropType } from 'vue';
import { parseReasoning } from '@low-code/llm';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import { NImage } from 'naive-ui';
import { defineComponent } from 'vue';
import ThinkingArea from './ThinkingArea';

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

    return () => props.messages?.map((message, index) => (
      <div class="lc-llm-chat-messages__message" key={index}>
        <div class="lc-llm-chat-messages__container">
          <div class="lc-llm-chat-messages__content">
            <span class={`lc-llm-chat-messages__name ${message.isBot ? 'lc-llm-chat-messages__name--bot' : 'lc-llm-chat-messages__name--user'}`}>
              {message.isBot ? message.name || 'Assistant' : 'You'}
            </span>
            <div class="lc-llm-chat-messages__body">
              {message.isBot
                ? parseReasoning(message.message).map((e, i) => {
                    if (e.type === 'reasoning') {
                      return (
                        <ThinkingArea content={e.content} key={i} />
                      );
                    }
                    return <div class="prose dark:prose-invert lc-llm-chat-messages__text" key={i} innerHTML={renderMarkdown(e.content)} />;
                  })
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
