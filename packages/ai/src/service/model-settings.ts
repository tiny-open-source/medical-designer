interface ModelSettings {
  f16KV?: boolean;
  frequencyPenalty?: number;
  keepAlive?: string;
  logitsAll?: boolean;
  mirostat?: number;
  mirostatEta?: number;
  mirostatTau?: number;
  numBatch?: number;
  numCtx?: number;
  numGpu?: number;
  numGqa?: number;
  numKeep?: number;
  numPredict?: number;
  numThread?: number;
  penalizeNewline?: boolean;
  presencePenalty?: number;
  repeatLastN?: number;
  repeatPenalty?: number;
  ropeFrequencyBase?: number;
  ropeFrequencyScale?: number;
  temperature?: number;
  tfsZ?: number;
  topK?: number;
  topP?: number;
  typicalP?: number;
  useMLock?: boolean;
  useMMap?: boolean;
  vocabOnly?: boolean;
  minP?: number;
  useMlock?: boolean;
}

const keys: (keyof ModelSettings)[] = [
  'f16KV',
  'frequencyPenalty',
  'keepAlive',
  'logitsAll',
  'mirostat',
  'mirostatEta',
  'mirostatTau',
  'numBatch',
  'numCtx',
  'numGpu',
  'numGqa',
  'numKeep',
  'numPredict',
  'numThread',
  'penalizeNewline',
  'presencePenalty',
  'repeatLastN',
  'repeatPenalty',
  'ropeFrequencyBase',
  'ropeFrequencyScale',
  'temperature',
  'tfsZ',
  'topK',
  'topP',
  'typicalP',
  'useMLock',
  'useMMap',
  'vocabOnly',
  'minP',
  'useMlock',
];

export async function getAllDefaultModelSettings(): Promise<ModelSettings> {
  const settings: ModelSettings = {};
  for (const key of keys) {
    settings[key] = undefined;
    // if (!value && key === "keepAlive") {
    //   settings[key] = "5m"
    // }
  }
  return settings;
}
