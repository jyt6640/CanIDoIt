import { NextResponse } from 'next/server';
import { getAllPublicWarnings } from '@/entities/warning/api/warningRepository';
import {
  fallbackParseQuestion,
  rankWarnings,
  type ParsedTravelQuestion,
} from '@/features/behavior-search/model/searchWarnings';
import { isNvidiaNimConfigured, nimChatJson, nvidiaModels } from '@/shared/ai/nvidiaNim';

interface AiAnswer {
  verdict: 'ALLOWED' | 'PROHIBITED' | 'CONDITIONAL' | 'UNKNOWN';
  summary: string;
  warningKeys: string[];
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { question?: unknown } | null;
  const question = typeof body?.question === 'string' ? body.question.trim().slice(0, 500) : '';
  if (question.length < 2) {
    return NextResponse.json({ error: '질문을 두 글자 이상 입력해 주세요.' }, { status: 400 });
  }

  const fallbackParsed = fallbackParseQuestion(question);
  const parsed = await nimChatJson<ParsedTravelQuestion>([
    {
      role: 'system',
      content: '여행 규정 질문을 검색 조건으로만 구조화하라. 새 법률이나 사실을 만들지 마라. JSON 필드: country, city, actions(string[]), categories(string[]), intent(ALLOWANCE|RULE|SAFETY|UNKNOWN).',
    },
    { role: 'user', content: question },
  ], fallbackParsed);

  const records = await getAllPublicWarnings();
  const hits = rankWarnings(records, question, parsed, 6);
  const evidence = hits.map(({ warning, country, city }) => ({
    warningKey: warning.id,
    destination: `${country.name}${city ? ` ${city.name}` : ''}`,
    title: warning.title,
    reason: warning.reason,
    alternative: warning.alternative,
    status: warning.status,
    verifiedAt: warning.verifiedAt,
    sources: (warning.sources ?? []).filter((source) => source.url),
  }));

  const fallbackAnswer: AiAnswer = hits.length
    ? {
        verdict: 'CONDITIONAL',
        summary: `검증된 주의사항 ${hits.length}개를 찾았습니다. 아래 공식 출처와 최종 확인일을 함께 확인하세요.`,
        warningKeys: hits.map(({ warning }) => warning.id),
      }
    : {
        verdict: 'UNKNOWN',
        summary: '현재 검증된 데이터에서 관련 규정을 찾지 못했습니다. 공식 기관 안내를 추가로 확인해 주세요.',
        warningKeys: [],
      };

  const answer = evidence.length
    ? await nimChatJson<AiAnswer>([
        {
          role: 'system',
          content: '제공된 evidence 밖의 규정, 벌금, 형량, 날짜를 만들지 마라. 결론은 ALLOWED, PROHIBITED, CONDITIONAL, UNKNOWN 중 하나다. summary는 한국어 3문장 이내로 작성하고 warningKeys에는 실제 evidence의 warningKey만 넣어라.',
        },
        { role: 'user', content: JSON.stringify({ question, evidence }) },
      ], fallbackAnswer)
    : fallbackAnswer;

  const allowedKeys = new Set(evidence.map((item) => item.warningKey));
  const safeKeys = answer.warningKeys.filter((key) => allowedKeys.has(key));

  return NextResponse.json({
    provider: isNvidiaNimConfigured() ? 'nvidia-nim' : 'local-fallback',
    model: isNvidiaNimConfigured() ? nvidiaModels.search : null,
    parsed,
    answer: { ...answer, warningKeys: safeKeys.length ? safeKeys : fallbackAnswer.warningKeys },
    results: hits.map(({ warning, country, city, score }) => ({
      warningKey: warning.id,
      title: warning.title,
      reason: warning.reason,
      alternative: warning.alternative,
      risk: warning.risk,
      status: warning.status,
      verifiedAt: warning.verifiedAt,
      country,
      city,
      score,
      sources: (warning.sources ?? []).filter((source) => source.url),
    })),
  });
}
