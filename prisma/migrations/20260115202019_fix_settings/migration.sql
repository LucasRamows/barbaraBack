/*
  Warnings:

  - Changed the type of `notifyCalendar` on the `Settings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "notifyCalendar",
ADD COLUMN     "notifyCalendar" BOOLEAN NOT NULL;
