export const sanitizeExtractedText = (value: string) => value
  .replace(/\u0000/g, '')
  .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const isPdfContentType = (contentType: string | null) =>
  (contentType ?? '').toLowerCase().includes('application/pdf');

export const assertDirectFetchContentType = (contentType: string | null) => {
  if (isPdfContentType(contentType)) {
    throw new Error(
      'PDF_REQUIRES_PDF_EXTRACTOR: direct-fetch cannot safely extract PDF text. Configure CRAWLER_PROVIDER=firecrawl or add a serverless PDF extractor.',
    );
  }
};
