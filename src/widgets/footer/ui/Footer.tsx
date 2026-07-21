import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export const Footer = () => (
  <footer className="border-t border-gray-200 bg-white px-5 py-6 md:px-12 md:py-7">
    <div className="mx-auto flex max-w-[1200px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1 text-center md:text-left">
        <div className="font-noto text-lg font-bold tracking-[-0.8px] text-black">해도돼?</div>
        <p className="font-noto text-[12px] text-gray-500">여행지에서 모르고 하는 실수를 줄입니다.</p>
      </div>

      <div className="flex flex-col items-center gap-3 md:items-end">
        <div className="flex flex-wrap justify-center gap-4 font-noto text-[12px] font-medium text-gray-500">
          <Link href="/transparency" className="transition-colors hover:text-black">데이터 투명성</Link>
          <Link href="/terms" className="transition-colors hover:text-black">이용약관</Link>
          <Link href="/privacy" className="transition-colors hover:text-black">개인정보처리방침</Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center md:justify-end md:text-right">
          <p className="font-inter text-[11px] text-gray-400">© 2026 해도돼?</p>
          <span className="hidden h-3 w-px bg-gray-200 md:block" aria-hidden="true" />
          <span className="inline-flex items-center gap-1 font-noto text-[11px] text-gray-500">
            <ShieldAlert size={11} className="text-gray-400" /> 검증되지 않은 정보는 공개하지 않습니다.
          </span>
        </div>
      </div>
    </div>
  </footer>
);
