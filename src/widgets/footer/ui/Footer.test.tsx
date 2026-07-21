import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('핵심 링크와 짧은 검증 문구만 렌더링한다', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: '데이터 투명성' })).toHaveAttribute('href', '/transparency');
    expect(screen.getByRole('link', { name: '이용약관' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: '개인정보처리방침' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByText('검증되지 않은 정보는 공개하지 않습니다.')).toBeInTheDocument();
  });
});