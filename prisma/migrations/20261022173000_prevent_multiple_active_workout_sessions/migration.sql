-- Enforce the domain invariant at the database boundary so concurrent starts
-- cannot both pass the application-level active-session check.
CREATE UNIQUE INDEX "WorkoutSession_one_active_per_student"
ON "WorkoutSession" ("studentId")
WHERE "status" = 'IN_PROGRESS';
