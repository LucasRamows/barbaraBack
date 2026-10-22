-- A cycle is optional for legacy rows, but once assigned it must be unique
-- per student and rule so retries cannot create duplicate achievements.
CREATE UNIQUE INDEX IF NOT EXISTS "RewardAchievement_student_progress_cycle_unique"
ON "RewardAchievement" ("studentId", "progressId", "cycleKey")
WHERE "cycleKey" IS NOT NULL;
