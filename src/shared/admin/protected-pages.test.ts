import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const protectedRoot = path.resolve(process.cwd(), 'src/app/admin/(protected)');

const collectPages = (directory: string): string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectPages(absolute);
    return entry.name === 'page.tsx' ? [absolute] : [];
  });

describe('protected admin pages', () => {
  it('checks the admin session before page data is queried or rendered', () => {
    const pages = collectPages(protectedRoot);
    expect(pages.length).toBeGreaterThan(0);

    for (const page of pages) {
      const source = fs.readFileSync(page, 'utf8');
      expect(source, page).toContain("import { requireAdmin } from '@/shared/admin/auth';");
      expect(source, page).toMatch(/export default async function[\s\S]*?\{\s*await requireAdmin\(\);/);
    }
  });
});