const USER_AGENT = 'CanIDoItBot/1.0 (+official travel guidance monitor)';

const cleanHtml = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim();

export async function directFetchProvider(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': USER_AGENT },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Direct fetch failed: ${response.status}`);
  const contentType = response.headers.get('content-type') ?? 'text/html';
  const raw = await response.text();
  return {
    provider: 'direct-fetch',
    text: cleanHtml(raw),
    metadata: { contentType, status: response.status, finalUrl: response.url },
  };
}

export async function firecrawlProvider(url) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error('FIRECRAWL_API_KEY is required for CRAWLER_PROVIDER=firecrawl');

  const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) throw new Error(`Firecrawl failed: ${response.status}`);
  const payload = await response.json();
  const text = payload?.data?.markdown ?? payload?.markdown ?? '';
  if (!text.trim()) throw new Error('Firecrawl returned empty content.');
  return {
    provider: 'firecrawl',
    text: text.trim(),
    metadata: payload?.data?.metadata ?? payload?.metadata ?? {},
  };
}

export async function collectWithProvider(url) {
  const provider = process.env.CRAWLER_PROVIDER ?? 'direct-fetch';
  if (provider === 'firecrawl') return firecrawlProvider(url);
  if (provider !== 'direct-fetch') throw new Error(`Unsupported CRAWLER_PROVIDER: ${provider}`);
  return directFetchProvider(url);
}
