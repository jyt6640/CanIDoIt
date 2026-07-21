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
};
