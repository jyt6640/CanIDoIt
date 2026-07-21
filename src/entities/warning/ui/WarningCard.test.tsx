import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Warning } from '../model/types';
import { WarningCard } from './WarningCard';

const item: Warning = {
  id: '1',
  title: '길거리에서 흡연하지 마세요',
  category: '법률·안전',
  risk: '매우 높음',
  type: '법률',
  range: '오사카',
  reason: '벌금이 부과될 수 있습니다.',
  alternative: '지정 흡연 구역을 이용하세요.',
  locations: ['거리·공공장소'],
  status: 'VERIFIED',
  verifiedAt: '2026-07-18T00:00:00.000Z',
  sources: [
    {
      title: '오사카시 공식 안내',
      url: 'https://www.city.osaka.lg.jp/',
      checkedAt: '2026-07-18T00:00:00.000Z',
    },
  ],
};

describe('WarningCard', () => {
  it('제목·위험도·적용 범위를 렌더한다', () => {
    render(<WarningCard item={item} isSaved={false} onToggleSave={() => {}} onClick={() => {}} />);
    expect(screen.getByText(item.title)).toBeInTheDocument();
    expect(screen.getByText('매우 높음')).toBeInTheDocument();
    expect(screen.getByText('오사카')).toBeInTheDocument();
    expect(screen.getByText('검수 완료')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '오사카시 공식 안내 출처 열기' })).toHaveAttribute(
      'href',
      'https://www.city.osaka.lg.jp/',
    );
    expect(screen.getByRole('link', { name: '오사카시 공식 안내 출처 열기' })).toHaveTextContent(
      'city.osaka.lg.jp',
    );
    expect(screen.getByText('공식 도메인')).toBeInTheDocument();
    expect(screen.getByText(/최종 확인/)).toBeInTheDocument();
  });

  it('공식 출처 링크 클릭 시 카드 상세 열기를 막는다', () => {
    const onClick = vi.fn();
    render(<WarningCard item={item} isSaved={false} onToggleSave={() => {}} onClick={onClick} />);
    fireEvent.click(screen.getByRole('link', { name: '오사카시 공식 안내 출처 열기' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('북마크 버튼 클릭 시 onToggleSave(id)를 호출하고 카드 onClick은 막는다', () => {
    const onToggleSave = vi.fn();
    const onClick = vi.fn();
    render(<WarningCard item={item} isSaved={false} onToggleSave={onToggleSave} onClick={onClick} />);
    fireEvent.click(screen.getByLabelText('저장하기'));
    expect(onToggleSave).toHaveBeenCalledWith('1');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('카드 본문 클릭 시 onClick(item)을 호출한다', () => {
    const onClick = vi.fn();
    render(<WarningCard item={item} isSaved={false} onToggleSave={() => {}} onClick={onClick} />);
    fireEvent.click(screen.getByText(item.title));
    expect(onClick).toHaveBeenCalledWith(item);
  });
});
