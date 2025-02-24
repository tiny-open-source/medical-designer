import { ChatOllama } from './ChatOllama';

export async function pageAssistModel({
  model,
  baseUrl,
  keepAlive,
  temperature,
  topK,
  topP,
  numCtx,
  seed,
  numGpu,
  numPredict,
  useMMap,
  minP,
  repeatLastN,
  repeatPenalty,
  tfsZ,
  numKeep,
  numThread,
  useMlock,
}: {
  model: string;
  baseUrl: string;
  keepAlive?: string;
  temperature?: number;
  topK?: number;
  topP?: number;
  numCtx?: number;
  seed?: number;
  numGpu?: number;
  numPredict?: number;
  useMMap?: boolean;
  minP?: number;
  repeatPenalty?: number;
  repeatLastN?: number;
  tfsZ?: number;
  numKeep?: number;
  numThread?: number;
  useMlock?: boolean;
}) {
  return new ChatOllama({
    baseUrl,
    keepAlive,
    temperature,
    topK,
    topP,
    numCtx,
    seed,
    model,
    numGpu,
    numPredict,
    useMMap,
    minP,
    repeatPenalty,
    repeatLastN,
    tfsZ,
    numKeep,
    numThread,
    useMlock,
  });
}
