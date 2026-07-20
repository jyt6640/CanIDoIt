import {
  Search,
  Coffee,
  Train,
  Bath,
  Tent,
  Hotel,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

/** 나라 → 도시 매핑 */
export const DESTINATION_DATA: Record<string, string[]> = {
  일본: ['오사카', '도쿄', '교토'],
  태국: ['방콕', '치앙마이', '푸껫'],
  싱가포르: ['싱가포르'],
};

/** 카테고리 필터 목록 */
export const CATEGORIES = [
  '전체',
  '법률·안전',
  '대중교통',
  '식당',
  '숙소',
  '종교시설',
  '목욕·온천',
  '거리·공공장소',
  '사진 촬영',
  '쇼핑·결제',
  '사람과의 관계',
] as const;

export interface LocationOption {
  name: string;
  icon: LucideIcon;
}

/** 장소 빠른 보기 목록 */
export const LOCATIONS: LocationOption[] = [
  { name: '전체', icon: Search },
  { name: '식당', icon: Coffee },
  { name: '지하철', icon: Train },
  { name: '온천', icon: Bath },
  { name: '사찰·신사', icon: Tent },
  { name: '호텔', icon: Hotel },
  { name: '시장', icon: ShoppingBag },
];
