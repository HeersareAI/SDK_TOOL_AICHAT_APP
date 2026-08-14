ALTER TABLE "account"
  ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" timestamp,
  ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" timestamp,
  ADD COLUMN IF NOT EXISTS "scope" text;
