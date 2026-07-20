import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-12 px-5 md:px-[120px]">
    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
      <div className="text-center md:text-left">
        <div className="font-noto font-bold text-2xl tracking-[-1px] text-black mb-2">해도돼?</div>
        <p className="font-noto text-[14px] text-gray-500">여행지에서 모르고 하는 실수를 줄입니다.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 font-noto text-[13px] font-medium text-gray-500">
        <Link href="/terms" className="hover:text-black transition-colors">이용약관</Link>
        <Link href="/privacy" className="hover:text-black transition-colors">개인정보처리방침</Link>
      </div>
    </div>
    <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-gray-100 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="font-inter text-[12px] text-gray-400">© 2026 해도돼?. Prototype for validation.</p>
      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
        <ShieldAlert size={12} className="text-gray-400" />
        <span className="font-noto text-[11px] text-gray-500">해도돼?는 확인되지 않은 정보를 임의로 생성하지 않습니다.</span>
      </div>
    </div>
  </footer>
);
