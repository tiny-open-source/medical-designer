import Designer from '@low-code/designer';
import Form from '@low-code/form';
import LLM from '@low-code/llm';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
// import '@low-code/designer/style';
import '@unocss/reset/tailwind-compat.css';
import './assets/reset.css';
import 'virtual:uno.css';

const app = createApp(App);

app.use(createPinia());
app.use(Designer);
app.use(LLM);
app.use(Form, {});

app.mount('#app');
