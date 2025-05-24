import { cleanUrl } from '../libs/clean-url';

const DEFAULT_OLLAMA_URL = 'https://frp-web.hgyn23.cn';
export function getOllamaURL() {
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
export async function setOllamaURL(ollamaURL: string) {
  let formattedUrl = ollamaURL;
  if (formattedUrl.startsWith('http://localhost:')) {
    formattedUrl = formattedUrl.replace(
      'http://localhost:',
      'http://127.0.0.1:',
    );
  }
  localStorage.setItem('ollamaURL', cleanUrl(formattedUrl));
}

export async function getAllModels() {
  try {
    const baseUrl = await getOllamaURL();
    const response = await fetch(`${cleanUrl(baseUrl)}/api/tags`);
    if (response.status !== 200) {
      return [];
    }
    const json = await response.json();

    return json.models.map((model: any) => {
      return {
        ...model,
        name: model.name,
        nickname: model.name,
        label: model.name,
        value: model.name,
        avatar: undefined,
      };
    }) as {
      label: string;
      value: string;
      name: string;
      model: string;
      modified_at: string;
      size: number;
      digest: string;
      nickname?: string;
      avatar?: string;
      details: {
        parent_model: string;
        format: string;
        family: string;
        families: string[];
        parameter_size: string;
        quantization_level: string;
      };
    }[];
  }
  catch (e) {
    console.error(e);
    return [];
  }
}
