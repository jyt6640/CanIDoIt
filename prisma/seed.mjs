// 해도돼? 시드 데이터
// 국가/도시/주의사항/출처를 삽입한다. 멱등하도록 매 실행 시 초기화 후 재삽입.
import { PrismaClient } from '@prisma/client';
import { OFFICIAL_EXPANSION } from './seed-data/official-expansion.mjs';
import { REGION_CATALOG } from './seed-data/regions.mjs';
import { CITY_PRIORITIES, COUNTRY_PRIORITIES, PRIORITY_SOURCE, REGION_PRIORITIES } from './seed-data/travel-priorities.mjs';
import { CULTURAL_ETIQUETTE } from './seed-data/cultural-etiquette.mjs';
import { COMMUNITY_CULTURAL_SIGNALS } from './seed-data/community-cultural-signals.mjs';

const prisma = new PrismaClient();

const RISK_MAP = {
  '매우 높음': 'CRITICAL',
  '높음': 'HIGH',
  '보통': 'MEDIUM',
  '참고': 'INFO',
};

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
      {
        title: '도쿄에서 에스컬레이터 오른쪽에 서 있지 마세요',
        category: '대중교통',
        risk: '보통',
        type: '지역 관행',
        range: '도쿄 및 수도권',
        city: 'tokyo',
        reason: '도쿄권에서는 에스컬레이터에서 왼쪽에 서고 오른쪽은 걷는 사람을 위해 비워두는 관행이 있습니다. 오른쪽에 서 있으면 급한 사람의 통행을 막게 됩니다.',
        alternative: '도쿄에서는 왼쪽에 서세요. (단, 안전상 걷기를 자제하자는 캠페인도 있으니 안내를 따르세요.)',
        diffFromKorea: '지역마다 서는 방향이 달라, 오사카와 반대입니다.',
        locations: ['지하철', '대중교통'],
        sources: [],
      },
      {
        title: '오사카에서 에스컬레이터 왼쪽에 서 있지 마세요',
        category: '대중교통',
        risk: '보통',
        type: '지역 관행',
        range: '오사카',
        city: 'osaka',
        reason: '오사카에서는 도쿄와 반대로, 에스컬레이터에서 오른쪽에 서고 왼쪽을 비워두는 관행이 있습니다.',
        alternative: '오사카에서는 오른쪽에 서세요. 도쿄와 방향이 반대이니 주의하세요.',
        diffFromKorea: '같은 일본이라도 도쿄(왼쪽)와 오사카(오른쪽)의 관행이 반대입니다.',
        locations: ['지하철', '대중교통'],
        sources: [],
      },
      {
        title: '교토 기온에서 게이샤·마이코를 쫓아가거나 허락 없이 촬영하지 마세요',
        category: '사진 촬영',
        risk: '높음',
        type: '지역 규칙·프라이버시',
        range: '교토 기온 일대',
        city: 'kyoto',
        reason: '게이샤·마이코를 붙잡거나 무단 촬영하는 관광객 문제로, 기온의 일부 사도(私道)에서는 촬영이 금지되고 위반 시 벌금이 부과될 수 있습니다.',
        alternative: '정해진 공공 도로에서만 이동하고, 인물 촬영은 반드시 허락을 받으세요. 촬영 금지 안내판을 확인하세요.',
        locations: ['거리·공공장소'],
        sources: [{ title: '교토 기온(하나미코지) 사도 촬영 금지 및 매너 안내' }],
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
  {
    name: '베트남',
    slug: 'vietnam',
    cities: [
      { name: '다낭', slug: 'danang' },
      { name: '하노이', slug: 'hanoi' },
      { name: '호치민', slug: 'hochiminh' },
    ],
    warnings: [
      {
        title: '마약류를 소지·반입하지 마세요',
        category: '법률·안전',
        risk: '매우 높음',
        type: '법률(중형)',
        range: '베트남 전역',
        reason:
          '베트남은 마약 범죄를 매우 엄중하게 처벌하며, 일정량 이상 소지·운반 시 최고 사형까지 선고될 수 있습니다. 외국인도 예외가 아닙니다.',
        alternative: '어떤 경우에도 마약류에 관여하지 말고, 타인의 짐을 대신 들어주는 것도 삼가세요.',
        diffFromKorea: '처벌 수위가 한국보다 훨씬 무겁습니다.',
        locations: ['거리·공공장소'],
        sources: [{ title: '외교부 해외안전여행 — 베트남 마약 관련 유의사항' }],
      },
      {
        title: '공항·거리에서 미터기 없는 택시를 함부로 타지 마세요',
        category: '대중교통',
        risk: '보통',
        type: '이용 방식·금전',
        range: '베트남 전역',
        reason: '비공식 택시나 미터기 조작으로 요금을 과다 청구하는 사례가 있습니다.',
        alternative: '그랩(Grab) 등 차량 호출 앱이나 공인된 택시 회사를 이용하고, 탑승 전 요금을 확인하세요.',
        locations: ['대중교통'],
        sources: [],
      },
      {
        title: '사원·사찰에 노출이 심한 복장으로 들어가지 마세요',
        category: '종교시설',
        risk: '높음',
        type: '시설 규칙·문화',
        range: '베트남 전역 사원',
        reason: '불교·유교 사원은 어깨와 무릎을 가리는 단정한 복장을 요구하며, 노출이 심하면 입장이 제한됩니다.',
        alternative: '어깨·무릎을 가리는 옷을 준비하고, 사원 내에서는 정숙하며 안내를 따르세요.',
        locations: ['사찰·신사'],
        sources: [],
      },
      {
        title: '오토바이가 몰리는 도로를 무리하게 건너지 마세요',
        category: '법률·안전',
        risk: '보통',
        type: '안전',
        range: '베트남 도시 전반',
        reason: '오토바이 통행량이 매우 많아, 갑자기 뛰거나 멈추면 오히려 사고 위험이 커집니다.',
        alternative: '일정한 속도로 천천히 걸으며 건너면 오토바이가 알아서 피해 갑니다. 가능하면 신호·횡단보도를 이용하세요.',
        locations: ['거리·공공장소'],
        sources: [],
      },
      {
        title: '군사·보안 시설을 허락 없이 촬영하지 마세요',
        category: '사진 촬영',
        risk: '높음',
        type: '법률',
        range: '베트남 전역',
        reason: '군사·보안 관련 시설 촬영은 법으로 금지되며, 적발 시 제재를 받을 수 있습니다.',
        alternative: '촬영 금지 표시가 있거나 군·경 관련 시설로 보이면 촬영하지 마세요.',
        locations: ['거리·공공장소'],
        sources: [],
      },
    ],
  },
  {
    name: '대만',
    slug: 'taiwan',
    cities: [
      { name: '타이베이', slug: 'taipei' },
      { name: '가오슝', slug: 'kaohsiung' },
    ],
    warnings: [
      {
        title: '지하철(MRT)과 역 구내에서 먹거나 마시지 마세요',
        category: '대중교통',
        risk: '높음',
        type: '법률·시설 규칙',
        range: '대만 MRT 전역',
        reason: 'MRT 유료 구역과 차량 안에서는 음식·음료(물·껌 포함) 섭취가 금지되며 위반 시 벌금이 부과됩니다.',
        alternative: '취식은 역 밖에서 하고, 차량 안에서는 물도 마시지 마세요.',
        diffFromKorea: '한국 지하철보다 취식 규제가 훨씬 엄격하고 실제 벌금이 부과됩니다.',
        locations: ['지하철', '대중교통'],
        sources: [{ title: '타이베이 첩운(MRT) 대중운수법 취식 금지 안내' }],
      },
      {
        title: '실내와 지정 구역 밖에서 담배를 피우지 마세요',
        category: '법률·안전',
        risk: '높음',
        type: '법률',
        range: '대만 전역',
        reason: '많은 실내 공공장소와 일부 거리에서 흡연이 금지되어 있으며 위반 시 벌금이 부과됩니다.',
        alternative: '지정된 흡연 구역을 이용하세요.',
        locations: ['거리·공공장소'],
        sources: [],
      },
      {
        title: '밥그릇에 젓가락을 수직으로 꽂지 마세요',
        category: '식당',
        risk: '보통',
        type: '문화적 금기',
        range: '대만 전역',
        reason: '밥에 젓가락을 꽂는 모습은 제사(향)를 연상시켜 큰 결례로 여겨집니다.',
        alternative: '젓가락은 그릇 옆이나 받침대에 가지런히 놓으세요.',
        locations: ['식당'],
        sources: [],
      },
      {
        title: '냄새가 강한 음식을 대중교통에 들고 타지 마세요',
        category: '대중교통',
        risk: '참고',
        type: '매너',
        range: '대만 MRT/버스',
        reason: '취식 금지와 더불어, 냄새가 강한 음식은 다른 승객에게 불편을 줍니다.',
        alternative: '포장 음식은 밀봉해 들고 타고, 냄새가 강한 것은 이동 중 섭취를 피하세요.',
        locations: ['지하철', '대중교통'],
        sources: [],
      },
    ],
  },
  {
    name: '미국',
    slug: 'usa',
    cities: [
      { name: '괌', slug: 'guam' },
      { name: '하와이', slug: 'hawaii' },
      { name: '뉴욕', slug: 'newyork' },
    ],
    warnings: [
      {
        title: '미성년자 자녀를 차량에 혼자 방치하지 마세요',
        category: '법률·안전',
        risk: '매우 높음',
        type: '형법(아동 학대·방임)',
        range: '미국 및 괌 전역',
        reason: '미국과 괌에서는 만 12세 이하(혹은 6세 이하) 아동을 차량에 보호자 없이 혼자 방치하는 행위를 아동 학대 및 방임죄로 엄격히 처벌하며, 발견 시 경찰에 즉시 체포되어 구금될 수 있습니다.',
        alternative: '아주 짧은 시간이라도 차에서 내릴 때는 반드시 자녀를 동반하여 함께 내리세요.',
        diffFromKorea: '한국에서는 훈방이나 경고에 그칠 수 있는 상황도 미국에서는 경찰에 즉시 체포되어 형사 처벌 대상이 됩니다.',
        checkNeeded: '주마다 단독 승차 방치가 불법인 아동의 연령 기준이 다를 수 있으나, 기본적으로 혼자 두지 않는 것이 안전합니다.',
        locations: ['거리·공공장소'],
        sources: [{ title: '괌 아동 보호법 및 미국 아동 방임 관련 형사 처벌 지침' }],
      },
      {
        title: '육류 성분이 포함된 라면이나 가공식품을 반입하지 마세요',
        category: '법률·안전',
        risk: '높음',
        type: '세관 규정',
        range: '미국 모든 공항',
        reason: '가축 전염병 유입을 방지하기 위해 소고기, 돼지고기, 닭고기 성분(수프 포함)이 들어간 모든 가공식품의 반입을 엄격히 금지합니다. 세관에 신고하지 않고 적발 시 압수 및 고액의 벌금이 부과됩니다.',
        alternative: '고기 수프 성분이 들어간 라면, 카레, 육포, 소시지 등은 가져가지 마세요. 비건용(육류 없음) 라면을 준비하거나 현지 한인마트를 이용하세요.',
        locations: ['지하철', '대중교통'],
        sources: [{ title: '미국 세관국경보호청(CBP) 농산물 및 가공식품 반입 제한 안내' }],
      },
      {
        title: '식당이나 호텔에서 팁을 주지 않고 나오지 마세요',
        category: '식당',
        risk: '보통',
        type: '일반 매너',
        range: '미국 전반',
        reason: '미국 서비스 업계 종사자들의 임금은 고객의 팁을 전제로 책정되어 있어, 팁은 단순 호의가 아닌 의무에 가까운 문화입니다. 팁을 주지 않으면 매우 무례한 행동으로 여겨집니다.',
        alternative: '테이블 서비스를 제공하는 식당에서는 음식값의 15%~20%, 호텔 룸서비스나 벨보이에게는 1~2달러를 팁으로 제공하세요. 단, 계산서에 서비스 차지(Service Charge)가 포함되어 있다면 추가 팁은 필수가 아닙니다.',
        diffFromKorea: '한국에는 팁 문화가 없으므로 잊어버리기 쉽지만, 미국 여행 시에는 필수적으로 예산을 책정해야 합니다.',
        locations: ['식당'],
        sources: [{ title: '미국 관광청 공식 팁 에티켓 가이드' }],
      },
    ],
  },
  {
    name: '필리핀',
    slug: 'philippines',
    cities: [
      { name: '세부', slug: 'cebu' },
      { name: '보라카이', slug: 'boracay' },
      { name: '마닐라', slug: 'manila' },
    ],
    warnings: [
      {
        title: '지정된 구역 외 공공장소에서 흡연(전자담배 포함)하지 마세요',
        category: '법률·안전',
        risk: '매우 높음',
        type: '법률·대통령령',
        range: '필리핀 전역 공공장소',
        reason: '필리핀은 공공장소(길거리, 해변 등)에서의 흡연에 대해 강력한 금연령을 시행하고 있습니다. 적발 시 현장에서 즉시 연행되어 고액의 벌금이나 구금 처분을 받을 수 있습니다. 전자담배도 동일하게 규제됩니다.',
        alternative: '반드시 흡연 구역(Smoking Area) 표지판이 명시된 지정된 구역에서만 흡연하세요. 특히 보라카이 해변 같은 자연보호 구역은 전면 금연입니다.',
        diffFromKorea: '한국의 금연 구역보다 훨씬 엄격하게 사복 단속원들이 집중 단속하며, 적발 시 예외 없이 경찰서로 연행됩니다.',
        locations: ['거리·공공장소'],
        sources: [{ title: '필리핀 대통령령 제26호 (전국 공공장소 흡연 금지령)' }],
      },
      {
        title: '5만 페소 이상의 필리핀 화폐를 소지하고 입출국하지 마세요',
        category: '법률·안전',
        risk: '높음',
        type: '외환 규정',
        range: '필리핀 모든 공항',
        reason: '필리핀 중앙은행 규정에 따라 1인당 5만 페소(약 120만 원 상당) 이상의 현지 화폐를 휴대하고 세관 신고 없이 입출국하는 것은 엄격히 금지됩니다. 적발 시 현장에서 압수 및 사법 처리를 받게 됩니다.',
        alternative: '페소화 환전은 5만 페소 미만으로 유지하고, 고액이 필요할 때는 미화 달러(1만 달러 이내)로 가져가 현지 환전소를 이용하거나 신용카드를 사용하세요.',
        diffFromKorea: '외국인 관광객의 편의를 봐주지 않고 철저하게 위반 금액을 전액 압수하므로 주의가 필요합니다.',
        locations: ['지하철', '대중교통'],
        sources: [{ title: '필리핀 중앙은행(BSP) 외화 및 현지화 반출입 통제 조항' }],
      },
      {
        title: '전자담배 기기를 개인용 한도 초과로 반입하지 마세요',
        category: '법률·안전',
        risk: '높음',
        type: '세관 규정',
        range: '필리핀 모든 공항',
        reason: '필리핀 공항 세관은 전자담배 반입에 엄격하여, 새 제품 여러 개나 많은 카트리지를 반입하려다 판매용 밀수로 의심받아 전량 압수 및 세금 폭탄을 맞을 수 있습니다.',
        alternative: '본인이 직접 사용 중인 1기기 정도만 지참하시고 포장을 뜯지 않은 새 제품 상태의 전자담배는 반입을 피하세요.',
        locations: ['지하철', '대중교통'],
        sources: [{ title: '필리핀 관세청(BOC) 수하물 통관 가이드라인' }],
      },
    ],
  },
  {
    name: '프랑스',
    slug: 'france',
    cities: [
      { name: '파리', slug: 'paris' },
    ],
    warnings: [
      {
        title: '대중교통 티켓을 구매했더라도 개찰구 기계에 확인(펀칭) 없이 탑승하지 마세요',
        category: '대중교통',
        risk: '높음',
        type: '대중교통 이용 규칙',
        range: '파리 시내 RER/지하철/버스',
        reason: '종이 티켓이나 교통카드를 소지했더라도 탑승 시 개찰구 기계나 차내 단말기에 태그(유효화)하지 않고 탑승하면 단속반 검표 시 무임승차로 처리되어 현장에서 수십 유로의 즉시 벌금을 물게 됩니다.',
        alternative: '탑승 전 개찰구 또는 차내 펀칭기에 티켓을 반드시 통과시켜 인식시키고, 목적지에서 내릴 때까지 절대 티켓을 버리지 마세요.',
        diffFromKorea: '한국과 달리 불시 검표원이 지하철 통로나 버스 내부에서 철저하게 체크하며, 고의가 아니어도 펀칭 기록이 없으면 현장 벌금을 강제 징수합니다.',
        locations: ['지하철', '대중교통'],
        sources: [{ title: '파리 교통공사(RATP) 이용객 에티켓 및 무임승차 벌금 고지' }],
      },
      {
        title: '길거리나 공원에서 비둘기에게 먹이를 주지 마세요',
        category: '거리·공공장소',
        risk: '보통',
        type: '지역 조례',
        range: '파리 시내 전역',
        reason: '도시 위생 문제, 배설물로 인한 문화재 부식, 질병 전파 및 비둘기 개체 수 조절을 위해 파리 시 조례로 길거리와 공원에서 비둘기나 야생 조류에게 먹이를 주는 행위를 전면 금지하며 위반 시 벌금이 부과됩니다.',
        alternative: '공원 벤치나 노천카페에서 빵 부스러기 등의 과자나 먹이를 던져주지 마세요.',
        locations: ['거리·공공장소'],
        sources: [{ title: '파리시 지역 위생 규정 (Réglement Sanitaire Départemental)' }],
      },
      {
        title: '관광지나 지하철에서 서명을 요구하거나 말을 거는 사람에게 응대하지 마세요',
        category: '법률·안전',
        risk: '높음',
        type: '안전 수칙',
        range: '파리 주요 관광지',
        reason: '파리 주요 관광지에서 탄원서 서명을 요구하며 둘러싸거나, 소지품을 떨어뜨려 주위를 분산시키는 행위는 100% 소매치기 집단의 수법입니다. 대화하는 도중 다른 일행이 가방이나 주머니를 털어갑니다.',
        alternative: '서명판을 들고 오거나 말을 거는 낯선 사람은 눈길도 주지 말고 "노(No)"라고 단호히 말하며 계속 걸어가세요. 가방은 항상 몸 앞으로 멥니다.',
        locations: ['거리·공공장소', '지하철'],
        sources: [{ title: '주프랑스 대한민국 대사관 소매치기 예방 및 안전 지침' }],
      },
    ],
  },
  {
    name: '이탈리아',
    slug: 'italy',
    cities: [
      { name: '로마', slug: 'rome' },
      { name: '밀라노', slug: 'milano' },
      { name: '베네치아', slug: 'venice' },
    ],
    warnings: [
      {
        title: '스페인 계단 등 역사 유적지의 계단에 앉아 쉬거나 음식을 먹지 마세요',
        category: '거리·공공장소',
        risk: '높음',
        type: '지역 조례',
        range: '로마 스페인 계단 및 주요 광장',
        reason: '로마 시는 역사적 문화재 훼손 방지와 좁은 통로의 보행 방해를 막기 위해 스페인 계단 등 지정된 유적지에 착석하거나 식사하는 행동을 전면 금지합니다. 적발 시 경찰이 호루라기를 불며 벌금(250유로~400유로)을 부과합니다.',
        alternative: '계단은 통행용으로만 사용하시고, 휴식은 인근 광장 벤치나 노천카페를 이용하세요.',
        diffFromKorea: '영화 속 장면을 흉내 내며 계단에 앉아 아이스크림이나 피자를 먹는 등의 행동은 로마에서 불법이므로 절대 삼가야 합니다.',
        locations: ['거리·공공장소'],
        sources: [{ title: '로마 시 도시 경찰 조례 및 문화재 보호 규정' }],
      },
      {
        title: '기차나 시내버스를 탄 직후 티켓을 단말기에 넣어 개표(펀칭)하지 않은 채 이동하지 마세요',
        category: '대중교통',
        risk: '높음',
        type: '대중교통 이용 규칙',
        range: '이탈리아 전역 열차 및 시내버스',
        reason: '이탈리아의 일반 기차 티켓이나 버스 티켓은 날짜와 시간이 인쇄되어 있지 않은 경우가 많습니다. 탑승 직전 플랫폼의 펀칭 기계에 표를 넣어 인쇄 처리(Validation)를 해야만 유효한 표로 인정됩니다. 미이행 시 고액의 벌금을 냅니다.',
        alternative: '기차 플랫폼이나 버스 내부에 설치된 초록색 또는 노란색 펀칭기에 기차표 끝을 밀어 넣어 시간과 날짜가 인쇄된 것을 확인하고 소지하세요.',
        locations: ['지하철', '대중교통'],
        sources: [{ title: '이탈리아 국영철도(Trenitalia) 티켓 유효화 규정' }],
      },
      {
        title: '길거리나 해변에서 파는 위조 명품을 구매하지 마세요',
        category: '쇼핑·결제',
        risk: '높음',
        type: '법률',
        range: '이탈리아 전역',
        reason: '이탈리아 정부는 브랜드 지식재산권 보호와 탈세 방지를 위해 위조품(짝퉁)을 구매하는 행위도 강력히 단속합니다. 짝퉁을 구매하다 적발되면 구매자에게 최대 7,000유로(약 1,000만 원)에 달하는 막대한 벌금이 부과될 수 있습니다.',
        alternative: '유적지 길거리 노점상에서 판매하는 가짜 명품 가방, 시계, 선글라스 등은 구매하지 마세요.',
        diffFromKorea: '이탈리아는 판매자뿐만 아니라 단순 구매자(관광객 포함)에게도 엄청난 금액의 벌금을 부과합니다.',
        locations: ['거리·공공장소', '시장'],
        sources: [{ title: '이탈리아 지식재산권 보호법 및 불법 노점상 구매 처벌 규정' }],
      },
    ],
  },
  ...OFFICIAL_EXPANSION,
  ...CULTURAL_ETIQUETTE,
  ...COMMUNITY_CULTURAL_SIGNALS,
];

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    throw new Error('운영 환경 Seed는 ALLOW_PRODUCTION_SEED=true일 때만 실행할 수 있습니다.');
  }

  for (const c of DATA) {
    const country = await prisma.country.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        priorityScore: COUNTRY_PRIORITIES[c.slug] ?? 0,
        contentStatus: c.warnings.some((warning) => (warning.sources ?? []).some((source) => source.url)) ? 'AVAILABLE' : 'IN_REVIEW',
        prioritySource: PRIORITY_SOURCE.url,
        priorityCheckedAt: new Date(PRIORITY_SOURCE.checkedAt),
      },
      create: {
        name: c.name,
        slug: c.slug,
        priorityScore: COUNTRY_PRIORITIES[c.slug] ?? 0,
        contentStatus: c.warnings.some((warning) => (warning.sources ?? []).some((source) => source.url)) ? 'AVAILABLE' : 'IN_REVIEW',
        prioritySource: PRIORITY_SOURCE.url,
        priorityCheckedAt: new Date(PRIORITY_SOURCE.checkedAt),
      },
    });

    const cities = [];
    const regions = [];
    for (const regionData of REGION_CATALOG[c.slug] ?? []) {
      regions.push(await prisma.region.upsert({
        where: { countryId_slug: { countryId: country.id, slug: regionData.slug } },
        update: {
          name: regionData.name,
          type: regionData.type,
          priorityScore: REGION_PRIORITIES[`${c.slug}:${regionData.slug}`] ?? 0,
          contentStatus: 'PARTIAL',
        },
        create: {
          name: regionData.name, slug: regionData.slug, type: regionData.type, countryId: country.id,
          priorityScore: REGION_PRIORITIES[`${c.slug}:${regionData.slug}`] ?? 0,
          contentStatus: 'PARTIAL',
        },
      }));
    }
    const regionSlugToId = Object.fromEntries(regions.map((region) => [region.slug, region.id]));
    const cityToRegionSlug = Object.fromEntries(
      (REGION_CATALOG[c.slug] ?? []).flatMap((region) => region.cities.map((city) => [city, region.slug])),
    );
    for (const cityData of c.cities) {
      const regionId = cityToRegionSlug[cityData.slug] ? regionSlugToId[cityToRegionSlug[cityData.slug]] : null;
      cities.push(await prisma.city.upsert({
        where: { countryId_slug: { countryId: country.id, slug: cityData.slug } },
        update: {
          name: cityData.name, regionId,
          priorityScore: CITY_PRIORITIES[`${c.slug}:${cityData.slug}`] ?? 0,
          contentStatus: 'PARTIAL',
        },
        create: {
          name: cityData.name, slug: cityData.slug, countryId: country.id, regionId,
          priorityScore: CITY_PRIORITIES[`${c.slug}:${cityData.slug}`] ?? 0,
          contentStatus: 'PARTIAL',
        },
      }));
    }
    const citySlugToId = Object.fromEntries(cities.map((city) => [city.slug, city.id]));

    let order = 0;
    for (const w of c.warnings) {
      const key = w.key ?? `${c.slug}-${w.city ?? 'common'}-${String(order + 1).padStart(3, '0')}`;
      const warningData = {
          title: w.title,
          category: w.category,
          risk: RISK_MAP[w.risk],
          type: w.type,
          range: w.range,
          reason: w.reason,
          alternative: w.alternative,
          diffFromKorea: w.diffFromKorea ?? null,
          checkNeeded: w.checkNeeded ?? null,
          locations: w.locations ?? [],
          keywords: Array.from(new Set([w.category, w.type, ...(w.locations ?? [])])),
          aliases: [w.title.replace(/(하지|마세요|않도록|금지).*/g, '').trim()].filter(Boolean),
          evidenceLevel: w.evidenceLevel ?? 'OFFICIAL',
          contextNotes: w.contextNotes ?? null,
          sideEffects: w.sideEffects ?? null,
          counterpoint: w.counterpoint ?? null,
          independentSourceCount: w.independentSourceCount ?? (w.sources ?? []).length,
          order: order++,
          archived: false,
          status: w.status ?? ((w.sources ?? []).length > 0 ? 'VERIFIED' : 'REVIEWING'),
          verifiedAt: (w.status ?? ((w.sources ?? []).length > 0 ? 'VERIFIED' : 'REVIEWING')) === 'VERIFIED'
            ? new Date('2026-07-18T00:00:00.000Z')
            : null,
          expiresAt: (w.status ?? ((w.sources ?? []).length > 0 ? 'VERIFIED' : 'REVIEWING')) === 'VERIFIED'
            ? new Date('2026-10-16T00:00:00.000Z')
            : null,
          reviewedBy: (w.status ?? ((w.sources ?? []).length > 0 ? 'VERIFIED' : 'REVIEWING')) === 'VERIFIED'
            ? 'content-team'
            : null,
          confidence: w.confidence ?? ((w.sources ?? []).some((source) => source.url) ? 95 : 70),
          countryId: country.id,
          cityId: w.city ? (citySlugToId[w.city] ?? null) : null,
          regionId: w.region ? (regionSlugToId[w.region] ?? null) : null,
      };
      const sources = (w.sources ?? []).map((s) => ({
              title: s.title,
              url: s.url ?? null,
              checkedAt: s.checkedAt ? new Date(s.checkedAt) : null,
              kind: s.kind ?? 'OFFICIAL',
              platform: s.platform ?? null,
              creatorName: s.creatorName ?? null,
              publishedAt: s.publishedAt ? new Date(s.publishedAt) : null,
              timestampSeconds: s.timestampSeconds ?? null,
              claimSummary: s.claimSummary ?? null,
      }));

      await prisma.warning.upsert({
        where: { key },
        update: {
          ...warningData,
          sources: { deleteMany: {}, create: sources },
        },
        create: {
          key,
          ...warningData,
          sources: { create: sources },
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
