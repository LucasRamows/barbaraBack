import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { PushSubscriptionDto } from './dto/push-subscription.dto';
import webpush from 'web-push';

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);
  private readonly configured: boolean;

  constructor(private readonly prisma: PrismaService) {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT ?? 'mailto:admin@barbara.app';
    this.configured = Boolean(publicKey && privateKey);
    if (this.configured) webpush.setVapidDetails(subject, publicKey!, privateKey!);
  }

  get publicKey(): string | null {
    return process.env.VAPID_PUBLIC_KEY ?? null;
  }

  async register(userId: string, dto: PushSubscriptionDto): Promise<void> {
    await this.prisma.pushSubscription.upsert({
      where: { endpoint: dto.endpoint },
      create: {
        userId,
        endpoint: dto.endpoint,
        expirationTime: dto.expirationTime == null ? null : BigInt(dto.expirationTime),
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
      },
      update: {
        userId,
        expirationTime: dto.expirationTime == null ? null : BigInt(dto.expirationTime),
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
      },
    });
  }

  async unregister(userId: string, endpoint: string): Promise<void> {
    await this.prisma.pushSubscription.deleteMany({ where: { userId, endpoint } });
  }

  async notifyUser(userId: string, payload: PushPayload): Promise<void> {
    if (!this.configured) return;
    const subscriptions = await this.prisma.pushSubscription.findMany({ where: { userId } });
    await Promise.all(subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          { endpoint: subscription.endpoint, expirationTime: subscription.expirationTime ? Number(subscription.expirationTime) : null, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
          JSON.stringify(payload),
        );
      } catch (error: unknown) {
        const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined;
        if (statusCode === 404 || statusCode === 410) {
          await this.prisma.pushSubscription.delete({ where: { id: subscription.id } }).catch(() => undefined);
          return;
        }
        this.logger.warn(`Falha ao enviar push para a inscrição ${subscription.id}.`);
      }
    }));
  }

  async notifyStudent(studentId: string, payload: PushPayload): Promise<void> {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { userId: true },
    });
    if (student) await this.notifyUser(student.userId, payload);
  }

  async notifyUsers(userIds: string[], payload: PushPayload): Promise<void> {
    await Promise.all(userIds.map((userId) => this.notifyUser(userId, payload)));
  }
}
