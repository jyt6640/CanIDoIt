const checkedAt = '2026-07-20';
const source = (title, url) => ({ title, url, checkedAt });

export const OFFICIAL_EXPANSION = [
  {
    name: '호주', slug: 'australia',
    cities: [{ name: '시드니', slug: 'sydney' }, { name: '멜버른', slug: 'melbourne' }, { name: '브리즈번', slug: 'brisbane' }],
    warnings: [
      { key: 'australia-common-declare-food', title: '식품·식물·동물성 제품을 신고 없이 반입하지 마세요', category: '입국·세관', risk: '매우 높음', type: '검역 규정', range: '호주 전역', reason: '호주는 생물보안 규정이 엄격해 식품, 씨앗, 식물, 동물성 제품을 신고하지 않으면 벌금이나 압수 조치를 받을 수 있습니다.', alternative: '조금이라도 해당할 가능성이 있으면 입국 신고서에 표시하고 검사관에게 보여주세요.', diffFromKorea: '포장 식품이라도 원재료에 따라 신고 대상이 될 수 있습니다.', locations: ['공항·세관'], sources: [source('Australian Border Force - Can you bring it in?', 'https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in/list-of-items')] },
      { key: 'australia-common-medicine', title: '처방약을 원래 포장과 처방 증빙 없이 가져가지 마세요', category: '건강·의약품', risk: '높음', type: '의약품 반입', range: '호주 전역', reason: '일부 의약품과 성분은 허가나 신고가 필요하며 수량 제한이 적용될 수 있습니다.', alternative: '영문 처방전과 원래 포장을 준비하고 반입 가능 여부를 사전에 확인하세요.', locations: ['공항·세관'], sources: [source('Australian Border Force - Medicines', 'https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in/categories/medicines-and-substances')] },
      { key: 'australia-common-airport-jokes', title: '공항 보안검색에서 폭발물이나 무기 농담을 하지 마세요', category: '법률·안전', risk: '높음', type: '공항 보안', range: '호주 공항', reason: '공항 보안기관은 폭발물·무기 관련 발언을 심각한 위협으로 취급할 수 있습니다.', alternative: '검색 요원의 지시에 차분히 따르고 수하물을 방치하지 마세요.', locations: ['공항·세관'], sources: [source('Australian Home Affairs - TravelSECURE', 'https://www.homeaffairs.gov.au/about-us/what-we-do/travelsecure')] },
      { key: 'australia-common-bushfire', title: '산불 위험일에 공원 출입 통제와 화기 금지 안내를 무시하지 마세요', category: '자연·야외', risk: '매우 높음', type: '화재 안전', range: '호주 전역', reason: '고온·건조한 날에는 총화기금지와 공원 폐쇄가 시행될 수 있습니다.', alternative: '주정부 화재 위험 등급과 공원 공지를 당일 확인하세요.', locations: ['국립공원', '야외'], sources: [source('Australian Government - Prepare for bushfires', 'https://www.australia.gov.au/bushfire-preparation-and-recovery')] },
      { key: 'australia-common-drone', title: '사람 위나 제한 공역에서 드론을 날리지 마세요', category: '촬영·드론', risk: '높음', type: '항공 규정', range: '호주 전역', reason: '드론은 사람, 공항, 비상현장 주변에서 거리와 고도 제한을 지켜야 합니다.', alternative: '비행 전 CASA OpenSky 등 공식 도구로 허용 구역을 확인하세요.', locations: ['야외', '관광지'], sources: [source('CASA - Drone rules', 'https://www.casa.gov.au/knowyourdrone/drone-rules')] },
    ],
  },
  {
    name: '뉴질랜드', slug: 'new-zealand',
    cities: [{ name: '오클랜드', slug: 'auckland' }, { name: '퀸스타운', slug: 'queenstown' }, { name: '웰링턴', slug: 'wellington' }],
    warnings: [
      { key: 'new-zealand-common-risk-items', title: '식품·캠핑장비·흙 묻은 신발을 신고 없이 가져가지 마세요', category: '입국·세관', risk: '매우 높음', type: '생물보안', range: '뉴질랜드 전역', reason: '식품, 식물, 동물성 제품과 야외 장비는 생물보안 위험 물품으로 신고 대상입니다.', alternative: '확신이 없으면 반드시 신고하거나 공항의 폐기함에 버리세요.', locations: ['공항·세관'], sources: [source('New Zealand Customs - Food and other risk items', 'https://www.customs.govt.nz/travel-to-and-from-new-zealand/prohibited-and-restricted-items/food-and-other-risk-items')] },
      { key: 'new-zealand-common-prohibited-items', title: '후추 스프레이·자동개폐식 칼·마약 흡입 도구를 반입하지 마세요', category: '법률·안전', risk: '매우 높음', type: '금지 물품', range: '뉴질랜드 전역', reason: '일부 무기와 마약 관련 도구는 반입이 금지되거나 허가가 필요합니다.', alternative: '출국 전에 뉴질랜드 세관 금지·제한 물품 목록을 확인하세요.', locations: ['공항·세관'], sources: [source('New Zealand Customs - Prohibited and restricted items', 'https://www.customs.govt.nz/travel-to-and-from-new-zealand/prohibited-and-restricted-items')] },
      { key: 'new-zealand-common-duty-free', title: '면세 한도를 넘는 물품을 신고하지 않고 입국하지 마세요', category: '입국·세관', risk: '높음', type: '면세 규정', range: '뉴질랜드 전역', reason: '해외 구매 물품이 개인 면세 한도를 넘으면 세금과 신고 의무가 발생할 수 있습니다.', alternative: '영수증을 보관하고 한도를 넘으면 신고하세요.', locations: ['공항·세관'], sources: [source('New Zealand Customs - Duty-free shopping', 'https://www.customs.govt.nz/travel-to-and-from-new-zealand/duty-free-shopping')] },
      { key: 'new-zealand-common-freedom-camping', title: '허용되지 않은 곳에서 자유 캠핑하거나 차량 숙박하지 마세요', category: '숙박·캠핑', risk: '높음', type: '지역 규정', range: '뉴질랜드 전역', reason: '자유 캠핑은 지방정부 규정과 차량 인증 조건을 따라야 하며 금지 구역 위반 시 벌금이 부과될 수 있습니다.', alternative: '공식 캠핑장이나 허용 구역을 이용하세요.', locations: ['야외', '캠핑장'], sources: [source('New Zealand Government - Freedom camping', 'https://www.govt.nz/browse/recreation-and-the-environment/freedom-camping/')] },
      { key: 'new-zealand-common-drone', title: '보호지역에서 허가 없이 드론을 날리지 마세요', category: '촬영·드론', risk: '높음', type: '보호지역 규정', range: '보전부 관리 지역', reason: '국립공원과 보전지역의 드론 비행은 야생동물과 방문객 보호를 위해 허가가 필요할 수 있습니다.', alternative: 'DOC 허가와 민간항공 규정을 모두 확인하세요.', locations: ['국립공원', '야외'], sources: [source('Department of Conservation - Drones on conservation land', 'https://www.doc.govt.nz/get-involved/apply-for-permits/drone-use-on-conservation-land/')] },
    ],
  },
  {
    name: '캐나다', slug: 'canada',
    cities: [{ name: '밴쿠버', slug: 'vancouver' }, { name: '토론토', slug: 'toronto' }, { name: '몬트리올', slug: 'montreal' }],
    warnings: [
      { key: 'canada-common-declare-food', title: '식품·식물·동물성 제품을 신고하지 않고 입국하지 마세요', category: '입국·세관', risk: '매우 높음', type: '검역 규정', range: '캐나다 전역', reason: '관련 물품은 질병과 외래종 유입 방지를 위해 모두 신고해야 합니다.', alternative: '포장 식품도 포함해 세관 신고서에 정확히 기재하세요.', locations: ['공항·세관'], sources: [source('CBSA - Restricted and prohibited goods', 'https://www.cbsa-asfc.gc.ca/travel-voyage/rpg-mrp-eng.html')] },
      { key: 'canada-common-cash', title: '1만 캐나다달러 상당 이상의 현금을 신고 없이 반입·반출하지 마세요', category: '입국·세관', risk: '높음', type: '통화 신고', range: '캐나다 전역', reason: '현금과 금융상품 합계가 기준을 넘으면 국경에서 신고해야 합니다.', alternative: '기준 이상이면 세관 신고서와 담당관에게 알리세요.', locations: ['공항·세관'], sources: [source('Government of Canada - Border crossing declaration', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/border-crossing.html')] },
      { key: 'canada-common-cannabis-border', title: '합법 지역이라도 대마를 국경 밖으로 가져가지 마세요', category: '법률·안전', risk: '매우 높음', type: '마약 규정', range: '캐나다 국경', reason: '캐나다 내 일부 합법성과 별개로 대마의 국경 반입·반출은 불법입니다.', alternative: '대마 제품은 어떤 형태든 국경을 넘기지 마세요.', locations: ['공항·세관'], sources: [source('Government of Canada - Cannabis and the border', 'https://www.canada.ca/en/services/health/campaigns/cannabis/border.html')] },
      { key: 'canada-common-parks-wildlife', title: '국립공원 야생동물에게 먹이를 주거나 가까이 접근하지 마세요', category: '자연·야외', risk: '높음', type: '국립공원 규칙', range: '캐나다 국립공원', reason: '야생동물 먹이 주기와 접근은 사람과 동물 모두를 위험하게 하고 처벌 대상이 될 수 있습니다.', alternative: '안전거리를 유지하고 음식과 쓰레기를 밀폐하세요.', locations: ['국립공원', '야외'], sources: [source('Parks Canada - Wildlife safety', 'https://parks.canada.ca/voyage-travel/conseils-tips/faune-wildlife')] },
      { key: 'canada-common-drone-parks', title: '국립공원에서 허가 없이 드론을 띄우지 마세요', category: '촬영·드론', risk: '높음', type: '국립공원 규칙', range: '캐나다 국립공원', reason: 'Parks Canada 관리 지역에서는 허가 없는 드론 이착륙과 운용이 제한됩니다.', alternative: '공원 밖 허용 구역과 Transport Canada 규정을 확인하세요.', locations: ['국립공원', '야외'], sources: [source('Parks Canada - Drones', 'https://parks.canada.ca/voyage-travel/regles-rules/drones')] },
    ],
  },
  {
    name: '영국', slug: 'united-kingdom',
    cities: [{ name: '런던', slug: 'london' }, { name: '에든버러', slug: 'edinburgh' }, { name: '맨체스터', slug: 'manchester' }],
    warnings: [
      { key: 'united-kingdom-common-restricted-goods', title: '금지·제한 물품을 허가 없이 반입하지 마세요', category: '입국·세관', risk: '매우 높음', type: '세관 규정', range: '영국 전역', reason: '무기, 일부 식품·식물, 위조품 등은 금지되거나 제한됩니다.', alternative: '출발 전 영국 정부의 금지·제한 물품 목록을 확인하세요.', locations: ['공항·세관'], sources: [source('GOV.UK - Banned and restricted goods', 'https://www.gov.uk/bringing-goods-into-uk-personal-use/banned-and-restricted-goods')] },
      { key: 'united-kingdom-london-contactless', title: '런던 교통에서 입장과 퇴장에 서로 다른 카드를 사용하지 마세요', category: '대중교통', risk: '높음', type: '운임 규칙', range: '런던', city: 'london', reason: '입장과 퇴장 기록이 연결되지 않으면 최대 운임이 각각 부과될 수 있습니다.', alternative: '같은 Oyster 카드나 같은 비접촉 결제 수단을 사용하세요.', locations: ['지하철', '대중교통'], sources: [source('Transport for London - Touching in and out', 'https://tfl.gov.uk/fares/how-to-pay-and-where-to-buy-tickets-and-oyster/pay-as-you-go/touching-in-and-out')] },
      { key: 'united-kingdom-common-smoking', title: '실내 공공장소와 대중교통에서 흡연하지 마세요', category: '법률·안전', risk: '높음', type: '금연 규정', range: '영국 전역', reason: '대부분의 밀폐된 공공장소와 직장, 대중교통은 금연 구역입니다.', alternative: '건물 밖 지정 흡연 구역을 확인하세요.', locations: ['실내', '대중교통'], sources: [source('GOV.UK - Smoking at work', 'https://www.gov.uk/smoking-at-work-the-law')] },
      { key: 'united-kingdom-common-drone', title: '등록·비행 제한을 확인하지 않고 드론을 날리지 마세요', category: '촬영·드론', risk: '높음', type: '항공 규정', range: '영국 전역', reason: '드론 무게와 카메라 탑재 여부에 따라 등록과 시험이 필요하며 공항 주변 비행은 제한됩니다.', alternative: 'CAA Drone Code와 비행 제한 지도를 확인하세요.', locations: ['야외', '관광지'], sources: [source('UK Civil Aviation Authority - Drone Code', 'https://register-drones.caa.co.uk/drone-code')] },
      { key: 'united-kingdom-common-alcohol', title: '지정된 공공장소의 음주 제한 표지판을 무시하지 마세요', category: '거리·공공장소', risk: '보통', type: '지역 조례', range: '영국 일부 지역', reason: '지방정부는 특정 구역에서 경찰이 음주 중단과 주류 압수를 요구할 수 있도록 지정할 수 있습니다.', alternative: '공공장소 보호명령 표지판과 현장 지시에 따르세요.', locations: ['거리·공공장소'], sources: [source('GOV.UK - Alcohol and young people / public drinking', 'https://www.gov.uk/alcohol-young-people-law')] },
    ],
  },
  {
    name: '스페인', slug: 'spain',
    cities: [{ name: '바르셀로나', slug: 'barcelona' }, { name: '마드리드', slug: 'madrid' }, { name: '세비야', slug: 'seville' }],
    warnings: [
      { key: 'spain-common-id', title: '여권이나 공식 신분증 없이 이동하지 마세요', category: '법률·안전', risk: '높음', type: '신분 확인', range: '스페인 전역', reason: '경찰이 신원 확인을 요구할 수 있으며 사진이나 사본만으로 충분하지 않을 수 있습니다.', alternative: '여권을 안전하게 소지하고 별도 사본도 보관하세요.', locations: ['거리·공공장소'], sources: [source('Spain travel advice - Local laws', 'https://www.gov.uk/foreign-travel-advice/spain/safety-and-security')] },
      { key: 'spain-common-drink-driving', title: '소량의 음주 후에도 운전하지 마세요', category: '교통·운전', risk: '매우 높음', type: '도로교통법', range: '스페인 전역', reason: '음주운전 단속이 자주 실시되고 벌금, 면허 정지, 형사처벌이 가능할 수 있습니다.', alternative: '대중교통이나 공식 택시를 이용하세요.', locations: ['도로', '렌터카'], sources: [source('Spain travel advice - Driving regulations', 'https://www.gov.uk/foreign-travel-advice/spain/safety-and-security')] },
      { key: 'spain-common-beach-flags', title: '해변의 적색 깃발과 구조요원 통제를 무시하지 마세요', category: '자연·야외', risk: '매우 높음', type: '해변 안전', range: '스페인 해변', reason: '적색 깃발은 입수 금지를 의미하며 강한 이안류와 높은 파도가 있을 수 있습니다.', alternative: '구조요원이 있는 구역에서 깃발 지시에 따르세요.', locations: ['해변'], sources: [source('Spain official tourism - Beach safety', 'https://www.spain.info/en/travel-tips/safety/')] },
      { key: 'spain-common-balcony', title: '호텔 발코니 난간에 오르거나 뛰어내리지 마세요', category: '숙박·안전', risk: '매우 높음', type: '안전 수칙', range: '스페인 숙박시설', reason: '관광지에서 발코니 추락 사고가 반복되며 중상과 사망 위험이 큽니다.', alternative: '난간에 기대거나 객실 사이를 이동하지 마세요.', locations: ['호텔'], sources: [source('Spain travel advice - Balcony falls', 'https://www.gov.uk/foreign-travel-advice/spain/safety-and-security')] },
      { key: 'spain-barcelona-pickpocket', title: '바르셀로나 관광지와 지하철에서 가방을 등 뒤로 메지 마세요', category: '법률·안전', risk: '높음', type: '범죄 예방', range: '바르셀로나', city: 'barcelona', reason: '혼잡한 관광지와 대중교통에서 소매치기와 주의 분산형 절도가 빈번합니다.', alternative: '가방은 몸 앞에 두고 휴대전화와 지갑을 테이블 위에 두지 마세요.', locations: ['지하철', '관광지'], sources: [source('Barcelona City Council - Safety advice', 'https://www.barcelona.cat/internationalwelcome/en/useful-information/safety-and-security')] },
    ],
  },
  {
    name: '독일', slug: 'germany',
    cities: [{ name: '베를린', slug: 'berlin' }, { name: '뮌헨', slug: 'munich' }, { name: '프랑크푸르트', slug: 'frankfurt' }],
    warnings: [
      { key: 'germany-common-cash', title: '1만 유로 이상의 현금을 신고 없이 반입·반출하지 마세요', category: '입국·세관', risk: '높음', type: '현금 신고', range: '독일·EU 국경', reason: 'EU 외부 국경을 넘을 때 기준 이상의 현금은 신고 의무가 있습니다.', alternative: '독일 세관 신고 절차를 미리 확인하세요.', locations: ['공항·세관'], sources: [source('German Customs - Cash', 'https://www.zoll.de/EN/Private-individuals/Travel/Entering-Germany/Restrictions/Cash/cash_node.html')] },
      { key: 'germany-common-ticket', title: '필요한 티켓을 구매·유효화하지 않고 대중교통에 타지 마세요', category: '대중교통', risk: '높음', type: '운임 규칙', range: '독일 전역', reason: '개찰구가 없는 역도 검표가 이루어지며 유효한 승차권이 없으면 추가 운임이 부과됩니다.', alternative: '앱이나 자동판매기에서 구간에 맞는 표를 사고 필요한 경우 탑승 전 유효화하세요.', locations: ['지하철', '대중교통'], sources: [source('Berlin public transport - Tickets and validation', 'https://www.bvg.de/en/subscriptions-and-tickets/all-tickets')] },
      { key: 'germany-common-bike-lanes', title: '보행 중 자전거 전용도로를 막지 마세요', category: '교통·보행', risk: '보통', type: '도로 이용', range: '독일 전역', reason: '자전거 전용도로는 통행 속도가 빠르고 충돌 위험이 있습니다.', alternative: '색상과 표지로 구분된 자전거도로 밖 인도를 이용하세요.', locations: ['거리·공공장소'], sources: [source('Germany travel information - Road safety', 'https://www.germany.travel/en/information-on-germany/mobility.html')] },
      { key: 'germany-common-nazi-symbols', title: '나치 상징이나 구호를 장난으로 사용하지 마세요', category: '법률·문화', risk: '매우 높음', type: '형법', range: '독일 전역', reason: '헌법에 반하는 단체의 상징과 특정 경례·구호 사용은 예술·교육 등 제한된 예외 외에는 처벌될 수 있습니다.', alternative: '역사적 장소에서 관련 상징과 몸짓을 흉내 내지 마세요.', locations: ['거리·공공장소', '박물관'], sources: [source('German Criminal Code Section 86a', 'https://www.gesetze-im-internet.de/englisch_stgb/englisch_stgb.html#p0920')] },
      { key: 'germany-common-drone', title: '공항·주거지·보호구역에서 규정 확인 없이 드론을 날리지 마세요', category: '촬영·드론', risk: '높음', type: '항공 규정', range: '독일 전역', reason: '드론 등록, 고도, 거리, 사생활 보호 규정이 적용됩니다.', alternative: '독일 항공당국과 지리구역 지도를 확인하세요.', locations: ['야외', '관광지'], sources: [source('German Federal Aviation Authority - Drones', 'https://www.lba.de/EN/Drone/UAS_node.html')] },
    ],
  },
  {
    name: '인도네시아', slug: 'indonesia',
    cities: [{ name: '발리', slug: 'bali' }, { name: '자카르타', slug: 'jakarta' }, { name: '욕야카르타', slug: 'yogyakarta' }],
    warnings: [
      { key: 'indonesia-common-drugs', title: '대마를 포함한 마약류를 소지·반입하지 마세요', category: '법률·안전', risk: '매우 높음', type: '마약법', range: '인도네시아 전역', reason: '마약 범죄는 극히 무거운 형사처벌 대상이며 외국인도 예외가 아닙니다.', alternative: '성분이 불분명한 제품과 타인의 짐을 운반하지 마세요.', locations: ['공항·세관', '거리·공공장소'], sources: [source('Indonesia travel advice - Local laws', 'https://www.gov.uk/foreign-travel-advice/indonesia/safety-and-security')] },
      { key: 'indonesia-common-medicine', title: '일부 처방약을 증빙 없이 반입하지 마세요', category: '건강·의약품', risk: '매우 높음', type: '의약품 반입', range: '인도네시아 전역', reason: '한국에서 처방 가능한 성분도 인도네시아에서는 통제약물로 분류될 수 있습니다.', alternative: '영문 처방전과 의사 소견서를 준비하고 대사관·세관에 사전 확인하세요.', locations: ['공항·세관'], sources: [source('Indonesia travel advice - Medication', 'https://www.gov.uk/foreign-travel-advice/indonesia/health')] },
      { key: 'indonesia-bali-temple', title: '발리 사원에서 노출이 심한 복장으로 입장하지 마세요', category: '종교·문화', risk: '높음', type: '종교시설 규칙', range: '발리', city: 'bali', reason: '사원은 예배 공간이며 복장과 행동 규칙을 지켜야 합니다.', alternative: '어깨와 무릎을 가리고 사롱 착용 안내를 따르세요.', locations: ['사찰·신사', '관광지'], sources: [source('Bali Provincial Government - Tourist do and donts', 'https://lovebali.baliprov.go.id/article/detail/1687894488949/bali-tourist-dos-and-donts')] },
      { key: 'indonesia-bali-sacred-sites', title: '신성한 장소와 제물 위에 올라서거나 훼손하지 마세요', category: '종교·문화', risk: '높음', type: '문화 규칙', range: '발리', city: 'bali', reason: '길과 사원 주변의 제물과 신성한 구조물은 종교적 의미가 큽니다.', alternative: '제물은 밟지 말고 촬영 제한과 현장 안내를 따르세요.', locations: ['사찰·신사', '거리·공공장소'], sources: [source('Bali Provincial Government - Tourist do and donts', 'https://lovebali.baliprov.go.id/article/detail/1687894488949/bali-tourist-dos-and-donts')] },
      { key: 'indonesia-bali-levy', title: '발리 관광세 납부 확인 없이 입도하지 마세요', category: '입국·행정', risk: '보통', type: '관광세', range: '발리', city: 'bali', reason: '외국인 관광객에게 발리 관광세가 적용되며 납부 확인을 요구받을 수 있습니다.', alternative: '공식 Love Bali 시스템으로 납부하고 QR 영수증을 보관하세요.', locations: ['공항·세관'], sources: [source('Love Bali - Tourist levy', 'https://lovebali.baliprov.go.id/')] },
    ],
  },
  {
    name: '홍콩', slug: 'hong-kong',
    cities: [{ name: '홍콩', slug: 'hong-kong' }],
    warnings: [
      { key: 'hong-kong-common-cbd', title: 'CBD 제품을 소지하거나 반입하지 마세요', category: '법률·안전', risk: '매우 높음', type: '위험약물 규정', range: '홍콩 전역', reason: 'CBD는 홍콩에서 위험약물로 분류되어 소지와 반입이 형사처벌 대상이 될 수 있습니다.', alternative: '오일, 화장품, 식품 등 CBD 표기가 있는 제품을 가져가지 마세요.', locations: ['공항·세관'], sources: [source('Hong Kong Customs - Cannabidiol', 'https://www.customs.gov.hk/en/service-enforcement-information/trade-facilitation/prohibited-articles/cbd/index.html')] },
      { key: 'hong-kong-common-vaping', title: '전자담배·가열담배 제품을 반입하지 마세요', category: '법률·안전', risk: '매우 높음', type: '수입 금지', range: '홍콩 전역', reason: '대체 흡연 제품의 수입과 상업적 소지는 금지될 수 있습니다.', alternative: '기기, 액상, 카트리지를 여행 짐에 넣지 마세요.', locations: ['공항·세관'], sources: [source('Hong Kong Tobacco and Alcohol Control Office - Alternative smoking products', 'https://www.taco.gov.hk/t/english/legislation/legislation_asp.html')] },
      { key: 'hong-kong-common-mtr-food', title: 'MTR 유료 구역에서 음식이나 음료를 섭취하지 마세요', category: '대중교통', risk: '높음', type: '철도 규칙', range: '홍콩 MTR', reason: 'MTR 유료 구역과 열차 내 음식·음료 섭취는 규칙 위반으로 벌금 대상이 될 수 있습니다.', alternative: '개찰구 밖 지정 공간에서 섭취하세요.', locations: ['지하철', '대중교통'], sources: [source('MTR - Conditions of Carriage', 'https://www.mtr.com.hk/en/customer/main/mtr-by-laws.html')] },
      { key: 'hong-kong-common-smoking', title: '금연 구역에서 담배나 전자담배를 사용하지 마세요', category: '법률·안전', risk: '높음', type: '금연 규정', range: '홍콩 전역', reason: '실내 공공장소와 지정된 야외 구역은 금연이며 고정 벌금이 부과될 수 있습니다.', alternative: '표지판이 있는 허용 구역만 이용하세요.', locations: ['실내', '거리·공공장소'], sources: [source('Hong Kong Tobacco and Alcohol Control Office - Statutory no smoking areas', 'https://www.taco.gov.hk/t/english/legislation/legislation_sa.html')] },
      { key: 'hong-kong-common-drone', title: '등록·허가 조건을 확인하지 않고 드론을 날리지 마세요', category: '촬영·드론', risk: '높음', type: '항공 규정', range: '홍콩 전역', reason: '소형 무인항공기는 무게와 운용 위험에 따라 등록과 교육, 제한 구역 규정이 적용됩니다.', alternative: '민항처 eSUA 플랫폼과 비행 지도를 확인하세요.', locations: ['야외', '관광지'], sources: [source('Hong Kong Civil Aviation Department - Small unmanned aircraft', 'https://www.cad.gov.hk/english/sua.html')] },
    ],
  },
  {
    name: '네덜란드', slug: 'netherlands',
    cities: [{ name: '암스테르담', slug: 'amsterdam' }, { name: '로테르담', slug: 'rotterdam' }, { name: '헤이그', slug: 'the-hague' }],
    warnings: [
      { key: 'netherlands-common-customs', title: '식품·식물·고가 물품을 신고 기준 확인 없이 반입하지 마세요', category: '입국·세관', risk: '높음', type: '세관 규정', range: '네덜란드 전역', reason: 'EU 외부에서 들어오는 식품, 식물, 현금과 고가 물품에는 제한과 신고 의무가 있을 수 있습니다.', alternative: '네덜란드 세관 여행자 안내를 확인하세요.', locations: ['공항·세관'], sources: [source('Netherlands Customs - Travelling to the Netherlands', 'https://www.belastingdienst.nl/wps/wcm/connect/en/customs/content/travelling-to-the-netherlands')] },
      { key: 'netherlands-common-ov-checkout', title: '대중교통에서 하차 태그를 빼먹지 마세요', category: '대중교통', risk: '높음', type: '운임 규칙', range: '네덜란드 전역', reason: 'OV-chipkaart와 비접촉 결제는 승하차 모두 체크인이 필요하며 누락 시 높은 기본 운임이 부과될 수 있습니다.', alternative: '탑승과 하차 때 같은 카드나 기기를 태그하세요.', locations: ['대중교통'], sources: [source('OVpay - Checking in and out', 'https://www.ovpay.nl/en/how-it-works')] },
      { key: 'netherlands-amsterdam-bike-lane', title: '암스테르담 자전거도로에 서 있거나 걷지 마세요', category: '교통·보행', risk: '높음', type: '교통 안전', range: '암스테르담', city: 'amsterdam', reason: '자전거 통행량과 속도가 높아 보행자가 자전거도로를 침범하면 충돌 위험이 큽니다.', alternative: '인도와 자전거도로의 색상·표지를 구분하세요.', locations: ['거리·공공장소'], sources: [source('I amsterdam - Cycling safely', 'https://www.iamsterdam.com/en/travel-stay/getting-around/cycling-in-amsterdam')] },
      { key: 'netherlands-amsterdam-cannabis-public', title: '대마 사용이 어디서나 허용된다고 생각하지 마세요', category: '법률·안전', risk: '높음', type: '지역 규정', range: '암스테르담', city: 'amsterdam', reason: '판매와 사용은 엄격한 조건 아래 허용되며 일부 도심 공공장소에서는 흡연이 금지됩니다.', alternative: '허가된 업소와 현장 표지판을 확인하고 국경을 넘기지 마세요.', locations: ['거리·공공장소'], sources: [source('City of Amsterdam - Cannabis rules', 'https://www.amsterdam.nl/en/policy/policy-safety/policy-coffeeshops/')] },
      { key: 'netherlands-common-drone', title: '인구 밀집 지역과 공항 주변에서 드론을 함부로 띄우지 마세요', category: '촬영·드론', risk: '높음', type: '항공 규정', range: '네덜란드 전역', reason: 'EU 드론 규정과 네덜란드 지리구역 제한이 적용됩니다.', alternative: '등록 여부와 비행 금지 구역 지도를 확인하세요.', locations: ['야외', '관광지'], sources: [source('Government of the Netherlands - Rules for drones', 'https://www.government.nl/topics/drone/rules-pertaining-to-recreational-use-of-drones')] },
    ],
  },
  {
    name: '포르투갈', slug: 'portugal',
    cities: [{ name: '리스본', slug: 'lisbon' }, { name: '포르투', slug: 'porto' }, { name: '파루', slug: 'faro' }],
    warnings: [
      { key: 'portugal-common-id', title: '여권이나 공식 신분증 없이 이동하지 마세요', category: '법률·안전', risk: '높음', type: '신분 확인', range: '포르투갈 전역', reason: '경찰이 신원 확인을 요구할 수 있습니다.', alternative: '원본 여권을 안전하게 소지하고 사본은 별도로 보관하세요.', locations: ['거리·공공장소'], sources: [source('Portugal travel advice - Local laws', 'https://www.gov.uk/foreign-travel-advice/portugal/safety-and-security')] },
      { key: 'portugal-common-ticket-validation', title: '교통권을 유효화하지 않고 지하철·버스·트램에 타지 마세요', category: '대중교통', risk: '높음', type: '운임 규칙', range: '포르투갈 도시 교통', reason: '표를 샀더라도 탑승 전 또는 승차 시 태그·유효화하지 않으면 무임승차로 처리될 수 있습니다.', alternative: '개찰구나 차량 단말기에 카드를 태그하고 검표 때까지 보관하세요.', locations: ['지하철', '대중교통'], sources: [source('Lisbon Metro - Tickets and validation', 'https://www.metrolisboa.pt/en/buy/')] },
      { key: 'portugal-common-fire-risk', title: '산불 위험 기간에 숲에서 불을 피우거나 흡연하지 마세요', category: '자연·야외', risk: '매우 높음', type: '화재 안전', range: '포르투갈 전역', reason: '여름철 고온과 건조로 산불 위험이 높고 화기 사용 제한이 강화될 수 있습니다.', alternative: '당일 산불 위험도와 민방위 지시를 확인하세요.', locations: ['국립공원', '야외'], sources: [source('Portugal Civil Protection - Rural fire risk', 'https://prociv.gov.pt/en/')] },
      { key: 'portugal-common-ocean', title: '대서양 해변의 적색 깃발과 높은 파도를 무시하지 마세요', category: '자연·야외', risk: '매우 높음', type: '해변 안전', range: '포르투갈 해안', reason: '강한 파도와 이안류가 발생할 수 있으며 비감시 해변은 구조 대응이 어렵습니다.', alternative: '감시 해변에서 깃발과 구조요원 지시에 따르세요.', locations: ['해변'], sources: [source('Portuguese Maritime Authority - Beach safety', 'https://www.amn.pt/DF/Paginas/Praias.aspx')] },
      { key: 'portugal-common-drone', title: '공항·군사시설·도심 관광지에서 허가 없이 드론을 띄우지 마세요', category: '촬영·드론', risk: '높음', type: '항공 규정', range: '포르투갈 전역', reason: '드론 비행에는 EU 규정과 포르투갈 공역·촬영 제한이 적용됩니다.', alternative: 'ANAC 등록과 비행 구역, 항공촬영 허가를 확인하세요.', locations: ['야외', '관광지'], sources: [source('Portugal Civil Aviation Authority - Drones', 'https://www.anac.pt/vPT/Generico/drones/Paginas/Drones.aspx')] },
    ],
  },
];
