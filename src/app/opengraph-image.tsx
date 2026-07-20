import { ImageResponse } from 'next/og';

export const alt = '해도돼? 여행자를 위한 실수 방지 가이드';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 72, background: '#f8f8f8', color: '#111' }}>
      <div style={{ fontSize: 28, fontWeight: 700 }}>해도돼?</div>
      <div style={{ marginTop: 40, fontSize: 68, lineHeight: 1.2, fontWeight: 800, display: 'flex', flexDirection: 'column' }}>
        <span>여행 전에,</span>
        <span>실수부터 막으세요.</span>
      </div>
      <div style={{ marginTop: 32, fontSize: 28, color: '#555' }}>검증된 여행 주의사항 · 저장 · 공유 · 오프라인</div>
    </div>,
    size,
  );
}