import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const snapshotId = process.argv[2];
const apiKey = process.env.NVIDIA_API_KEY;
const baseUrl = process.env.NVIDIA_BASE_URL ?? 'https://integrate.api.nvidia.com/v1';
const model = process.env.NVIDIA_PRIMARY_MODEL ?? 'qwen/qwen3.5-397b-a17b';

if (!snapshotId) {
  console.error('Usage: npm run content:draft -- <snapshot-id>');
  process.exit(1);
}
if (!apiKey) {
  console.error('NVIDIA_API_KEY is required.');
  process.exit(1);
}

const snapshot = await prisma.sourceSnapshot.findUnique({
  where: { id: snapshotId },
  include: { source: true },
});
if (!snapshot) {
  console.error('SourceSnapshot not found.');
  process.exit(1);
}

const response = await fetch(`${baseUrl}/chat/completions`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${apiKey}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model,
    temperature: 0.1,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: [
          '공식 여행 문서에서 여행자가 알아야 할 규정 후보만 구조화하라.',
          '원문에 없는 벌금, 형량, 날짜, 예외를 만들지 마라.',
          '출력 JSON: {warnings:[{title,category,risk,type,range,reason,alternative,evidence,keywords,aliases}]}',
          'risk는 CRITICAL|HIGH|MEDIUM|INFO 중 하나다.',
          'evidence는 제공된 원문에 그대로 존재하는 짧은 근거 문장이어야 한다.',
        ].join(' '),
      },
      {
        role: 'user',
        content: JSON.stringify({
          countryCode: snapshot.source.countryCode,
          agencyName: snapshot.source.agencyName,
          sourceUrl: snapshot.source.url,
          text: snapshot.extractedText.slice(0, 180_000),
        }),
      },
    ],
  }),
  signal: AbortSignal.timeout(60_000),
});
if (!response.ok) throw new Error(`NVIDIA NIM failed: ${response.status}`);

const data = await response.json();
const content = data.choices?.[0]?.message?.content;
if (!content) throw new Error('NVIDIA NIM returned no content.');
const payload = JSON.parse(content);
const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];
let created = 0;

for (const warning of warnings) {
  if (!warning || typeof warning.evidence !== 'string') continue;
  const evidence = warning.evidence.trim();
  if (!evidence || !snapshot.extractedText.includes(evidence)) continue;
  await prisma.contentDraft.create({
    data: {
      sourceId: snapshot.sourceId,
      snapshotId: snapshot.id,
      model,
      payload: warning,
      evidence,
      status: 'REVIEWING',
    },
  });
  created += 1;
}

console.log(JSON.stringify({ snapshotId, model, candidates: warnings.length, created }));
await prisma.$disconnect();
