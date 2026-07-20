import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  type LucideIcon,
} from 'lucide-react';

export type RiskLevel = '매우 높음' | '높음' | '보통' | '참고';

export interface RiskStyle {
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
}

/** 위험도 라벨에 따른 색상/아이콘 매핑 */
export const getRiskStyles = (risk: string): RiskStyle => {
  switch (risk) {
    case '매우 높음':
      return { bg: 'bg-red-50', text: 'text-[#b42318]', border: 'border-red-200', icon: ShieldAlert };
    case '높음':
      return { bg: 'bg-orange-50', text: 'text-[#c2410c]', border: 'border-orange-200', icon: AlertTriangle };
    case '보통':
      return { bg: 'bg-stone-100', text: 'text-[#57534e]', border: 'border-stone-200', icon: AlertCircle };
    case '참고':
      return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: Info };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', icon: Info };
  }
};
