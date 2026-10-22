DROP INDEX IF EXISTS "User_documentHash_idx";

CREATE UNIQUE INDEX "User_documentHash_key" ON "User"("documentHash");
