import { LandingPage } from '@/views/landing';
import { getCountries } from '@/entities/warning/api/warningRepository';

// DB를 조회하므로 빌드 타임 정적 생성 대신 요청 시 렌더
export const dynamic = 'force-dynamic';

export default async function Page() {
  const countries = await getCountries();
  return <LandingPage countries={countries} />;
}
