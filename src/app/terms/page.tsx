import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/views/legal';

export const metadata: Metadata = {
  title: '이용약관 — 해도돼?',
  description: '해도돼? 서비스 이용약관(초안).',
};

const SECTIONS: LegalSection[] = [
  {
    heading: '목적',
    body: [
      '본 약관은 "해도돼?"(이하 "서비스")가 제공하는 여행지 주의사항 정보 서비스의 이용 조건과 절차, 이용자와 서비스의 권리·의무 및 책임 사항을 규정합니다.',
    ],
  },
  {
    heading: '정보의 성격과 책임의 한계',
    body: [
      '서비스가 제공하는 여행지 주의사항은 참고용 정보이며, 법률·시설 규칙·현지 관행은 수시로 변경될 수 있습니다.',
      '서비스는 정보의 정확성과 최신성을 위해 노력하나, 이를 완전하게 보증하지 않습니다. 실제 여행 전 공식 기관과 방문 시설의 최신 안내를 반드시 확인해야 합니다.',
      '이용자가 본 서비스의 정보에 의존하여 행한 행위의 결과에 대해 서비스는 법이 허용하는 범위 내에서 책임을 지지 않습니다.',
    ],
  },
  {
    heading: '이용자의 의무',
    body: [
      '이용자는 관련 법령과 본 약관을 준수해야 하며, 서비스를 부정한 목적으로 이용해서는 안 됩니다.',
    ],
  },
  {
    heading: '약관의 변경',
    body: [
      '서비스는 필요 시 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 서비스 화면에 공지합니다.',
    ],
  },
  {
    heading: '문의',
    body: ['본 약관에 관한 문의는 서비스 내 문의 채널을 통해 접수할 수 있습니다.'],
  },
];

export default function TermsPage() {
  return <LegalPage title="이용약관" updatedAt="2026-07-20" sections={SECTIONS} />;
}
