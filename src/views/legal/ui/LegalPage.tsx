import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Footer } from '@/widgets/footer';

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  title: string;
  updatedAt: string;
  sections: LegalSection[];
}

export const LegalPage = ({ title, updatedAt, sections }: LegalPageProps) => (
  <div className="relative min-h-screen bg-light-bg font-noto text-black">
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-[800px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-noto font-bold text-xl tracking-[-1px] text-black">
          해도돼?
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[14px] font-noto font-medium text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} /> 홈으로
        </Link>
      </div>
    </header>

    <main className="max-w-[800px] mx-auto px-5 md:px-8 py-12 md:py-16">
      <h1 className="font-noto font-bold text-[28px] md:text-[36px] tracking-tight mb-2">{title}</h1>
      <p className="font-noto text-[13px] text-gray-400 mb-8">최종 업데이트: {updatedAt}</p>

      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="font-noto text-[13px] text-amber-800 leading-relaxed">
          본 문서는 서비스 준비 단계의 <strong>초안(템플릿)</strong>입니다. 실제 서비스 운영 전 법률 전문가의 검토를
          거쳐 확정해야 합니다.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-noto font-bold text-[18px] md:text-[20px] mb-3">
              {i + 1}. {s.heading}
            </h2>
            {s.body.map((p, j) => (
              <p key={j} className="font-noto text-[15px] text-gray-700 leading-[1.7] mb-2">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>

    <Footer />
  </div>
);
