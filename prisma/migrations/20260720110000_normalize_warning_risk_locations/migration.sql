CREATE TYPE "RiskLevel" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'INFO');

ALTER TABLE "Warning" ADD COLUMN "risk_new" "RiskLevel";
UPDATE "Warning" SET "risk_new" = CASE "risk"
  WHEN '매우 높음' THEN 'CRITICAL'::"RiskLevel"
  WHEN '높음' THEN 'HIGH'::"RiskLevel"
  WHEN '보통' THEN 'MEDIUM'::"RiskLevel"
  ELSE 'INFO'::"RiskLevel"
END;
ALTER TABLE "Warning" DROP COLUMN "risk";
ALTER TABLE "Warning" RENAME COLUMN "risk_new" TO "risk";
ALTER TABLE "Warning" ALTER COLUMN "risk" SET NOT NULL;

ALTER TABLE "Warning" ADD COLUMN "locations_new" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
UPDATE "Warning"
SET "locations_new" = CASE
  WHEN "locations" IS NULL OR "locations" = '' THEN ARRAY[]::TEXT[]
  ELSE ARRAY(SELECT jsonb_array_elements_text("locations"::jsonb))
END;
ALTER TABLE "Warning" DROP COLUMN "locations";
ALTER TABLE "Warning" RENAME COLUMN "locations_new" TO "locations";