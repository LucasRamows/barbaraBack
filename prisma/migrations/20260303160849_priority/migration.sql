/*
  Warnings:

  - The `isPriority` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('URGENT', 'PRIORITY', 'DATED', 'NODATE');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "isPriority",
ADD COLUMN     "isPriority" "TaskPriority" NOT NULL DEFAULT 'NODATE';
