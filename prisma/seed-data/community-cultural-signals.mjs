const checkedAt = '2026-07-21';
const community = (title, url, platform = 'Reddit') => ({ title, url, checkedAt, kind: 'COMMUNITY', platform });
const editorial = (title, url, platform) => ({ title, url, checkedAt, kind: 'EDITORIAL', platform });

export const COMMUNITY_CULTURAL_SIGNALS = [
  {
    name: '태국', slug: 'thailand',
    cities: [
      { name: '방콕', slug: 'bangkok' },
      { name: '치앙마이', slug: 'chiangmai' },
      { name: '푸껫', slug: 'phuket' },
    ],
    warnings: [
      {
        key: 'thailand-common-feet-context',
        title: '발로 사람·불상·물건을 가리키거나 밀지 마세요',
        category: '문화·예절', risk: '보통', type: '신체 제스처', range: '태국 전역',
        reason: '여행자와 현지인 토론에서 발바닥을 사람이나 불상 쪽으로 향하게 하거나 발로 물건을 움직이는 행동이 무례하게 받아들여질 수 있다는 경험이 반복됩니다.',
        alternative: '바닥에 앉을 때 발끝을 사람과 불상 반대쪽으로 두고, 물건은 손으로 옮기세요.',
        contextNotes: '특히 사원, 바닥 좌석, 연장자나 승려 앞에서 민감합니다. 단순히 걷거나 발끝이 잠깐 향한 상황까지 과도하게 걱정할 필요는 없습니다.',
        sideEffects: '상대가 직접 항의하지 않더라도 표정이 굳거나 자리를 피하고, 사원에서는 관계자가 자세를 바로잡아 달라고 요청할 수 있습니다.',
        counterpoint: '젊은 층과 일상 공간에서는 민감도가 낮을 수 있으며, 모든 발 방향을 감시하는 절대 규칙은 아닙니다.',
        evidenceLevel: 'CORROBORATED', independentSourceCount: 3, status: 'REVIEWING', confidence: 78,
        locations: ['사찰·신사', '가정집', '거리·공공장소'],
        sources: [
          editorial('Thailand Foundation - Feet Low, Head High', 'https://thailandfoundation.or.th/feet-low-head-high-a-guide-to-thai-etiquettes/', 'Thailand Foundation'),
          community('Reddit r/Thailand - What are the rules about pointing feet?', 'https://www.reddit.com/r/Thailand/comments/x0giq0/what_are_the_rules_about_pointing_feet_in_thailand/'),
          community('Reddit r/ThailandTourism - Pointing with your feet', 'https://www.reddit.com/r/ThailandTourism/comments/1fpu9qn/all_the_travel_guides_tell_you_not_to_point_with/'),
        ],
      },
      {
        key: 'thailand-common-head-touch-context',
        title: '친하지 않은 사람의 머리를 장난으로 만지지 마세요',
        category: '문화·예절', risk: '보통', type: '신체 접촉', range: '태국 전역',
        reason: '머리를 신체의 높은 부분으로 보는 관습 때문에 낯선 사람이나 연장자의 머리를 만지는 행동이 무례하게 느껴질 수 있다는 현지 경험이 반복됩니다.',
        alternative: '아이를 포함해 머리를 쓰다듬기 전에 보호자나 당사자의 동의를 구하세요.',
        contextNotes: '사원, 전통 행사, 연장자와의 첫 만남에서 특히 피하는 편이 안전합니다.',
        sideEffects: '상대가 놀라거나 불편함을 표현할 수 있고, 친근함을 보이려던 행동이 경계 침범으로 받아들여질 수 있습니다.',
        counterpoint: '가까운 친구나 가족 사이, 젊은 세대에서는 크게 신경 쓰지 않는 경우도 있어 상황과 관계가 중요합니다.',
        evidenceLevel: 'CORROBORATED', independentSourceCount: 2, status: 'REVIEWING', confidence: 74,
        locations: ['가정집', '거리·공공장소', '사찰·신사'],
        sources: [
          editorial('Thailand Foundation - Feet Low, Head High', 'https://thailandfoundation.or.th/feet-low-head-high-a-guide-to-thai-etiquettes/', 'Thailand Foundation'),
          community('Reddit r/Thailand - Dos and Donts of Thai culture', 'https://www.reddit.com/r/Thailand/comments/17q1yz5/dos_and_donts_of_thai_culture/'),
        ],
      },
    ],
  },
  {
    name: '일본', slug: 'japan',
    cities: [
      { name: '오사카', slug: 'osaka' },
      { name: '도쿄', slug: 'tokyo' },
      { name: '교토', slug: 'kyoto' },
    ],
    warnings: [
      {
        key: 'japan-common-sushi-strong-fragrance',
        title: '작은 스시·가이세키 식당에 강한 향수를 뿌리고 가지 마세요',
        category: '문화·예절', risk: '보통', type: '식사 환경', range: '일본의 소규모 고급 식당',
        reason: '여행자 후기와 일본 음식 매체에서 강한 향이 생선·육수의 섬세한 향을 가리고 다른 손님의 식사 경험까지 방해한다는 지적이 반복됩니다.',
        alternative: '예약한 오마카세·가이세키 식당에는 향수, 강한 헤어 제품, 향이 진한 섬유유연제 사용을 줄이세요.',
        contextNotes: '좌석 수가 적고 향을 중요하게 보는 스시·가이세키·차 문화 공간에서 특히 민감합니다.',
        sideEffects: '입장을 거절당하거나 다른 손님의 코스 경험을 방해할 수 있으며, 셰프에게 예약 매너가 부족한 손님으로 인식될 수 있습니다.',
        counterpoint: '모든 일본 식당에서 향수가 금지되는 것은 아닙니다. 패밀리 레스토랑이나 넓은 일반 식당까지 동일하게 적용하지 마세요.',
        evidenceLevel: 'CORROBORATED', independentSourceCount: 4, status: 'REVIEWING', confidence: 82,
        locations: ['식당'],
        sources: [
          community('Reddit r/JapanTravel - Dress code in high-end sushi places', 'https://www.reddit.com/r/JapanTravel/comments/97vc0u/dress_code_in_high_end_sushi_places/'),
          community('Reddit r/JapanTravel - Making a reservation at Sushi Saito', 'https://www.reddit.com/r/JapanTravel/comments/4434wy/making_a_reservation_at_sushi_saito/'),
          editorial('Delicious - Should you wear perfume in a sushi restaurant in Japan?', 'https://www.delicious.com.au/food-files/article/should-you-wear-perfume-sushi-restaurant-japan/ugfqpbfx', 'Delicious'),
          editorial('The Times - How to be a welcome tourist in ultra-polite Japan', 'https://www.thetimes.com/world/asia/article/japan-tourism-sushi-tokyo-hsdsj05n2', 'The Times'),
        ],
      },
      {
        key: 'japan-common-train-quiet-context',
        title: '열차에서 통화하거나 주변보다 훨씬 크게 대화하지 마세요',
        category: '문화·예절', risk: '참고', type: '대중교통 분위기', range: '일본 도시 대중교통',
        reason: '여행자 커뮤니티에서는 조용한 객실 분위기를 선호하고 전화 통화와 큰 목소리를 피하라는 경험이 반복됩니다.',
        alternative: '통화는 하차 후 하고, 대화가 필요하면 주변 음량보다 낮게 짧게 이야기하세요.',
        contextNotes: '출퇴근 시간, 조용한 통근열차, 우등·지정석 객실에서 더 민감합니다. 관광열차나 단체 승객이 많은 노선은 분위기가 다를 수 있습니다.',
        sideEffects: '직접 제지보다 주변 승객이 자리를 옮기거나 시선을 보내는 식으로 불편함이 나타날 수 있습니다.',
        counterpoint: '일본 열차에서 모든 대화가 금지된 것은 아닙니다. 조용한 대화까지 공포스럽게 피할 필요는 없고 주변 맥락을 따르는 것이 핵심입니다.',
        evidenceLevel: 'COMMUNITY_SIGNAL', independentSourceCount: 3, status: 'REVIEWING', confidence: 70,
        locations: ['지하철', '대중교통'],
        sources: [
          community('Reddit r/JapanTravel Wiki - Public Transit Etiquette', 'https://www.reddit.com/r/JapanTravel/wiki/advice/transport/etiquette/'),
          community('Reddit r/JapanTravel community guidance', 'https://www.reddit.com/r/JapanTravel/'),
          editorial('Business Insider - Tourists overthink Japanese rules', 'https://www.businessinsider.com/breaking-rules-visiting-japan-tourists-advice-from-local-2026-4', 'Business Insider'),
        ],
      },
      {
        key: 'japan-common-train-eating-context',
        title: '혼잡한 통근열차에서 냄새 강한 음식을 펼치지 마세요',
        category: '문화·예절', risk: '참고', type: '대중교통 식사', range: '일본 대중교통',
        reason: '여행자 토론과 일본 설문 소개에서는 열차 내 식사가 무조건 금지라기보다 열차 종류, 혼잡도, 냄새와 좌석 형태에 따라 평가가 달라진다는 점이 반복됩니다.',
        alternative: '신칸센·특급의 좌석에서는 도시락을 먹을 수 있지만, 혼잡한 통근열차에서는 냄새가 강한 음식과 부스러기 많은 음식을 피하세요.',
        contextNotes: '신칸센, 장거리 특급, 관광열차와 도시 통근열차의 분위기를 구분해야 합니다.',
        sideEffects: '주변 승객에게 냄새와 공간 불편을 줄 수 있고, 음식물을 흘리면 혼잡한 객실에서 민폐로 받아들여질 수 있습니다.',
        counterpoint: '“일본에서는 열차 안에서 절대 먹으면 안 된다”는 식의 일반화는 부정확합니다. 상황별 판단이 필요합니다.',
        evidenceLevel: 'COMMUNITY_SIGNAL', independentSourceCount: 2, status: 'REVIEWING', confidence: 68,
        locations: ['대중교통'],
        sources: [
          community('Reddit r/JapanTravel - Public acceptance of eating on transport', 'https://www.reddit.com/r/JapanTravel/comments/7d2k42/questionnaire_results_regarding_public_acceptance/'),
          editorial('Business Insider - Tourists overthink Japanese rules', 'https://www.businessinsider.com/breaking-rules-visiting-japan-tourists-advice-from-local-2026-4', 'Business Insider'),
        ],
      },
    ],
  },
  {
    name: '싱가포르', slug: 'singapore',
    cities: [{ name: '싱가포르', slug: 'singapore' }],
    warnings: [
      {
        key: 'singapore-common-hawker-chope',
        title: '호커센터 테이블의 휴지나 작은 물건을 치우고 앉지 마세요',
        category: '문화·예절', risk: '참고', type: '호커센터 관습', range: '싱가포르 호커센터',
        reason: '현지에서는 휴지, 우산, 명함 같은 작은 물건으로 자리를 맡는 “초프(chope)” 관습이 널리 알려져 있습니다.',
        alternative: '테이블 위에 개인 물건이 있으면 이미 사용 중인 자리로 보고 다른 자리를 찾으세요.',
        contextNotes: '점심시간 도심 호커센터처럼 자리가 부족한 곳에서 특히 흔합니다.',
        sideEffects: '주인이 음식을 들고 돌아왔을 때 자리 다툼이 생기거나, 현지 관습을 무시한 방문객으로 보일 수 있습니다.',
        counterpoint: '모든 물건이 자리 표시인 것은 아니며 장시간 방치된 물건은 직원에게 확인하는 것이 좋습니다.',
        evidenceLevel: 'CORROBORATED', independentSourceCount: 2, status: 'REVIEWING', confidence: 76,
        locations: ['식당', '시장'],
        sources: [
          editorial('Condé Nast Traveler - Unwritten Rules to Know Before Visiting Singapore', 'https://www.cntraveler.com/story/unwritten-rules-singapore', 'Condé Nast Traveler'),
          editorial('Visa City Guide - Chope Culture', 'https://www.visakorea.com/visa-everywhere/innovation-centers/singapore/city-guide/survive/chope-culture.html', 'Visa'),
        ],
      },
    ],
  },
  {
    name: '베트남', slug: 'vietnam',
    cities: [
      { name: '다낭', slug: 'danang' },
      { name: '하노이', slug: 'hanoi' },
      { name: '호찌민', slug: 'hochiminh' },
    ],
    warnings: [
      {
        key: 'vietnam-common-upright-chopsticks-context',
        title: '밥그릇에 젓가락을 수직으로 꽂아 두지 마세요',
        category: '문화·예절', risk: '보통', type: '식사 상징', range: '베트남 전역',
        reason: '현지 여행 매체와 여행자 안내에서 젓가락을 밥에 세우는 모습이 제사·장례의 향을 연상시켜 식탁에서 불편하게 받아들여질 수 있다고 반복 설명합니다.',
        alternative: '젓가락은 그릇 옆 받침이나 접시 위에 가지런히 놓으세요.',
        contextNotes: '가정 식사, 연장자와 함께하는 식사, 제사 문화에 익숙한 가족과의 식사에서 특히 민감할 수 있습니다.',
        sideEffects: '식사 분위기가 갑자기 어색해지거나 동석자가 즉시 젓가락을 내려 달라고 할 수 있습니다.',
        counterpoint: '실수 한 번으로 큰 모욕이 되는 절대 규칙이라기보다 죽음·제사를 연상시키는 상징 때문에 피하는 예절입니다.',
        evidenceLevel: 'CORROBORATED', independentSourceCount: 3, status: 'REVIEWING', confidence: 80,
        locations: ['식당', '가정집'],
        sources: [
          editorial('Vietcetera - Proper Etiquette To Remember When Traveling Vietnam', 'https://vietcetera.com/en/proper-etiquette-to-remember-when-traveling-vietnam', 'Vietcetera'),
          editorial('VinWonders - Vietnamese etiquette', 'https://vinwonders.com/en/wonderpedia/news/vietnamese-etiquette/', 'VinWonders'),
          editorial('Street Food Adventure - Vietnamese Chopstick Etiquette', 'https://streetfoodadventure.com/blog/vietnamese-chopstick-etiquette-9-rules-tourists-must-not-ignore', 'Travel Blog'),
        ],
      },
    ],
  },
];
