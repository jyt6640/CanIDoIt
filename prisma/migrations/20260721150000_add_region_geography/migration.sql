CREATE TYPE "RegionType" AS ENUM ('STATE', 'PROVINCE', 'TERRITORY', 'ISLAND', 'ISLAND_GROUP', 'METRO_AREA', 'PROVINCE_GROUP', 'AUTONOMOUS_REGION', 'COUNTRY_SUBDIVISION', 'OTHER');

CREATE TABLE "Region" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "type" "RegionType" NOT NULL DEFAULT 'OTHER',
  "countryId" TEXT NOT NULL,
  CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Region_countryId_slug_key" ON "Region"("countryId", "slug");
CREATE INDEX "Region_countryId_type_idx" ON "Region"("countryId", "type");

ALTER TABLE "City" ADD COLUMN "regionId" TEXT;
ALTER TABLE "Warning" ADD COLUMN "regionId" TEXT;
CREATE INDEX "Warning_regionId_idx" ON "Warning"("regionId");

ALTER TABLE "Region" ADD CONSTRAINT "Region_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "City" ADD CONSTRAINT "City_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;