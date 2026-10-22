CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

CREATE TYPE "GamificationEvaluationEventType" AS ENUM (
  'WORKOUT_SESSION_FINISHED',
  'BODY_MEASUREMENT_CHANGED',
  'MANUAL_REPROCESS'
);

CREATE TYPE "GamificationEvaluationStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

ALTER TABLE "User"
ADD COLUMN "usernameNormalized" TEXT,
ADD COLUMN "email" TEXT,
ADD COLUMN "emailNormalized" TEXT,
ADD COLUMN "documentType" "DocumentType",
ADD COLUMN "documentHash" VARCHAR(64),
ADD COLUMN "documentEncrypted" TEXT,
ADD COLUMN "documentLast4" VARCHAR(4),
ADD COLUMN "documentKeyVersion" INTEGER;

ALTER TABLE "RewardAchievement"
ADD COLUMN "cycleKey" TEXT;

CREATE TABLE "UserAddress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "cep" VARCHAR(8) NOT NULL,
  "street" TEXT NOT NULL,
  "streetNumber" TEXT NOT NULL,
  "neighborhood" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "uf" VARCHAR(2) NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'Brasil',
  "complement" TEXT,
  "mainAddress" BOOLEAN NOT NULL DEFAULT true,
  "ibgeCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GamificationEvaluationJob" (
  "id" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "eventType" "GamificationEvaluationEventType" NOT NULL,
  "eventId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "status" "GamificationEvaluationStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedAt" TIMESTAMP(3),
  "lockedBy" TEXT,
  "completedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "payload" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "GamificationEvaluationJob_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "User_usernameNormalized_idx" ON "User"("usernameNormalized");
CREATE INDEX "User_emailNormalized_idx" ON "User"("emailNormalized");
CREATE INDEX "User_documentHash_idx" ON "User"("documentHash");
CREATE UNIQUE INDEX "UserAddress_userId_key" ON "UserAddress"("userId");
CREATE INDEX "UserAddress_cep_idx" ON "UserAddress"("cep");
CREATE INDEX "UserAddress_city_uf_idx" ON "UserAddress"("city", "uf");
CREATE INDEX "RewardAchievement_studentId_progressId_cycleKey_idx"
ON "RewardAchievement"("studentId", "progressId", "cycleKey");
CREATE UNIQUE INDEX "GamificationEvaluationJob_eventKey_key"
ON "GamificationEvaluationJob"("eventKey");
CREATE INDEX "GamificationEvaluationJob_status_availableAt_idx"
ON "GamificationEvaluationJob"("status", "availableAt");
CREATE INDEX "GamificationEvaluationJob_studentId_idx"
ON "GamificationEvaluationJob"("studentId");
CREATE INDEX "GamificationEvaluationJob_eventType_eventId_idx"
ON "GamificationEvaluationJob"("eventType", "eventId");

ALTER TABLE "UserAddress"
ADD CONSTRAINT "UserAddress_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
