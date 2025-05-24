import { isOllamaRunning } from '../service/ollama';

export function useOllamaStatus() {
  const status = ref<'success' | 'pending' | 'error'>('pending');
  const check = async () => {
    const isRunning = await isOllamaRunning();
    status.value = isRunning ? 'success' : 'error';
  };
  return {
    status,
    check,
  };
}
