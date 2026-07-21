import { describe, expect, it } from 'vitest';
import { assertDirectFetchContentType, isPdfContentType, sanitizeExtractedText } from './sourceContent';

describe('source content safety', () => {
  it('removes null bytes and unsafe control characters', () => {
    expect(sanitizeExtractedText('Hello\u0000\u0007  world\nnext')).toBe('Hello world next');
  });

  it('detects PDF content types case-insensitively', () => {
    expect(isPdfContentType('application/pdf')).toBe(true);
    expect(isPdfContentType('Application/PDF; charset=binary')).toBe(true);
    expect(isPdfContentType('text/html')).toBe(false);
  });

  it('rejects PDF binary before reading it as UTF-8 text', () => {
    expect(() => assertDirectFetchContentType('application/pdf')).toThrow('PDF_REQUIRES_PDF_EXTRACTOR');
    expect(() => assertDirectFetchContentType('text/html; charset=utf-8')).not.toThrow();
  });
});
