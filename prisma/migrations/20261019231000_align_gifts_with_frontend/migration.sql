ALTER TABLE "Gift"
ADD COLUMN "studentId" TEXT,
ADD COLUMN "isDelivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "deliveredAt" TIMESTAMP(3);

CREATE INDEX "Gift_studentId_idx" ON "Gift"("studentId");

ALTER TABLE "Gift"
ADD CONSTRAINT "Gift_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
