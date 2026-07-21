import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle2, Database, FileSearch, Fingerprint, Globe2, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: '데이터 투명성 | 해도돼?',
  description: '공식 여행 정보를 수집하고 검수하는 과정을 공개합니다.',
};

const STEPS = [
  {
    icon: Globe2,
    title: '1. 공식 URL 등록',
    description: '정부, 세관, 교통기관, 관광청 등 담당 기관의 HTTPS 페이지를 OfficialSource에 등록합니다.',
  },
  {
    icon: FileSearch,
    title: '2. 원문 수집',
    description: '등록된 URL만 가져오며 임의의 웹 검색 결과나 커뮤니티 글은 자동 수집하지 않습니다.',
  },
  {
    icon: Fingerprint,
    title: '3. 변경 해시 비교',
    description: '본문을 정규화해 SHA-256 해시를 만들고 이전 스냅샷과 달라진 문서만 변경으로 표시합니다.',
  },
  {
    icon: Bot,
    title: '4. AI 초안 구조화',
    description: 'NVIDIA NIM이 규정 후보와 근거 문장을 구조화합니다. 원문에 없는 벌금, 형량, 날짜는 생성하지 못하도록 제한합니다.',
  },
  {
    icon: ShieldCheck,
    title: '5. 근거 자동 검사',
    description: 'AI가 제시한 근거 문장이 실제 수집 원문에 존재하는 경우에만 REVIEWING 초안으로 저장합니다.',
  },
  {
    icon: CheckCircle2,
    title: '6. 사람 검수 후 공개',
    description: '검수자가 출처, 적용 범위, 표현을 확인한 뒤에만 VERIFIED 상태로 공개합니다.',
  },
];

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f8] px-5 py-12 font-noto md:px-12">
      <div className="mx-auto max-w-[1000px]">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">해도돼?</Link>
          <Link href="/search" className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">AI 검색</Link>
        </header>

        <section className="py-16 md:py-20">
          <p className="text-sm font-bold tracking-[0.2em] text-gray-500">DATA TRANSPARENCY</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">여행 정보가 공개되기까지</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
            해도돼?는 AI가 여행 규정을 임의로 만들지 않도록 공식 기관 URL, 원문 스냅샷, 변경 해시, 근거 문장, 사람 검수를 단계별로 분리합니다.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {STEPS.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <Icon size={24} className="text-gray-700" />
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl bg-black p-7 text-white md:p-10">
          <div className="flex items-center gap-2 text-lime-300"><Database size={20} /><span className="font-bold">공개 기준</span></div>
          <div className="mt-6 grid gap-4 text-sm leading-6 text-white/80 md:grid-cols-3">
            <p>공식 출처 URL과 확인일이 있어야 합니다.</p>
            <p>AI 근거 문장이 수집 원문과 일치해야 합니다.</p>
            <p>최종 공개는 자동화가 아니라 사람 검수를 거칩니다.</p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-7 md:p-10">
          <h2 className="text-2xl font-bold">카드에서 출처 확인하기</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            각 주의사항 카드에는 대표 기관명, 실제 도메인, 공식 도메인 여부, 최종 확인일이 표시됩니다. 출처 링크를 누르면 해당 기관 페이지를 새 탭에서 직접 확인할 수 있습니다.
          </p>
          <Link href="/search" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
            검증 데이터 검색하기 <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}
