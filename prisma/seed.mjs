// 헤도돼? 시드 데이터
// 국가/도시/주의사항/출처를 삽입한다. 멱등하도록 매 실행 시 초기화 후 재삽입.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 데이터 구조:
 * countries[].cities[] : 도시 슬러그 정의
 * countries[].warnings[] : city(도시 슬러그, 없으면 국가 공통) 지정 가능
 * sources: 출처(확인된 URL이 없으면 url 생략 — 임의 링크 생성 금지)
 */
const DATA = [
  {
    name: '일본',
    slug: 'japan',
    cities: [
      { name: '오사카', slug: 'osaka' },
      { name: '도쿄', slug: 'tokyo' },
      { name: '교토', slug: 'kyoto' },
    ],
    warnings: [
      {
        title: '지정된 장소가 아닌 곳에서 흡연하지 마세요',
        category: '법률·안전',
        risk: '매우 높음',
        type: '법률·지역 규칙',
        range: '오사카 일부 지역',
        city: 'osaka',
        reason: '길거리 흡연은 조례로 엄격히 금지되어 있으며, 적발 시 현장에서 벌금이 부과될 수 있습니다.',
        alternative: '지정된 흡연 구역(스모킹 에어리어)을 찾아 이용하세요.',
        diffFromKorea: '한국보다 흡연 구역에 대한 규제가 지역별로 훨씬 엄격하고 세분화되어 있습니다.',
        checkNeeded: '구역마다 벌금액이나 단속 빈도가 다를 수 있습니다.',
        locations: ['거리·공공장소'],
        sources: [{ title: '오사카시 노상금연(길거리 흡연 금지) 조례 안내' }],
      },
      {
        title: '지하철과 전철 안에서 큰 소리로 통화하지 마세요',
        category: '대중교통',
        risk: '보통',
        type: '일반 매너',
        range: '일본 전반',
        reason:
          '일본의 대중교통에서는 매우 조용한 분위기를 유지하는 것이 일반적입니다. 큰 소리의 통화는 주변 승객에게 큰 방해로 받아들여집니다.',
        alternative: '급한 전화라면 짧게 통화하거나 다음 역에서 내린 뒤 통화하세요.',
        diffFromKorea:
          '한국에서도 대중교통 통화를 불편하게 생각할 수 있지만, 일본에서는 더 완벽한 정숙을 기대하는 경우가 많습니다.',
        checkNeeded: '노선, 시간대, 차량 종류에 따라 분위기가 다를 수 있습니다.',
        locations: ['지하철', '대중교통'],
        sources: [{ title: '일본 철도사업자 공통 차내 매너 안내(통화 자제)' }],
      },
      {
        title: '열차 문 앞을 막고 서 있지 마세요',
        category: '대중교통',
        risk: '보통',
        type: '일반 매너',
        range: '일본 전반',
        reason: '승하차하는 다른 승객들의 동선을 방해하게 됩니다.',
        alternative: '역에 정차할 때 승객이 내릴 수 있도록 문 옆으로 비켜서거나 잠시 내렸다가 다시 타세요.',
        locations: ['지하철', '대중교통'],
        sources: [],
      },
      {
        title: '온천에 들어가기 전 몸을 씻지 않고 탕에 들어가지 마세요',
        category: '목욕·온천',
        risk: '높음',
        type: '시설 규칙',
        range: '일본 전반의 일반적인 온천',
        reason: '공동으로 사용하는 탕의 수질을 오염시키는 행동으로 간주되어 강한 제재나 눈총을 받을 수 있습니다.',
        alternative: '탕에 들어가기 전 반드시 샤워 공간에서 비누로 몸을 깨끗이 씻으세요.',
        diffFromKorea: '한국의 대중목욕탕 문화와 유사하지만, 청결에 대한 기준이 더 엄격하게 적용됩니다.',
        locations: ['온천'],
        sources: [{ title: '일본 온천/공중목욕 이용 매너 일반 안내' }],
      },
      {
        title: '수건을 온천 물속에 넣지 마세요',
        category: '목욕·온천',
        risk: '높음',
        type: '시설 규칙',
        range: '일본 전반의 일반적인 온천',
        reason: '수건에 묻은 먼지나 세탁 잔여물이 탕을 더럽힌다고 생각합니다.',
        alternative: '작은 수건은 탕 밖 가장자리에 두거나 머리 위에 올려두세요.',
        locations: ['온천'],
        sources: [],
      },
      {
        title: '문신이 있다고 모든 온천에 바로 입장하지 마세요',
        category: '목욕·온천',
        risk: '높음',
        type: '시설별 차이',
        range: '시설마다 다름',
        reason:
          '일본의 많은 온천과 대중목욕탕은 조직폭력배와 관련된 부정적 인식 때문에 크기에 상관없이 문신(타투) 있는 사람의 입장을 엄격히 금지합니다. 입장 후 적발 시 퇴장 조치됩니다.',
        alternative:
          '방문 전 홈페이지나 문의를 통해 타투 허용 여부(타투 프렌들리 온천)를 확인하거나, 타투 커버 스티커를 사용하세요. 또는 프라이빗 탕(가족탕)을 이용하세요.',
        diffFromKorea: '한국보다 타투에 대한 목욕 시설의 입장 제한이 훨씬 일반적이고 엄격합니다.',
        locations: ['온천'],
        sources: [{ title: '일본 관광청(JNTO) 온천 타투 관련 안내' }],
      },
      {
        title: '식당 예약을 연락 없이 취소하지 마세요 (노쇼)',
        category: '식당',
        risk: '높음',
        type: '시설 규칙·금전적 손실',
        range: '예약제 식당',
        reason:
          '식자재 준비와 다른 손님을 받을 기회를 잃게 되어 식당에 큰 피해를 줍니다. 예약금 환불 불가 또는 100% 위약금이 청구될 수 있으며, 향후 외국인 예약 거부의 원인이 됩니다.',
        alternative: '방문이 어렵다면 최대한 빨리(최소 하루 전) 식당이나 예약 플랫폼을 통해 취소 연락을 하세요.',
        diffFromKorea: '노쇼에 대한 위약금 청구와 부정적 인식이 매우 강합니다.',
        locations: ['식당'],
        sources: [],
      },
      {
        title: '식당 직원을 반복해서 큰 소리로 부르지 마세요',
        category: '식당',
        risk: '참고',
        type: '일반 매너',
        range: '일본 전반',
        reason: '큰 소리로 "스미마센!"을 반복해서 외치는 것은 식당 분위기를 해치고 무례하게 보일 수 있습니다.',
        alternative:
          '직원과 눈을 맞추거나 테이블에 있는 호출 버튼(요비린)을 사용하세요. 한 번 불렀다면 직원이 올 때까지 기다리세요.',
        locations: ['식당'],
        sources: [],
      },
      {
        title: '촬영 금지 표시가 있는 상점 내부나 인물을 허락 없이 촬영하지 마세요',
        category: '사진 촬영',
        risk: '높음',
        type: '시설 규칙 및 프라이버시',
        range: '시설마다 다름',
        reason:
          '디자인 보호, 다른 손님의 프라이버시, 통행 방해 등의 이유로 촬영을 엄격히 금지하는 곳이 많습니다. 특히 특정 거리(예: 교토 기온 거리 일부)에서는 사진 촬영 시 1만엔의 벌금이 부과될 수 있습니다.',
        alternative: '카메라에 X표시가 된 안내문을 잘 확인하고, 촬영 전에 직원이나 대상에게 허락을 요청하세요.',
        locations: ['시장', '거리·공공장소'],
        sources: [{ title: '교토 기온(하나미코지) 사도(私道) 촬영 금지 안내' }],
      },
      {
        title: '신사나 사찰의 제한 구역에 들어가지 마세요',
        category: '종교시설',
        risk: '높음',
        type: '시설 규칙·문화적 금기',
        range: '시설마다 다름',
        reason: '신성하게 여기는 공간이거나 문화재 보호를 위해 출입을 통제하는 곳입니다. 무단 침입 시 강한 제재를 받을 수 있습니다.',
        alternative: '안내판과 출입 제한선(주로 낮은 울타리나 줄)을 반드시 확인하고 관람 동선을 지키세요.',
        locations: ['사찰·신사'],
        sources: [],
      },
      {
        title: '택시 문을 억지로 직접 열고 닫지 마세요',
        category: '대중교통',
        risk: '참고',
        type: '이용 방식',
        range: '자동문이 설치된 일본 택시',
        reason:
          '대부분의 일본 택시는 운전기사가 레버로 문을 열고 닫는 자동문입니다. 억지로 힘을 주어 열거나 닫으면 고장의 원인이 될 수 있습니다.',
        alternative: '택시가 정차하면 기사가 자동으로 문을 열고 닫아줄 때까지 잠시 기다리세요.',
        diffFromKorea: '한국은 승객이 직접 문을 여닫는 것이 일반적이지만 일본은 다릅니다.',
        locations: ['대중교통'],
        sources: [],
      },
      {
        title: '쓰레기를 아무 곳에나 버리지 마세요',
        category: '거리·공공장소',
        risk: '보통',
        type: '일반 규칙',
        range: '일본 전반',
        reason: '거리가 깨끗하게 유지되는 것을 중요하게 생각하며, 쓰레기통이 없는 경우가 많습니다.',
        alternative: '편의점, 역 내부, 자판기 옆의 쓰레기통을 찾거나, 작은 비닐봉지를 챙겨 숙소로 가져가 분리배출하세요.',
        locations: ['거리·공공장소', '시장'],
        sources: [],
      },
    ],
  },
  {
    name: '태국',
    slug: 'thailand',
    cities: [
      { name: '방콕', slug: 'bangkok' },
      { name: '치앙마이', slug: 'chiangmai' },
      { name: '푸껫', slug: 'phuket' },
    ],
    warnings: [
      {
        title: '국왕과 왕실을 모독하거나 비하하지 마세요',
        category: '법률·안전',
        risk: '매우 높음',
        type: '법률(왕실모독죄)',
        range: '태국 전역',
        reason:
          '태국은 왕실모독죄(lèse-majesté)를 매우 엄격하게 적용합니다. 왕실에 대한 비판·조롱은 SNS 게시물이라도 장기 징역형으로 이어질 수 있습니다.',
        alternative: '왕실·국왕에 대한 언급은 삼가고, 왕실 관련 장소·행사에서는 예의를 지키세요.',
        diffFromKorea: '한국에는 없는 강력한 형사처벌 대상입니다. 농담으로도 절대 언급하지 마세요.',
        locations: ['거리·공공장소'],
        sources: [{ title: '외교부 해외안전여행 — 태국 형법(왕실모독죄) 유의사항' }],
      },
      {
        title: '전자담배(베이프)를 반입하거나 사용하지 마세요',
        category: '법률·안전',
        risk: '매우 높음',
        type: '법률(수입·판매 금지)',
        range: '태국 전역',
        reason:
          '태국은 전자담배의 수입·판매·소지를 법으로 금지합니다. 적발 시 고액의 벌금 또는 구금될 수 있으며 외국인도 예외가 아닙니다.',
        alternative: '전자담배는 아예 가져가지 마세요. 일반 담배는 지정 흡연 구역에서만 이용하세요.',
        diffFromKorea: '한국에서는 합법인 전자담배가 태국에서는 불법입니다.',
        locations: ['거리·공공장소'],
        sources: [{ title: '외교부 해외안전여행 — 태국 전자담배 반입 금지 안내' }],
      },
      {
        title: '사원(왓)에 노출이 심한 복장으로 들어가지 마세요',
        category: '종교시설',
        risk: '높음',
        type: '시설 규칙·문화',
        range: '태국 전역 사원',
        reason: '어깨와 무릎이 드러나는 복장으로는 사원 입장이 제한됩니다. 불교 성지에 대한 존중이 매우 중요합니다.',
        alternative: '어깨와 무릎을 가리는 옷을 입고, 입장 전 신발을 벗으세요. 필요 시 현장에서 가리개(사롱)를 대여하세요.',
        locations: ['사찰·신사'],
        sources: [{ title: '태국 관광청(TAT) 사원 방문 복장 안내' }],
      },
      {
        title: '불상 위에 올라가거나 불상을 함부로 다루지 마세요',
        category: '종교시설',
        risk: '높음',
        type: '법률·문화적 금기',
        range: '태국 전역',
        reason:
          '불상과 함께 무례한 자세로 사진을 찍거나 불상 위에 올라가는 행위는 불경죄로 간주되어 처벌 대상이 될 수 있습니다.',
        alternative: '불상은 항상 존중하는 태도로 대하고, 불상보다 높은 위치에 서지 마세요.',
        locations: ['사찰·신사'],
        sources: [{ title: '태국 문화 — 불상 존중 관련 안내' }],
      },
      {
        title: '사람의 머리를 만지거나 발로 물건·사람을 가리키지 마세요',
        category: '사람과의 관계',
        risk: '보통',
        type: '문화적 금기',
        range: '태국 전역',
        reason:
          '태국에서 머리는 가장 신성한 부위, 발은 가장 낮고 부정한 부위로 여겨집니다. 머리를 만지거나 발로 가리키는 것은 큰 무례입니다.',
        alternative: '아이라도 머리를 함부로 쓰다듬지 말고, 발로 물건을 가리키거나 사람을 향하지 마세요.',
        diffFromKorea: '한국보다 신체 부위에 대한 상징적 금기가 강합니다.',
        locations: ['거리·공공장소'],
        sources: [],
      },
      {
        title: '지폐나 국왕 초상이 그려진 것을 밟지 마세요',
        category: '법률·안전',
        risk: '높음',
        type: '법률·문화',
        range: '태국 전역',
        reason:
          '태국 지폐와 동전에는 국왕의 초상이 새겨져 있습니다. 바람에 날아가는 지폐를 발로 밟아 멈추는 행동조차 왕실모독으로 해석될 수 있습니다.',
        alternative: '돈을 밟지 말고 손으로 집으세요. 화폐를 소중히 다루세요.',
        locations: ['거리·공공장소', '시장'],
        sources: [],
      },
    ],
  },
  {
    name: '싱가포르',
    slug: 'singapore',
    cities: [{ name: '싱가포르', slug: 'singapore' }],
    warnings: [
      {
        title: '껌을 반입하거나 씹지 마세요',
        category: '법률·안전',
        risk: '높음',
        type: '법률(수입·판매 규제)',
        range: '싱가포르 전역',
        reason:
          '싱가포르는 치료용을 제외한 껌의 수입·판매를 금지합니다. 대량 반입이나 무단 판매는 처벌 대상이며, 아무 데나 뱉으면 별도 벌금이 부과됩니다.',
        alternative: '껌은 가져가지 않는 것이 안전합니다.',
        diffFromKorea: '한국에서는 일상적인 껌이 싱가포르에서는 강하게 규제됩니다.',
        locations: ['거리·공공장소'],
        sources: [{ title: '싱가포르 정부 — 껌 수입/판매 규제 안내' }],
      },
      {
        title: '지하철(MRT)과 역 구내에서 음식이나 음료를 먹지 마세요',
        category: '대중교통',
        risk: '높음',
        type: '법률·시설 규칙',
        range: '싱가포르 MRT 전역',
        reason: 'MRT 차량과 역 유료 구간에서의 취식은 벌금 대상입니다. 물조차 금지됩니다.',
        alternative: '음식·음료는 역 밖에서 드세요. 개봉하지 않은 채로 소지하는 것은 가능합니다.',
        locations: ['지하철', '대중교통'],
        sources: [{ title: 'SMRT/LTA 대중교통 이용 규칙(취식 금지) 안내' }],
      },
      {
        title: '아무 곳에나 쓰레기를 버리지 마세요',
        category: '거리·공공장소',
        risk: '높음',
        type: '법률(고액 벌금)',
        range: '싱가포르 전역',
        reason: '싱가포르는 무단 투기에 매우 높은 벌금과 반복 시 사회봉사 명령을 부과하는 것으로 유명합니다.',
        alternative: '쓰레기는 반드시 쓰레기통에 버리고, 없으면 소지했다가 처리하세요.',
        locations: ['거리·공공장소', '시장'],
        sources: [{ title: '싱가포르 국가환경청(NEA) 투기 벌금 안내' }],
      },
      {
        title: '지정된 곳이 아닌 데서 무단횡단하지 마세요',
        category: '법률·안전',
        risk: '보통',
        type: '법률(경범 벌금)',
        range: '싱가포르 전역',
        reason: '횡단보도 50m 이내에서의 무단횡단(재이워킹)은 벌금 대상입니다.',
        alternative: '반드시 횡단보도와 보행 신호를 이용하세요.',
        locations: ['거리·공공장소'],
        sources: [],
      },
      {
        title: '지정 흡연 구역 밖에서 담배를 피우지 마세요',
        category: '법률·안전',
        risk: '높음',
        type: '법률·지역 규칙',
        range: '싱가포르 전역',
        reason: '많은 공공장소·실내·일부 거리에서 흡연이 금지되어 있으며 위반 시 벌금이 부과됩니다.',
        alternative: '노란 선으로 표시된 지정 흡연 구역을 이용하세요.',
        locations: ['거리·공공장소'],
        sources: [{ title: '싱가포르 국가환경청(NEA) 금연 구역 안내' }],
      },
      {
        title: '두리안을 대중교통에 반입하지 마세요',
        category: '대중교통',
        risk: '참고',
        type: '시설 규칙',
        range: '싱가포르 MRT/버스',
        reason: '강한 냄새 때문에 MRT와 버스에는 두리안 반입이 금지되어 있습니다.',
        alternative: '두리안은 대중교통 대신 택시 등으로 옮기거나 현장에서 드세요.',
        locations: ['지하철', '대중교통'],
        sources: [],
      },
    ],
  },
];

async function main() {
  // 멱등성: 기존 데이터 정리 (Cascade로 하위 레코드 함께 삭제)
  await prisma.source.deleteMany();
  await prisma.warning.deleteMany();
  await prisma.city.deleteMany();
  await prisma.country.deleteMany();

  for (const c of DATA) {
    const country = await prisma.country.create({
      data: {
        name: c.name,
        slug: c.slug,
        cities: { create: c.cities.map((city) => ({ name: city.name, slug: city.slug })) },
      },
      include: { cities: true },
    });

    const citySlugToId = Object.fromEntries(country.cities.map((city) => [city.slug, city.id]));

    let order = 0;
    for (const w of c.warnings) {
      await prisma.warning.create({
        data: {
          title: w.title,
          category: w.category,
          risk: w.risk,
          type: w.type,
          range: w.range,
          reason: w.reason,
          alternative: w.alternative,
          diffFromKorea: w.diffFromKorea ?? null,
          checkNeeded: w.checkNeeded ?? null,
          locations: JSON.stringify(w.locations ?? []),
          order: order++,
          countryId: country.id,
          cityId: w.city ? (citySlugToId[w.city] ?? null) : null,
          sources: {
            create: (w.sources ?? []).map((s) => ({
              title: s.title,
              url: s.url ?? null,
              checkedAt: s.checkedAt ? new Date(s.checkedAt) : null,
            })),
          },
        },
      });
    }
    console.log(`seeded ${c.name}: ${c.warnings.length} warnings`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
