import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const [countryCode, agencyName, sourceType, language = 'en', url] = process.argv.slice(2);

if (!countryCode || !agencyName || !sourceType || !url) {
  console.error('Usage: npm run content:source:add -- <countryCode> <agencyName> <sourceType> [language] <url>');
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(url);
} catch {
  console.error('A valid URL is required.');
  process.exit(1);
}
if (parsed.protocol !== 'https:') {
  console.error('OfficialSource must use HTTPS.');
  process.exit(1);
}

const source = await prisma.officialSource.upsert({
  where: { url: parsed.toString() },
  update: { countryCode: countryCode.toUpperCase(), agencyName, sourceType, language, enabled: true },
  create: { countryCode: countryCode.toUpperCase(), agencyName, sourceType, language, url: parsed.toString() },
});

console.log(JSON.stringify({ id: source.id, countryCode: source.countryCode, agencyName: source.agencyName, url: source.url }));
await prisma.$disconnect();
