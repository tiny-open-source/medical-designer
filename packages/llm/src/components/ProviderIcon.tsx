import { AliBaBaCloudIcon } from './Icons/AliBaBaCloud';
import { DeepSeekIcon } from './Icons/DeepSeek';
import { FireworksIcon } from './Icons/Fireworks';
import { GeminiIcon } from './Icons/GeminiIcon';
import { GroqIcon } from './Icons/Groq';
import { InfinigenceAIIcon } from './Icons/InfinigenceAI';
import { LlamafileIcon } from './Icons/Llamafile';
import { LMStudioIcon } from './Icons/LMStudio';
import { MistralIcon } from './Icons/Mistral';
import { NovitaIcon } from './Icons/Novita';
import { OllamaIcon } from './Icons/Ollama';
import { OpenAiIcon } from './Icons/OpenAI';
import { OpenRouterIcon } from './Icons/OpenRouter';
import { SiliconFlowIcon } from './Icons/SiliconFlow';
import { TencentCloudIcon } from './Icons/TencentCloud';
import { TogtherIcon } from './Icons/Togther';
import { VolcEngineIcon } from './Icons/VolcEngine';

export function ProviderIcons({
  provider,
  className,
}: {
  provider: string;
  className?: string;
}) {
  switch (provider) {
    case 'custom':
      return <div class={className} />;
    case 'fireworks':
      return <FireworksIcon className={className} />;
    case 'groq':
      return <GroqIcon className={className} />;
    case 'lmstudio':
      return <LMStudioIcon className={className} />;
    case 'openai':
      return <OpenAiIcon className={className} />;
    case 'together':
      return <TogtherIcon className={className} />;
    case 'openrouter':
      return <OpenRouterIcon className={className} />;
    case 'llamafile':
      return <LlamafileIcon className={className} />;
    case 'gemini':
      return <GeminiIcon className={className} />;
    case 'mistral':
      return <MistralIcon className={className} />;
    case 'deepseek':
      return <DeepSeekIcon className={className} />;
    case 'siliconflow':
      return <SiliconFlowIcon className={className} />;
    case 'volcengine':
      return <VolcEngineIcon className={className} />;
    case 'tencentcloud':
      return <TencentCloudIcon className={className} />;
    case 'alibabacloud':
      return <AliBaBaCloudIcon className={className} />;
    case 'infinitenceai':
      return <InfinigenceAIIcon className={className} />;
    case 'novita':
      return <NovitaIcon className={className} />;
    default:
      return <OllamaIcon className={className} />;
  }
}
