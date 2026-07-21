const checkedAt = '2026-07-21';
const advisory = (countrySlug, title = 'Safety and security') => ({
  title: `UK FCDO - ${title}`,
  url: `https://www.gov.uk/foreign-travel-advice/${countrySlug}/safety-and-security`,
  checkedAt,
  kind: 'GOVERNMENT_ADVISORY',
  platform: 'GOV.UK',
});
const entry = (countrySlug) => ({
  title: 'UK FCDO - Entry requirements and customs',
  url: `https://www.gov.uk/foreign-travel-advice/${countrySlug}/entry-requirements`,
  checkedAt,
  kind: 'GOVERNMENT_ADVISORY',
  platform: 'GOV.UK',
});
const warning = (key, title, category, risk, type, range, reason, alternative, locations, sources) => ({
  key, title, category, risk, type, range, reason, alternative, locations, sources,
});

export const OFFICIAL_EXPANSION_V2 = [
  {
    name: '말레이시아', slug: 'malaysia',
    cities: [
      { name: '쿠알라룸푸르', slug: 'kuala-lumpur' },
      { name: '페낭', slug: 'penang' },
      { name: '코타키나발루', slug: 'kota-kinabalu' },
    ],
    warnings: [
      warning('malaysia-common-protests', '외국인 신분으로 시위나 정치 집회에 참여하지 마세요', '법률·안전', '매우 높음', '정치 활동 제한', '말레이시아 전역', '외국인의 시위·정치 집회 참여는 현지 법에 따라 문제가 될 수 있고 경찰 통제가 빠르게 강화될 수 있습니다.', '집회 장소를 피하고 현지 언론과 당국 안내를 확인하세요.', ['거리·공공장소'], [advisory('malaysia')]),
      warning('malaysia-common-drugs', '소량이라도 마약류를 소지·운반하지 마세요', '법률·안전', '매우 높음', '마약법', '말레이시아 전역', '마약 관련 범죄는 매우 무겁게 처벌될 수 있으며 타인의 짐을 대신 운반하는 행동도 위험합니다.', '성분이 불분명한 제품과 타인의 수하물을 맡지 마세요.', ['공항·세관', '거리·공공장소'], [advisory('malaysia')]),
      warning('malaysia-common-overstay', '체류 허가 기간을 하루라도 넘기지 마세요', '입국·행정', '높음', '체류 규정', '말레이시아 전역', '단기간의 초과 체류도 벌금·구금·출국 제한으로 이어질 수 있습니다.', '입국 도장과 허용 체류일을 즉시 확인하고 연장이 필요하면 만료 전에 처리하세요.', ['공항·세관'], [entry('malaysia')]),
      warning('malaysia-sabah-east-coast', '사바 동부 해안과 섬 지역의 최신 여행 경보를 무시하지 마세요', '법률·안전', '매우 높음', '지역 위험', '사바 동부 일부 지역', '납치·해상 범죄 위험으로 특정 지역에 여행 경보가 적용될 수 있습니다.', '출발 직전 지역별 경보와 숙소·투어업체의 안전 지침을 확인하세요.', ['해변', '섬', '항구'], [advisory('malaysia', 'Regional risks')]),
      warning('malaysia-common-road', '보행자 우선이라고 가정하고 도로를 건너지 마세요', '교통·보행', '높음', '도로 안전', '말레이시아 전역', '오토바이와 차량 흐름이 빠르고 횡단보도에서도 운전자 반응이 일정하지 않을 수 있습니다.', '신호와 양방향 차량을 확인하고 야간에는 밝은 옷을 착용하세요.', ['도로', '거리·공공장소'], [advisory('malaysia')]),
    ],
  },
  {
    name: '중국', slug: 'china',
    cities: [
      { name: '베이징', slug: 'beijing' },
      { name: '상하이', slug: 'shanghai' },
      { name: '광저우', slug: 'guangzhou' },
    ],
    warnings: [
      warning('china-common-passport', '여권 원본 없이 장거리 이동하거나 숙박하지 마세요', '입국·행정', '높음', '신분 확인', '중국 전역', '호텔 체크인과 경찰 신원 확인에서 여권 원본이 필요할 수 있습니다.', '여권 원본을 안전하게 소지하고 사본과 전자본은 별도로 보관하세요.', ['호텔', '대중교통', '거리·공공장소'], [advisory('china')]),
      warning('china-common-drugs', '마약류와 성분이 불분명한 제품을 소지하지 마세요', '법률·안전', '매우 높음', '마약법', '중국 전역', '마약 범죄는 매우 무겁게 처벌될 수 있고 외국인도 예외가 아닙니다.', '처방약 성분을 사전에 확인하고 타인의 물품을 운반하지 마세요.', ['공항·세관', '거리·공공장소'], [advisory('china')]),
      warning('china-common-military-photo', '군사·정부·보안 시설을 허가 없이 촬영하지 마세요', '촬영·드론', '매우 높음', '촬영 제한', '중국 전역', '민감 시설과 보안 구역 촬영은 조사·압수·구금으로 이어질 수 있습니다.', '촬영 금지 표지와 경비원 지시에 따르고 애매하면 촬영하지 마세요.', ['관광지', '거리·공공장소'], [advisory('china')]),
      warning('china-common-drone', '등록과 비행 구역 확인 없이 드론을 띄우지 마세요', '촬영·드론', '높음', '항공 규정', '중국 전역', '드론 무게·등록·공역 제한이 적용되며 공항·도심·군사시설 주변은 특히 엄격합니다.', '현지 민항당국 규정과 비행 금지 지도를 확인하세요.', ['야외', '관광지'], [advisory('china')]),
      warning('china-common-political-material', '정치적으로 민감한 자료를 공개적으로 배포·게시하지 마세요', '법률·안전', '높음', '표현·정치 활동', '중국 전역', '정치 활동과 온라인 게시물은 현지 법률과 검열 대상이 될 수 있습니다.', '공공장소와 현지 플랫폼에서 민감한 정치 활동을 피하세요.', ['거리·공공장소', '온라인'], [advisory('china')]),
    ],
  },
  {
    name: '아랍에미리트', slug: 'united-arab-emirates',
    cities: [
      { name: '두바이', slug: 'dubai' },
      { name: '아부다비', slug: 'abu-dhabi' },
    ],
    warnings: [
      warning('united-arab-emirates-common-cbd', 'CBD 오일·대마 성분 제품을 반입하지 마세요', '법률·안전', '매우 높음', '마약·통제물질', 'UAE 전역', '화장품·전자담배 액상·건강식품에 포함된 CBD도 형사 문제로 이어질 수 있습니다.', '모든 성분표를 확인하고 의심되는 제품은 가져가지 마세요.', ['공항·세관'], [advisory('united-arab-emirates')]),
      warning('united-arab-emirates-common-medicine', '통제 의약품을 서류 없이 가져가지 마세요', '건강·의약품', '매우 높음', '의약품 반입', 'UAE 전역', '일부 처방약은 사전 허가와 영문 처방전이 필요할 수 있습니다.', 'UAE 보건당국 목록을 확인하고 원래 포장·처방전·허가서를 준비하세요.', ['공항·세관'], [advisory('united-arab-emirates')]),
      warning('united-arab-emirates-common-public-affection', '공공장소에서 과도한 애정 표현을 하지 마세요', '법률·문화', '높음', '공공질서', 'UAE 전역', '공공장소의 행동은 현지 법과 사회 규범의 적용을 받을 수 있습니다.', '손잡기 정도를 넘어서는 행동은 사적인 공간으로 미루세요.', ['거리·공공장소', '관광지'], [advisory('united-arab-emirates')]),
      warning('united-arab-emirates-common-photo', '사람·정부시설·사고 현장을 허가 없이 촬영하지 마세요', '촬영·드론', '높음', '촬영·사생활', 'UAE 전역', '타인 촬영과 정부·군사·항공 시설 촬영은 법적 문제로 이어질 수 있습니다.', '사람을 찍기 전에 동의를 구하고 민감 시설은 촬영하지 마세요.', ['관광지', '거리·공공장소'], [advisory('united-arab-emirates')]),
      warning('united-arab-emirates-common-alcohol', '허가되지 않은 장소에서 음주하거나 만취 상태로 돌아다니지 마세요', '법률·안전', '높음', '주류 규정', 'UAE 전역', '음주 허용 범위는 에미리트와 장소에 따라 다르며 공공장소 만취는 문제가 될 수 있습니다.', '허가된 호텔·식당에서만 마시고 귀가 시 소란을 피하세요.', ['식당', '호텔', '거리·공공장소'], [advisory('united-arab-emirates')]),
    ],
  },
  {
    name: '스위스', slug: 'switzerland',
    cities: [
      { name: '취리히', slug: 'zurich' },
      { name: '루체른', slug: 'lucerne' },
      { name: '인터라켄', slug: 'interlaken' },
    ],
    warnings: [
      warning('switzerland-common-customs', '신고 대상 물품을 세관 신고 없이 반입하지 마세요', '입국·세관', '높음', '세관 규정', '스위스 전역', '식품·주류·담배·고가 물품에는 엄격한 면세·신고 기준이 적용됩니다.', '영수증을 보관하고 한도를 넘거나 확신이 없으면 신고하세요.', ['공항·세관'], [entry('switzerland')]),
      warning('switzerland-common-mountain-weather', '산악 날씨를 확인하지 않고 고지대 트레킹을 시작하지 마세요', '자연·야외', '매우 높음', '산악 안전', '스위스 산악지역', '고도와 날씨 변화가 빠르고 여름에도 저체온·낙뢰 위험이 있습니다.', '공식 일기예보와 산장·케이블카 공지를 확인하고 방수·보온 장비를 준비하세요.', ['국립공원', '산악', '야외'], [advisory('switzerland')]),
      warning('switzerland-common-pickpocket', '기차역과 관광열차에서 가방을 방치하지 마세요', '법률·안전', '높음', '도난 예방', '스위스 주요 도시·철도', '공항과 대형역, 국제열차에서 소매치기와 수하물 절도가 발생할 수 있습니다.', '가방을 시야 안에 두고 여권과 지갑을 분산 보관하세요.', ['기차역', '대중교통'], [advisory('switzerland')]),
      warning('switzerland-common-road-vignette', '고속도로 통행 스티커 없이 차량을 운전하지 마세요', '교통·운전', '높음', '도로 통행', '스위스 전역', '고속도로 이용 차량에는 비네트가 필요하며 렌터카에도 부착 여부를 확인해야 합니다.', '차량 인수 시 비네트와 겨울 장비, 국경 통행 조건을 확인하세요.', ['도로', '렌터카'], [advisory('switzerland')]),
      warning('switzerland-common-ski-offpiste', '표시된 슬로프 밖으로 장비 없이 나가지 마세요', '자연·야외', '매우 높음', '설산 안전', '스위스 스키지역', '오프피스트에는 눈사태·빙하 틈·구조 지연 위험이 있습니다.', '현지 가이드와 눈사태 장비 없이 비관리 구역에 진입하지 마세요.', ['스키장', '산악'], [advisory('switzerland')]),
    ],
  },
  {
    name: '오스트리아', slug: 'austria',
    cities: [
      { name: '빈', slug: 'vienna' },
      { name: '잘츠부르크', slug: 'salzburg' },
      { name: '인스브루크', slug: 'innsbruck' },
    ],
    warnings: [
      warning('austria-common-pickpocket', '도심·공원·대중교통에서 소지품을 의자 뒤에 두지 마세요', '법률·안전', '높음', '도난 예방', '오스트리아 주요 도시', '관광지와 교통 거점에서 주의 분산형 소매치기가 발생할 수 있습니다.', '가방은 몸 앞에 두고 휴대전화와 지갑을 테이블 위에 두지 마세요.', ['관광지', '대중교통'], [advisory('austria')]),
      warning('austria-common-nazi-symbols', '나치 경례·상징을 장난으로 사용하지 마세요', '법률·문화', '매우 높음', '금지 상징', '오스트리아 전역', '나치 상징과 선전 행위는 형사 문제로 이어질 수 있습니다.', '역사 장소에서도 관련 몸짓과 구호를 흉내 내지 마세요.', ['거리·공공장소', '박물관'], [advisory('austria')]),
      warning('austria-common-ticket-validation', '필요한 교통권 유효화 없이 탑승하지 마세요', '대중교통', '높음', '운임 규칙', '오스트리아 도시 교통', '개찰구가 없어도 검표가 이루어지며 표 종류에 따라 탑승 전 유효화가 필요합니다.', '앱·자동판매기 안내를 확인하고 검표 때까지 표를 보관하세요.', ['지하철', '대중교통'], [advisory('austria')]),
      warning('austria-common-alpine', '표시 등산로를 벗어나거나 폐쇄 구간에 들어가지 마세요', '자연·야외', '매우 높음', '산악 안전', '오스트리아 알프스', '급격한 날씨 변화와 낙석·눈사태 위험이 있습니다.', '지역 구조대·케이블카 공지와 난이도를 확인하고 적절한 장비를 사용하세요.', ['산악', '야외'], [advisory('austria')]),
      warning('austria-common-vignette', '비네트가 필요한 도로를 미부착 상태로 주행하지 마세요', '교통·운전', '높음', '도로 통행', '오스트리아 전역', '고속도로와 일부 도로는 비네트 또는 별도 통행료가 필요합니다.', '렌터카 인수 시 디지털·실물 비네트와 적용 도로를 확인하세요.', ['도로', '렌터카'], [advisory('austria')]),
    ],
  },
  {
    name: '체코', slug: 'czechia',
    cities: [
      { name: '프라하', slug: 'prague' },
      { name: '체스키크룸로프', slug: 'cesky-krumlov' },
      { name: '브르노', slug: 'brno' },
    ],
    warnings: [
      warning('czechia-common-ticket-validation', '프라하 대중교통 표를 유효화하지 않고 탑승하지 마세요', '대중교통', '높음', '운임 규칙', '체코 도시 교통', '종이표는 첫 탑승 전에 유효화가 필요할 수 있고 검표가 자주 이루어집니다.', '표 종류와 유효화 방식을 확인하고 검표 때까지 보관하세요.', ['지하철', '대중교통'], [advisory('czechia')]),
      warning('czechia-common-exchange', '거리 환전상이나 조건이 불명확한 환전소를 이용하지 마세요', '금융·결제', '높음', '환전 사기', '체코 주요 관광지', '비공식 환전과 불리한 수수료·환율 표시로 피해가 발생할 수 있습니다.', '은행·공식 ATM·명확한 환율표가 있는 환전소를 이용하세요.', ['관광지', '거리·공공장소'], [advisory('czechia')]),
      warning('czechia-common-drugs', '마약류를 소지·구매하지 마세요', '법률·안전', '매우 높음', '마약법', '체코 전역', '일부 소량 규정에 대한 인터넷 정보가 있어도 소지·판매·운반은 법적 문제로 이어질 수 있습니다.', '불법 약물과 성분 불명 제품을 피하세요.', ['거리·공공장소'], [advisory('czechia')]),
      warning('czechia-common-taxi', '길거리 호객 택시를 요금 확인 없이 이용하지 마세요', '교통·이동', '높음', '택시 사기', '프라하 등 관광도시', '관광객 대상 과다 요금과 우회 운행 피해가 발생할 수 있습니다.', '공식 호출 앱이나 숙소가 부른 차량을 이용하고 예상 요금을 확인하세요.', ['택시', '관광지'], [advisory('czechia')]),
      warning('czechia-common-night', '야간 도심에서 술에 취한 채 소지품을 방치하지 마세요', '법률·안전', '높음', '야간 범죄 예방', '체코 주요 도시', '유흥가와 혼잡한 장소에서 절도·사기 위험이 높아질 수 있습니다.', '동행과 이동하고 음료와 소지품을 시야 안에 두세요.', ['거리·공공장소', '식당'], [advisory('czechia')]),
    ],
  },
  {
    name: '헝가리', slug: 'hungary',
    cities: [
      { name: '부다페스트', slug: 'budapest' },
      { name: '세게드', slug: 'szeged' },
    ],
    warnings: [
      warning('hungary-common-ticket-validation', '대중교통 티켓을 유효화하지 않고 타지 마세요', '대중교통', '높음', '운임 규칙', '헝가리 도시 교통', '표를 구입했어도 노선·환승에 따라 유효화가 필요하며 검표가 자주 이루어집니다.', '앱 또는 단말기 안내를 확인하고 표를 보관하세요.', ['지하철', '대중교통'], [advisory('hungary')]),
      warning('hungary-common-taxi', '표시 없는 택시를 길에서 잡지 마세요', '교통·이동', '높음', '택시 사기', '부다페스트', '비공식 차량과 과다 요금 피해가 발생할 수 있습니다.', '공식 호출 앱과 등록 택시를 이용하세요.', ['택시', '관광지'], [advisory('hungary')]),
      warning('hungary-common-thermal-bath', '건강 상태 확인 없이 고온 온천에 오래 머물지 마세요', '건강·안전', '높음', '온천 이용', '헝가리 온천시설', '고온탕은 심혈관 질환·임신·음주 상태에서 위험할 수 있습니다.', '시설 안내와 체류 시간을 지키고 음주 후 입욕하지 마세요.', ['온천', '시설'], [advisory('hungary')]),
      warning('hungary-common-demonstrations', '시위·정치 집회 주변에 머물지 마세요', '법률·안전', '보통', '집회 안전', '헝가리 주요 도시', '집회는 갑자기 교통 통제와 경찰 대응으로 이어질 수 있습니다.', '현지 뉴스와 교통 안내를 확인하고 집회 장소를 우회하세요.', ['거리·공공장소'], [advisory('hungary')]),
      warning('hungary-common-drink-driving', '술을 한 잔이라도 마신 뒤 운전하지 마세요', '교통·운전', '매우 높음', '음주운전', '헝가리 전역', '음주운전 허용 기준이 매우 엄격하고 단속 시 처벌될 수 있습니다.', '대중교통·택시·대리 이동을 이용하세요.', ['도로', '렌터카'], [advisory('hungary')]),
    ],
  },
  {
    name: '그리스', slug: 'greece',
    cities: [
      { name: '아테네', slug: 'athens' },
      { name: '산토리니', slug: 'santorini' },
      { name: '테살로니키', slug: 'thessaloniki' },
    ],
    warnings: [
      warning('greece-common-antiquities', '돌·도자기·유물로 보이는 물건을 가져가지 마세요', '법률·문화', '매우 높음', '문화재 보호', '그리스 전역', '고고학 유물의 소지·반출은 엄격히 제한되며 출처가 불명확한 골동품 구매도 위험합니다.', '공식 상점의 영수증이 있는 기념품만 구매하세요.', ['유적지', '관광지'], [advisory('greece')]),
      warning('greece-common-drone', '유적지와 군사시설 주변에서 허가 없이 드론을 띄우지 마세요', '촬영·드론', '높음', '항공·문화재 규정', '그리스 전역', '유적지·공항·군사시설 주변 드론 비행에는 제한과 허가가 적용될 수 있습니다.', '민항당국 지도와 유적지 촬영 규정을 확인하세요.', ['유적지', '야외'], [advisory('greece')]),
      warning('greece-common-road', '섬 지역에서 헬멧 없이 ATV·스쿠터를 타지 마세요', '교통·운전', '매우 높음', '도로 안전', '그리스 섬 지역', '관광객의 이륜차·ATV 사고가 빈번하고 도로 상태와 운전 습관이 익숙하지 않을 수 있습니다.', '면허·보험·헬멧을 확인하고 야간·음주 운전을 피하세요.', ['도로', '렌터카'], [advisory('greece')]),
      warning('greece-common-wildfire', '산불 위험일에 폐쇄 지역과 화기 금지 지침을 무시하지 마세요', '자연·야외', '매우 높음', '산불 안전', '그리스 전역', '여름철 산불로 대피·도로 폐쇄가 갑자기 시행될 수 있습니다.', '112 경보와 지역 당국·숙소 안내를 확인하세요.', ['야외', '섬', '산악'], [advisory('greece')]),
      warning('greece-common-protests', '아테네 중심의 시위 현장에 가까이 가지 마세요', '법률·안전', '높음', '집회 안전', '아테네 등 주요 도시', '시위가 교통 중단과 충돌로 이어질 수 있습니다.', '의회·대학·대사관 주변 집회를 우회하고 교통 변경을 확인하세요.', ['거리·공공장소'], [advisory('greece')]),
    ],
  },
  {
    name: '튀르키예', slug: 'turkey',
    cities: [
      { name: '이스탄불', slug: 'istanbul' },
      { name: '카파도키아', slug: 'cappadocia' },
      { name: '안탈리아', slug: 'antalya' },
    ],
    warnings: [
      warning('turkey-common-id', '여권이나 공식 신분증 없이 이동하지 마세요', '입국·행정', '높음', '신분 확인', '튀르키예 전역', '경찰이 신분 확인을 요구할 수 있고 일부 지역·숙박시설에서 원본 확인이 필요합니다.', '여권을 안전하게 소지하고 사본을 별도 보관하세요.', ['거리·공공장소', '호텔'], [advisory('turkey')]),
      warning('turkey-common-drugs', '마약류를 소지·운반하지 마세요', '법률·안전', '매우 높음', '마약법', '튀르키예 전역', '마약 범죄는 매우 무겁게 처벌될 수 있습니다.', '성분 불명 제품과 타인의 짐을 운반하지 마세요.', ['공항·세관', '거리·공공장소'], [advisory('turkey')]),
      warning('turkey-common-military-photo', '군사시설·검문소·경찰을 허가 없이 촬영하지 마세요', '촬영·드론', '매우 높음', '촬영 제한', '튀르키예 전역', '보안 시설과 인력 촬영은 조사·압수·구금으로 이어질 수 있습니다.', '촬영 금지 표지와 현장 지시에 따르세요.', ['거리·공공장소'], [advisory('turkey')]),
      warning('turkey-common-antiquities', '유물·고대 동전·돌을 출처 증빙 없이 구매하거나 반출하지 마세요', '법률·문화', '매우 높음', '문화재 보호', '튀르키예 전역', '문화재 반출 규정이 엄격하고 관광객이 기념품으로 산 물건도 문제가 될 수 있습니다.', '공식 상점과 영수증이 있는 현대 기념품만 구매하세요.', ['유적지', '시장'], [advisory('turkey')]),
      warning('turkey-common-demonstrations', '정치 집회와 대규모 군중을 촬영하며 머물지 마세요', '법률·안전', '높음', '집회·촬영 안전', '튀르키예 주요 도시', '집회가 급격히 통제되고 외국인의 촬영·게시가 주목받을 수 있습니다.', '집회 장소를 피하고 현지 당국 지시에 따르세요.', ['거리·공공장소'], [advisory('turkey')]),
    ],
  },
  {
    name: '멕시코', slug: 'mexico',
    cities: [
      { name: '멕시코시티', slug: 'mexico-city' },
      { name: '칸쿤', slug: 'cancun' },
      { name: '로스카보스', slug: 'los-cabos' },
    ],
    warnings: [
      warning('mexico-common-drugs', '마약류를 구매·소지·운반하지 마세요', '법률·안전', '매우 높음', '마약·조직범죄', '멕시코 전역', '마약 관련 활동은 체포뿐 아니라 조직범죄 노출 위험을 크게 높입니다.', '불법 약물과 성분 불명 제품을 피하고 타인의 짐을 맡지 마세요.', ['거리·공공장소'], [advisory('mexico')]),
      warning('mexico-common-taxi', '공항·관광지에서 비공식 택시를 이용하지 마세요', '교통·이동', '높음', '택시 안전', '멕시코 주요 공항·관광지', '비공식 차량과 강도·과다요금 피해가 보고될 수 있습니다.', '공항 공식 창구, 숙소 호출, 검증된 앱을 이용하세요.', ['공항·세관', '택시'], [advisory('mexico')]),
      warning('mexico-common-road-night', '도시간 도로를 밤에 운전하지 마세요', '교통·운전', '매우 높음', '도로 안전', '멕시코 도시간 도로', '야간에는 범죄·가축·노면 상태·조명 부족 위험이 커질 수 있습니다.', '유료 고속도로를 낮에 이용하고 장거리 이동은 검증된 교통편을 선택하세요.', ['도로', '렌터카'], [advisory('mexico')]),
      warning('mexico-common-cenote', '안전요원 없는 세노테에서 단독으로 다이빙하지 마세요', '자연·야외', '매우 높음', '수상 안전', '유카탄반도 세노테', '수심·동굴 구조·수온·시야가 예상과 다를 수 있습니다.', '구명조끼와 공인 가이드를 이용하고 금지 구역에 들어가지 마세요.', ['세노테', '야외'], [advisory('mexico')]),
      warning('mexico-common-protests', '도로 봉쇄와 시위대를 촬영하며 가까이 머물지 마세요', '법률·안전', '높음', '집회 안전', '멕시코 주요 도시·도로', '시위와 도로 봉쇄가 장시간 교통 중단과 충돌로 이어질 수 있습니다.', '대체 경로를 확인하고 현지 당국·숙소 지시에 따르세요.', ['거리·공공장소', '도로'], [advisory('mexico')]),
    ],
  },
  {
    name: '몰디브', slug: 'maldives',
    cities: [
      { name: '말레', slug: 'male' },
      { name: '마푸시', slug: 'maafushi' },
    ],
    warnings: [
      warning('maldives-common-alcohol-local-island', '현지인 거주 섬에 술을 가져가거나 마시지 마세요', '법률·문화', '매우 높음', '주류 규정', '몰디브 현지인 거주 섬', '주류는 허가된 리조트 등 제한된 장소에서만 허용될 수 있습니다.', '숙소가 허가된 리조트인지 확인하고 현지인 섬에서는 주류를 소지하지 마세요.', ['섬', '호텔', '거리·공공장소'], [advisory('maldives')]),
      warning('maldives-common-drugs', '마약류와 CBD 제품을 반입하지 마세요', '법률·안전', '매우 높음', '마약법', '몰디브 전역', '마약 범죄는 무겁게 처벌될 수 있습니다.', '성분이 불분명한 제품과 타인의 짐을 운반하지 마세요.', ['공항·세관'], [advisory('maldives')]),
      warning('maldives-common-coral', '산호·조개·모래를 채취하거나 반출하지 마세요', '자연·환경', '높음', '환경 보호', '몰디브 해양지역', '산호와 해양생물 채취는 생태계 훼손과 반출 규정 위반이 될 수 있습니다.', '사진만 남기고 자연물은 현장에 두세요.', ['해변', '바다', '섬'], [advisory('maldives')]),
      warning('maldives-common-dress-local-island', '현지인 섬의 공공장소에서 수영복 차림으로 다니지 마세요', '종교·문화', '보통', '복장 예절', '몰디브 현지인 거주 섬', '리조트와 달리 현지인 섬은 이슬람 관습과 복장 기대가 적용됩니다.', '비키니 비치 외에는 어깨와 허벅지를 가리는 옷을 입으세요.', ['해변', '거리·공공장소'], [advisory('maldives')]),
      warning('maldives-common-sea-current', '리조트 앞바다라고 안전요원 확인 없이 멀리 수영하지 마세요', '자연·야외', '매우 높음', '해양 안전', '몰디브 전역', '강한 조류와 깊은 수심, 보트 통행 위험이 있을 수 있습니다.', '구명장비를 사용하고 숙소의 조류·출입 가능 구역 안내를 따르세요.', ['해변', '바다'], [advisory('maldives')]),
    ],
  },
  {
    name: '크로아티아', slug: 'croatia',
    cities: [
      { name: '자그레브', slug: 'zagreb' },
      { name: '두브로브니크', slug: 'dubrovnik' },
      { name: '스플리트', slug: 'split' },
    ],
    warnings: [
      warning('croatia-common-id', '공식 신분증 없이 이동하지 마세요', '입국·행정', '보통', '신분 확인', '크로아티아 전역', '경찰이 신분 확인을 요구할 수 있고 숙박 등록에도 여권이 필요합니다.', '여권을 안전하게 소지하고 사본을 별도 보관하세요.', ['호텔', '거리·공공장소'], [advisory('croatia')]),
      warning('croatia-common-drone', '구시가지·국립공원에서 허가 없이 드론을 띄우지 마세요', '촬영·드론', '높음', '항공·보호구역 규정', '크로아티아 전역', '도심·공항·문화유산·보호구역에는 별도 비행·촬영 제한이 적용될 수 있습니다.', '민항당국 지도와 장소별 허가 조건을 확인하세요.', ['관광지', '국립공원'], [advisory('croatia')]),
      warning('croatia-common-wildfire', '산불 위험 기간에 야외 화기와 담배꽁초를 방치하지 마세요', '자연·야외', '매우 높음', '산불 안전', '크로아티아 해안·섬 지역', '여름철 건조한 날씨에 작은 불씨도 대형 산불로 번질 수 있습니다.', '화기 금지 표지와 대피 안내를 따르고 담배꽁초를 완전히 처리하세요.', ['야외', '섬', '국립공원'], [advisory('croatia')]),
      warning('croatia-common-cliff-swim', '바위 해변에서 수심 확인 없이 뛰어들지 마세요', '자연·야외', '매우 높음', '수상 안전', '크로아티아 해안', '얕은 수심·수중 암석·파도와 보트 통행으로 중상 위험이 있습니다.', '지정 수영 구역과 안전한 진입로를 이용하세요.', ['해변', '바다'], [advisory('croatia')]),
      warning('croatia-common-old-town-noise', '구시가지 주거 골목에서 밤늦게 소란을 피우지 마세요', '문화·예절', '보통', '주거지역 질서', '두브로브니크·스플리트 구시가지', '관광지 안에도 실제 주민이 거주하며 야간 소음 규제와 숙소 규칙이 적용될 수 있습니다.', '숙소 정숙 시간을 지키고 야간 이동 시 목소리와 음악을 줄이세요.', ['거리·공공장소', '호텔'], [advisory('croatia')]),
    ],
  },
];
