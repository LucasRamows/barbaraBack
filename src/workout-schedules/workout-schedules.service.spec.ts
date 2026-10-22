import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DayOfWeek, Role, WorkoutSessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WorkoutSchedulesService } from './workout-schedules.service';

const prismaMock = {
  studentProfile: { findUnique: jest.fn() },
  personalProfile: { findUnique: jest.fn() },
  personalStudent: { findFirst: jest.fn() },
  workoutPlan: { findFirst: jest.fn() },
  workoutSchedule: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  workoutSession: {
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('WorkoutSchedulesService', () => {
  let service: WorkoutSchedulesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkoutSchedulesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(WorkoutSchedulesService);
    jest.clearAllMocks();
  });

  it('returns the seven-day agenda with exercises and planned loads', async () => {
    prismaMock.studentProfile.findUnique.mockResolvedValue({ id: 'student-1' });
    const schedule = {
      id: 'schedule-1',
      studentId: 'student-1',
      dayOfWeek: DayOfWeek.MONDAY,
      validFrom: null,
      validUntil: null,
      workoutPlan: {
        id: 'plan-1',
        name: 'Hipertrofia',
        description: null,
        objective: 'Força',
        estimatedMinutes: 50,
        days: [
          {
            id: 'day-1',
            dayOfWeek: DayOfWeek.MONDAY,
            label: 'Treino A',
            exercises: [
              {
                id: 'workout-exercise-1',
                sets: 3,
                minReps: 8,
                maxReps: 12,
                weight: 40,
                weightUnit: 'KG',
                exercise: { id: 'exercise-1', name: 'Supino', images: [] },
              },
            ],
          },
        ],
      },
    };
    const session = {
      id: 'session-1',
      scheduledPlanId: 'schedule-1',
      status: WorkoutSessionStatus.IN_PROGRESS,
      startedAt: new Date('2026-10-19T10:00:00.000Z'),
    };
    prismaMock.workoutSchedule.findMany.mockReturnValue('schedules-query');
    prismaMock.workoutSession.findMany.mockReturnValue('sessions-query');
    prismaMock.$transaction.mockResolvedValue([[schedule], [session]]);

    const result = await service.findMyWeek(
      { sub: 'user-1', role: Role.ALUNO },
      '2026-10-20',
    );

    expect(result.weekStart).toBe('2026-10-19');
    expect(result.weekEnd).toBe('2026-10-25');
    expect(result.days).toHaveLength(7);
    expect(result.days[0].schedule?.workoutDay?.exercises[0].weight).toBe(40);
    expect(result.days[0].session).toEqual(session);
  });

  it('rejects an invalid reference date', async () => {
    prismaMock.studentProfile.findUnique.mockResolvedValue({ id: 'student-1' });

    await expect(
      service.findMyWeek({ sub: 'user-1', role: Role.ALUNO }, '2026-02-30'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('removes a schedule and cancels its active session atomically', async () => {
    type CancelInput = {
      where: {
        status: WorkoutSessionStatus;
        OR: Array<{
          scheduledPlanId: string | null;
          workoutPlanId?: string;
        }>;
      };
      data: { status: WorkoutSessionStatus; finishedAt: Date };
    };
    let cancelInput: CancelInput | undefined;
    prismaMock.personalProfile.findUnique.mockResolvedValue({
      id: 'personal-1',
    });
    prismaMock.workoutSchedule.findUnique.mockResolvedValue({
      id: 'schedule-1',
      studentId: 'student-1',
      workoutPlanId: 'plan-1',
    });
    prismaMock.personalStudent.findFirst.mockResolvedValue({
      personalId: 'personal-1',
      studentId: 'student-1',
    });
    prismaMock.workoutSession.updateMany.mockImplementation(
      (input: CancelInput) => {
        cancelInput = input;
        return 'cancel-query';
      },
    );
    prismaMock.workoutSchedule.delete.mockReturnValue('delete-query');
    prismaMock.$transaction.mockResolvedValue([]);

    await service.remove('schedule-1', {
      sub: 'personal-user-1',
      role: Role.PERSONAL,
    });

    if (!cancelInput) throw new Error('Cancelamento não executado.');
    expect(cancelInput.where.status).toBe(WorkoutSessionStatus.IN_PROGRESS);
    expect(cancelInput.where.OR).toEqual([
      { scheduledPlanId: 'schedule-1' },
      { scheduledPlanId: null, workoutPlanId: 'plan-1' },
    ]);
    expect(cancelInput.data.status).toBe(WorkoutSessionStatus.CANCELLED);
    expect(cancelInput.data.finishedAt).toBeInstanceOf(Date);
    expect(prismaMock.$transaction).toHaveBeenCalledWith([
      'cancel-query',
      'delete-query',
    ]);
  });

  it("does not let a personal remove another personal's student schedule", async () => {
    prismaMock.personalProfile.findUnique.mockResolvedValue({
      id: 'personal-2',
    });
    prismaMock.workoutSchedule.findUnique.mockResolvedValue({
      id: 'schedule-1',
      studentId: 'student-1',
      workoutPlanId: 'plan-1',
    });
    prismaMock.personalStudent.findFirst.mockResolvedValue(null);

    await expect(
      service.remove('schedule-1', {
        sub: 'personal-user-2',
        role: Role.PERSONAL,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
