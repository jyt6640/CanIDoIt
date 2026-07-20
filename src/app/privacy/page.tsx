import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/views/legal';

export const metadata: Metadata = {
  title: '개인정보처리방침 — 헤도돼?',
  description: '헤도돼? 개인정보처리방침(초안).',
};

const SECTIONS: LegalSection[] = [
  {
    heading: '수집하는 정보',
    body: [
      '헤도돼?는 회원가입 없이 이용할 수 있으며, 기본적으로 개인을 식별하는 정보를 수집하지 않습니다.',
      '저장(북마크) 기능은 이용자의 브라우저 로컬 저장소(localStorage)에만 보관되며, 서버로 전송되지 않습니다.',
    ],
  },
  {
    heading: '분석 도구',
    body: [
      '서비스 개선을 위해 익명화된 이용 통계(페이지 조회, 검색·저장·공유 이벤트)를 수집할 수 있습니다. 이는 분석 도구 설정 시에만 활성화됩니다.',
      '분석 도구는 쿠키 또는 유사 기술을 사용할 수 있으며, 관련 동의 절차는 도입 시 별도로 안내합니다.',
    ],
  },
  {
    heading: '제3자 제공',
    body: ['서비스는 법령에 따른 경우를 제외하고 이용자의 정보를 제3자에게 제공하지 않습니다.'],
  },
  {
    heading: '이용자의 권리',
    body: [
      '이용자는 브라우저 설정 또는 저장소 삭제를 통해 로컬에 저장된 데이터를 언제든지 삭제할 수 있습니다.',
    ],
  },
  {
    heading: '문의',
    body: ['개인정보 처리에 관한 문의는 서비스 내 문의 채널을 통해 접수할 수 있습니다.'],
  },
];

export default function PrivacyPage() {
  return <LegalPage title="개인정보처리방침" updatedAt="2026-07-20" sections={SECTIONS} />;
}
