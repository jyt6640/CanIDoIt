import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/views/legal';

export const metadata: Metadata = {
  title: '개인정보처리방침 — 해도돼?',
  description: '해도돼? 개인정보처리방침(초안).',
};

const SECTIONS: LegalSection[] = [
  {
    heading: '수집하는 정보',
    body: [
      '해도돼?는 회원가입 없이 이용할 수 있으며, 기본적으로 개인을 식별하는 정보를 수집하지 않습니다.',
      '저장(북마크)은 기본적으로 브라우저 로컬 저장소(localStorage)에 보관됩니다. 이용자가 기기 동기화를 직접 활성화한 경우에는 무작위 공유 코드와 저장한 주의사항 키가 서버에 보관됩니다.',
    ],
  },
  {
    heading: '분석 도구',
    body: [
      '서비스 개선을 위한 Google Analytics는 이용자가 명시적으로 동의한 뒤에만 로드됩니다.',
      '저장 목록, 동기화 코드, 행동 질문의 원문과 개인 식별 정보는 분석 이벤트에 포함하지 않습니다. 동의 상태는 브라우저 로컬 저장소에 기록됩니다.',
    ],
  },
  {
    heading: '제3자 제공',
    body: ['서비스는 법령에 따른 경우를 제외하고 이용자의 정보를 제3자에게 제공하지 않습니다.'],
  },
  {
    heading: '이용자의 권리',
    body: [
      '이용자는 브라우저 설정 또는 저장소 삭제를 통해 로컬 데이터를 삭제할 수 있으며, 설정 화면에서 분석 동의를 변경하거나 동기화를 해제할 수 있습니다.',
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
