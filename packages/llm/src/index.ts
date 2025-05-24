import type { App } from 'vue';
import ChatLLM from './components/ChatLLM';
import './theme/index.scss';
import './theme/chat-form.scss';
import './theme/thinking-area.scss';

export * from './composables/chat';
export * from './composables/ollama';
export * from './composables/ui';
export { parseReasoning } from './libs/reasoning';
export * from './libs/to-base64';
export { isOllamaRunning } from './service/ollama';
export default {
  install: (app: App): void => {
    app.component(ChatLLM.name!, ChatLLM);
  },
};
