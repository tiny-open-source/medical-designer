import { cleanUrl } from '../libs/clean-url';

const DEFAULT_OLLAMA_URL = 'http://frp-web.hgyn23.cn';
export async function getOllamaURL() {
  const ollamaURL = localStorage.getItem('ollamaURL');
  if (!ollamaURL || ollamaURL.length === 0) {
    return DEFAULT_OLLAMA_URL;
  }
  return ollamaURL;
}
export async function isOllamaRunning() {
  try {
    const baseUrl = await getOllamaURL();
    const response = await fetch(`${cleanUrl(baseUrl)}`, {
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return true;
  }
  catch (e) {
    console.error(e);
    return false;
  }
}
