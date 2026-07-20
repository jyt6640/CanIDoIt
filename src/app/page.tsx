import { LandingPage } from '@/views/landing';
import { getCountries } from '@/entities/warning/api/warningRepository';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const countries = await getCountries();
  return <LandingPage countries={countries} />;
}
