import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast = ({ message, isVisible }: ToastProps) => (
  <div
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg font-noto text-[14px] font-medium flex items-center gap-2 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    }`}
  >
    <CheckCircle2 size={18} className="text-green-400" />
    {message}
  </div>
);
