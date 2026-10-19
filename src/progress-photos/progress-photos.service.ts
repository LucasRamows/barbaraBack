import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PhotoPosition, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { UploadPhotoDto } from './dto/upload-photo.dto';

@Injectable()
export class ProgressPhotosService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  private async assertAccess(
    userId: string,
    role: Role,
    studentId: string,
  ): Promise<void> {
    if (role === Role.ALUNO) {
      const profile = await this.prisma.studentProfile.findUnique({
        where: { userId },
      });
      if (!profile || profile.id !== studentId) {
        throw new ForbiddenException('Acesso negado.');
      }
      return;
    }

    if (role === Role.PERSONAL) {
      const personal = await this.prisma.personalProfile.findUnique({
        where: { userId, deletedAt: null },
      });
      if (!personal) throw new ForbiddenException('Perfil de personal não encontrado.');
      const link = await this.prisma.personalStudent.findFirst({
        where: { personalId: personal.id, studentId },
      });
      if (!link) throw new ForbiddenException('Aluno não pertence a este personal.');
      return;
    }

    if (role === Role.SUPER_ADMIN) {
      const personal = await this.prisma.personalProfile.findUnique({
        where: { userId, deletedAt: null },
      });
      if (!personal) {
        throw new ForbiddenException(
          'Super Admin sem vínculo com este aluno não pode acessar dados sensíveis.',
        );
      }
      const link = await this.prisma.personalStudent.findFirst({
        where: { personalId: personal.id, studentId },
      });
      if (!link) {
        throw new ForbiddenException(
          'Super Admin sem vínculo com este aluno não pode acessar dados sensíveis.',
        );
      }
    }
  }

  async upload(
    file: Express.Multer.File,
    dto: UploadPhotoDto,
    currentUser: CurrentUserPayload,
  ) {
    await this.assertAccess(currentUser.sub, currentUser.role, dto.studentId);
    this.storage.validateImage(file);

    const path = `students/${dto.studentId}/progress/${Date.now()}-${crypto.randomUUID()}`;
    const { key } = await this.storage.uploadImage(file, path);

    const photo = await this.prisma.progressPhoto.create({
      data: {
        studentId: dto.studentId,
        takenAt: dto.takenAt ? new Date(dto.takenAt) : new Date(),
        fileKey: key,
        fileUrl: key,
        position: dto.position,
        observations: dto.observations,
        uploadedById: currentUser.sub,
      },
    });

    const signedUrl = await this.storage.getSignedUrl(key);
    const { fileUrl: _u, fileKey: _k, ...safePhoto } = photo;
    return { ...safePhoto, signedUrl };
  }

  async findAll(
    studentId: string,
    position: PhotoPosition | undefined,
    currentUser: CurrentUserPayload,
  ) {
    await this.assertAccess(currentUser.sub, currentUser.role, studentId);

    const photos = await this.prisma.progressPhoto.findMany({
      where: {
        studentId,
        deletedAt: null,
        ...(position ? { position } : {}),
      },
      orderBy: { takenAt: 'asc' },
    });

    return Promise.all(
      photos.map(async ({ fileUrl: _u, fileKey, ...rest }) => {
        const signedUrl = await this.storage.getSignedUrl(fileKey);
        return { ...rest, signedUrl };
      }),
    );
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const photo = await this.prisma.progressPhoto.findFirst({
      where: { id, deletedAt: null },
    });
    if (!photo) throw new NotFoundException('Foto não encontrada.');

    await this.assertAccess(currentUser.sub, currentUser.role, photo.studentId);

    const signedUrl = await this.storage.getSignedUrl(photo.fileKey);
    const { fileUrl: _u, fileKey: _k, ...safePhoto } = photo;
    return { ...safePhoto, signedUrl };
  }

  async remove(id: string, currentUser: CurrentUserPayload) {
    const photo = await this.prisma.progressPhoto.findFirst({
      where: { id, deletedAt: null },
    });
    if (!photo) throw new NotFoundException('Foto não encontrada.');

    await this.assertAccess(currentUser.sub, currentUser.role, photo.studentId);

    await this.storage.deleteFile(photo.fileKey);

    await this.prisma.progressPhoto.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
