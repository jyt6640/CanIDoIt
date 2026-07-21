import 'server-only';

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL ?? 'https://integrate.api.nvidia.com/v1';

export const nvidiaModels = {
  primary: process.env.NVIDIA_PRIMARY_MODEL ?? 'qwen/qwen3.5-397b-a17b',
  embedding: process.env.NVIDIA_EMBEDDING_MODEL ?? 'nvidia/llama-nemotron-embed-1b-v2',
  rerank: process.env.NVIDIA_RERANK_MODEL ?? 'nvidia/llama-nemotron-rerank-1b-v2',
} as const;

export const isNvidiaNimConfigured = () => Boolean(process.env.NVIDIA_API_KEY);

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export async function nimChatJson<T>(messages: ChatMessage[], fallback: T): Promise<T> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return fallback;

  try {
    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: nvidiaModels.primary,
        messages,
        temperature: 0.1,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) throw new Error(`NVIDIA NIM ${response.status}`);
    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallback;
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(JSON.stringify({ event: 'nvidia_nim_failed', error: error instanceof Error ? error.message : 'unknown' }));
    return fallback;
  }
}
