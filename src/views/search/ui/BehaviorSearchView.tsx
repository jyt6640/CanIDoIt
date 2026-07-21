'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ExternalLink, Loader2, Search, Sparkles, X } from 'lucide-react';

type SearchResult = {
  warningKey: string;
  title: string;
  reason: string;
  alternative: string;
  risk: string;
  status?: string;
  verifiedAt?: string | null;
  country: { name: string; slug: string };
  city: { name: string; slug: string } | null;
  sources: { title: string; url?: string | null; checkedAt?: string | null }[];
};

type SearchResponse = {
  provider: 'nvidia-nim' | 'local-fallback' | 'local-fast-path';
  model: string | null;
  answer: {
    verdict: 'ALLOWED' | 'PROHIBITED' | 'CONDITIONAL' | 'UNKNOWN';
    summary: string;
    warningKeys: string[];
  };
  results: SearchResult[];
};

const verdictLabel = {
  ALLOWED: '가능한 것으로 확인됨',
  PROHIBITED: '금지 또는 제한됨',
  CONDITIONAL: '조건과 예외 확인 필요',
  UNKNOWN: '확인된 정보 부족',
} as const;

export const BehaviorSearchView = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const search = async (question: string) => {
    const trimmed = question.trim();
    if (trimmed.length < 2) return;

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      });
      const payload = await response.json() as SearchResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? '검색에 실패했어요.');
      if (requestId !== requestIdRef.current) return;
      setData(payload);
      const url = new URL(window.location.href);
      url.searchParams.set('q', trimmed);
      window.history.replaceState(null, '', url);
    } catch (searchError) {
      if (controller.signal.aborted) return;
      setError(searchError instanceof Error ? searchError.message : '검색에 실패했어요.');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        requestControllerRef.current = null;
      }
    }
  };

  const cancelSearch = () => {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    requestIdRef.current += 1;
    setLoading(false);
  };

  useEffect(() => {
    if (!initialQuery) return;
    const timer = window.setTimeout(() => void search(initialQuery), 0);
    return () => {
      window.clearTimeout(timer);
      requestControllerRef.current?.abort();
    };
  // 최초 URL 질문만 자동 검색한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void search(query);
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] font-noto">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5">
          <Link href="/" className="text-xl font-bold">해도돼?</Link>
          <Link href="/saved" className="text-sm font-medium">저장한 여행</Link>
        </div>
      </header>

      <section className="mx-auto max-w-[900px] px-5 py-12">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
          <Sparkles size={16} /> AI VERIFIED SEARCH
        </div>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">이거 해도 돼?</h1>
        <p className="mt-3 text-gray-600">AI는 질문만 해석하고, 답변은 검증된 주의사항과 공식 출처 안에서만 만들어요.</p>

        <form onSubmit={onSubmit} className="mt-8 flex gap-2 rounded-2xl bg-white p-3 shadow-sm">
          <input
            value={query}
            onChange={(event) => {
              if (loading) cancelSearch();
              setQuery(event.target.value);
            }}
            placeholder="태국에 전자담배 가져가도 돼?"
            className="min-w-0 flex-1 px-3 py-3 text-base outline-none"
          />
          {loading ? (
            <button
              type="button"
              onClick={cancelSearch}
              className="rounded-xl bg-gray-700 px-4 text-white"
              aria-label="검색 취소"
              title="검색 취소"
            >
              <X size={18} />
            </button>
          ) : (
            <button type="submit" className="rounded-xl bg-black px-4 text-white" aria-label="검색">
              <Search size={18} />
            </button>
          )}
        </form>

        {loading && (
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="animate-spin" size={14} /> 검색 중에도 입력을 바꾸면 기존 요청이 자동 취소돼요.
          </p>
        )}

        {error && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        {data && (
          <div className="mt-8 space-y-6">
            <section className="rounded-3xl bg-black p-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-lime-300">{verdictLabel[data.answer.verdict]}</p>
                <p className="text-xs text-white/60">
                  {data.provider === 'nvidia-nim'
                    ? `NVIDIA NIM · ${data.model}`
                    : data.provider === 'local-fast-path'
                      ? '빠른 여행지 검색'
                      : '안전한 로컬 검색 폴백'}
                </p>
              </div>
              <p className="mt-4 text-lg leading-8">{data.answer.summary}</p>
            </section>

            {data.results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
                검증된 데이터에서 일치하는 결과를 찾지 못했어요.
              </div>
            ) : data.results.map((result) => {
              const href = `/${result.country.slug}${result.city ? `/${result.city.slug}` : ''}?warning=${result.warningKey}`;
              return (
                <article key={result.warningKey} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold text-gray-500">
                    {result.country.name}{result.city ? ` · ${result.city.name}` : ''} · {result.status ?? 'REVIEWING'}
                  </p>
                  <Link href={href} className="mt-2 block text-lg font-bold hover:underline">{result.title}</Link>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{result.reason}</p>
                  <p className="mt-3 text-sm font-medium text-gray-800">대신 이렇게 하세요: {result.alternative}</p>
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500">Warning key: {result.warningKey}</p>
                    {result.verifiedAt && <p className="mt-1 text-xs text-gray-500">최종 검수: {new Date(result.verifiedAt).toLocaleDateString('ko-KR')}</p>}
                    <div className="mt-2 flex flex-wrap gap-3">
                      {result.sources.map((source) => source.url && (
                        <a key={`${result.warningKey}-${source.url}`} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline">
                          {source.title} <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};
