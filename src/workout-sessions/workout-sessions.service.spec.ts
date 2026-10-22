import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoadProgressionService } from '../load-progression/load-progression.service';
import { WorkoutSessionsService } from './workout-sessions.service';
import { RewardAchievementsService } from '../reward-achievements/reward-achievements.service';

const prismaMock = {
  workoutSession: {
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  auditLog: { create: jest.fn() },
  personalProfile: { findUnique: jest.fn() },
  personalStudent: { findFirst: jest.fn() },
  $transaction: jest.fn(),
};

describe('WorkoutSessionsService history management', () => {
  let service: WorkoutSessionsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkoutSessionsService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: LoadProgressionService,
          useValue: { analyzeSession: jest.fn() },
        },
        {
          provide: RewardAchievementsService,
          useValue: { enqueueEvaluation: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(WorkoutSessionsService);
    jest.clearAllMocks();
  });

  it('lets the responsible personal mark a session as not performed', async () => {
    type AuditInput = {
      data: {
        userId: string;
        action: string;
        resourceId: string;
      };
    };
    let auditInput: AuditInput | undefined;
    prismaMock.workoutSession.findUnique.mockResolvedValue({
      id: 'session-1',
      studentId: 'student-1',
      startedAt: new Date('2026-10-20T10:00:00.000Z'),
      status: 'COMPLETED',
      scheduledPlanId: 'schedule-1',
    });
    prismaMock.personalProfile.findUnique.mockResolvedValue({
      id: 'personal-1',
    });
    prismaMock.personalStudent.findFirst.mockResolvedValue({
      personalId: 'personal-1',
      studentId: 'student-1',
    });
    prismaMock.workoutSession.delete.mockReturnValue('delete-query');
    prismaMock.auditLog.create.mockImplementation((input: AuditInput) => {
      auditInput = input;
      return 'audit-query';
    });
    prismaMock.$transaction.mockResolvedValue([]);

    await service.removeFromHistory('session-1', {
      sub: 'personal-user-1',
      role: Role.PERSONAL,
    });

    expect(prismaMock.$transaction).toHaveBeenCalledWith([
      'delete-query',
      'audit-query',
    ]);
    if (!auditInput) throw new Error('Auditoria não registrada.');
    expect(auditInput.data.userId).toBe('personal-user-1');
    expect(auditInput.data.action).toBe('DELETE_WORKOUT_HISTORY');
    expect(auditInput.data.resourceId).toBe('session-1');
  });

  it('rejects deletion by a personal who does not own the student', async () => {
    prismaMock.workoutSession.findUnique.mockResolvedValue({
      id: 'session-1',
      studentId: 'student-1',
      startedAt: new Date('2026-10-20T10:00:00.000Z'),
      status: 'COMPLETED',
      scheduledPlanId: 'schedule-1',
    });
    prismaMock.personalProfile.findUnique.mockResolvedValue({
      id: 'personal-2',
    });
    prismaMock.personalStudent.findFirst.mockResolvedValue(null);

    await expect(
      service.removeFromHistory('session-1', {
        sub: 'personal-user-2',
        role: Role.PERSONAL,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prismaMock.workoutSession.delete).not.toHaveBeenCalled();
  });

  it('returns not found when the session does not exist', async () => {
    prismaMock.workoutSession.findUnique.mockResolvedValue(null);

    await expect(
      service.removeFromHistory('missing-session', {
        sub: 'personal-user-1',
        role: Role.PERSONAL,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
