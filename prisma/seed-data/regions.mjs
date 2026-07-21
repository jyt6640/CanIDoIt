export const REGION_CATALOG = {
  japan: [
    { name: '간토', slug: 'kanto', type: 'METRO_AREA', cities: ['tokyo'] },
    { name: '간사이', slug: 'kansai', type: 'METRO_AREA', cities: ['osaka', 'kyoto'] },
  ],
  thailand: [
    { name: '태국 중부', slug: 'central', type: 'PROVINCE_GROUP', cities: ['bangkok'] },
    { name: '태국 북부', slug: 'north', type: 'PROVINCE_GROUP', cities: ['chiangmai'] },
    { name: '태국 남부', slug: 'south', type: 'PROVINCE_GROUP', cities: ['phuket'] },
  ],
  vietnam: [
    { name: '베트남 북부', slug: 'north', type: 'PROVINCE_GROUP', cities: ['hanoi'] },
    { name: '베트남 중부', slug: 'central', type: 'PROVINCE_GROUP', cities: ['danang'] },
    { name: '베트남 남부', slug: 'south', type: 'PROVINCE_GROUP', cities: ['hochiminh'] },
  ],
  taiwan: [
    { name: '대만 북부', slug: 'north', type: 'PROVINCE_GROUP', cities: ['taipei'] },
    { name: '대만 남부', slug: 'south', type: 'PROVINCE_GROUP', cities: ['kaohsiung'] },
  ],
  usa: [
    { name: '하와이', slug: 'hawaii', type: 'STATE', cities: ['hawaii'] },
    { name: '괌', slug: 'guam', type: 'TERRITORY', cities: ['guam'] },
    { name: '뉴욕주', slug: 'new-york', type: 'STATE', cities: ['newyork'] },
  ],
  philippines: [
    { name: '루손', slug: 'luzon', type: 'ISLAND_GROUP', cities: ['manila'] },
    { name: '비사야', slug: 'visayas', type: 'ISLAND_GROUP', cities: ['cebu', 'boracay'] },
  ],
  indonesia: [
    { name: '발리', slug: 'bali', type: 'PROVINCE', cities: ['bali'] },
    { name: '자와', slug: 'java', type: 'ISLAND', cities: ['jakarta', 'yogyakarta'] },
  ],
  australia: [
    { name: '뉴사우스웨일스', slug: 'new-south-wales', type: 'STATE', cities: ['sydney'] },
    { name: '빅토리아', slug: 'victoria', type: 'STATE', cities: ['melbourne'] },
    { name: '퀸즐랜드', slug: 'queensland', type: 'STATE', cities: ['brisbane'] },
  ],
  canada: [
    { name: '브리티시컬럼비아', slug: 'british-columbia', type: 'PROVINCE', cities: ['vancouver'] },
    { name: '온타리오', slug: 'ontario', type: 'PROVINCE', cities: ['toronto'] },
    { name: '퀘벡', slug: 'quebec', type: 'PROVINCE', cities: ['montreal'] },
  ],
  'united-kingdom': [
    { name: '잉글랜드', slug: 'england', type: 'COUNTRY_SUBDIVISION', cities: ['london', 'manchester'] },
    { name: '스코틀랜드', slug: 'scotland', type: 'COUNTRY_SUBDIVISION', cities: ['edinburgh'] },
  ],
  spain: [
    { name: '카탈루냐', slug: 'catalonia', type: 'AUTONOMOUS_REGION', cities: ['barcelona'] },
    { name: '마드리드주', slug: 'madrid-community', type: 'AUTONOMOUS_REGION', cities: ['madrid'] },
    { name: '안달루시아', slug: 'andalusia', type: 'AUTONOMOUS_REGION', cities: ['seville'] },
  ],
  malaysia: [
    { name: '말레이반도', slug: 'peninsular', type: 'PROVINCE_GROUP', cities: ['kuala-lumpur', 'penang'] },
    { name: '보르네오 말레이시아', slug: 'borneo', type: 'PROVINCE_GROUP', cities: ['kota-kinabalu'] },
  ],
  china: [
    { name: '화베이', slug: 'north-china', type: 'PROVINCE_GROUP', cities: ['beijing'] },
    { name: '화둥', slug: 'east-china', type: 'PROVINCE_GROUP', cities: ['shanghai'] },
    { name: '화난', slug: 'south-china', type: 'PROVINCE_GROUP', cities: ['guangzhou'] },
  ],
  'united-arab-emirates': [
    { name: '두바이 토후국', slug: 'dubai', type: 'STATE', cities: ['dubai'] },
    { name: '아부다비 토후국', slug: 'abu-dhabi', type: 'STATE', cities: ['abu-dhabi'] },
  ],
  switzerland: [
    { name: '취리히권', slug: 'zurich-region', type: 'METRO_AREA', cities: ['zurich'] },
    { name: '스위스 중부', slug: 'central', type: 'PROVINCE_GROUP', cities: ['lucerne'] },
    { name: '베른 고원', slug: 'bernese-oberland', type: 'PROVINCE_GROUP', cities: ['interlaken'] },
  ],
  austria: [
    { name: '빈', slug: 'vienna', type: 'STATE', cities: ['vienna'] },
    { name: '잘츠부르크주', slug: 'salzburg', type: 'STATE', cities: ['salzburg'] },
    { name: '티롤', slug: 'tyrol', type: 'STATE', cities: ['innsbruck'] },
  ],
  czechia: [
    { name: '보헤미아', slug: 'bohemia', type: 'PROVINCE_GROUP', cities: ['prague', 'cesky-krumlov'] },
    { name: '모라비아', slug: 'moravia', type: 'PROVINCE_GROUP', cities: ['brno'] },
  ],
  hungary: [
    { name: '중부 헝가리', slug: 'central', type: 'PROVINCE_GROUP', cities: ['budapest'] },
    { name: '남부 대평원', slug: 'southern-great-plain', type: 'PROVINCE_GROUP', cities: ['szeged'] },
  ],
  greece: [
    { name: '아티키', slug: 'attica', type: 'PROVINCE', cities: ['athens'] },
    { name: '키클라데스', slug: 'cyclades', type: 'ISLAND_GROUP', cities: ['santorini'] },
    { name: '중앙마케도니아', slug: 'central-macedonia', type: 'PROVINCE', cities: ['thessaloniki'] },
  ],
  turkey: [
    { name: '마르마라', slug: 'marmara', type: 'PROVINCE_GROUP', cities: ['istanbul'] },
    { name: '중앙아나톨리아', slug: 'central-anatolia', type: 'PROVINCE_GROUP', cities: ['cappadocia'] },
    { name: '지중해 연안', slug: 'mediterranean', type: 'PROVINCE_GROUP', cities: ['antalya'] },
  ],
  mexico: [
    { name: '멕시코 중부', slug: 'central', type: 'PROVINCE_GROUP', cities: ['mexico-city'] },
    { name: '유카탄반도', slug: 'yucatan', type: 'PROVINCE_GROUP', cities: ['cancun'] },
    { name: '바하칼리포르니아수르', slug: 'baja-california-sur', type: 'STATE', cities: ['los-cabos'] },
  ],
  maldives: [
    { name: '말레권', slug: 'male-region', type: 'ISLAND_GROUP', cities: ['male', 'maafushi'] },
  ],
  croatia: [
    { name: '중부 크로아티아', slug: 'central', type: 'PROVINCE_GROUP', cities: ['zagreb'] },
    { name: '달마티아', slug: 'dalmatia', type: 'PROVINCE_GROUP', cities: ['dubrovnik', 'split'] },
  ],
  italy: [
    { name: '라치오', slug: 'lazio', type: 'PROVINCE', cities: ['rome'] },
    { name: '롬바르디아', slug: 'lombardy', type: 'PROVINCE', cities: ['milano'] },
    { name: '베네토', slug: 'veneto', type: 'PROVINCE', cities: ['venice'] },
  ],
};
