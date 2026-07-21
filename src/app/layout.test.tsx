import { Children, isValidElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import RootLayout from './layout';
import { Analytics } from '@/shared/ui/Analytics';
import { PwaRegistration } from '@/shared/ui/PwaRegistration';

describe('RootLayout', () => {
  it('html 직계 자식으로 body만 렌더링하고 클라이언트 UI는 body 내부에 둔다', () => {
    const layout = RootLayout({ children: <main>content</main> });

    expect(layout.type).toBe('html');

    const htmlChildren = Children.toArray(layout.props.children);
    expect(htmlChildren).toHaveLength(1);

    const body = htmlChildren[0];
    expect(isValidElement(body)).toBe(true);
    if (!isValidElement<{ children?: ReactNode }>(body)) return;

    expect(body.type).toBe('body');

    const bodyChildren = Children.toArray(body.props.children);
    expect(bodyChildren.some((child) => isValidElement(child) && child.type === PwaRegistration)).toBe(true);
    expect(bodyChildren.some((child) => isValidElement(child) && child.type === Analytics)).toBe(true);
  });
});