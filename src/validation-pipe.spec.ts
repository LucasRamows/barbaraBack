import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateStudentDto } from './students/dto/create-student.dto';
import { LoginDto } from './auth/dto/login.dto';

describe('Global ValidationPipe contract', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  it('rejects fields outside the declared DTO contract', async () => {
    await expect(
      pipe.transform(
        {
          name: 'Maria Silva',
          password: 'Senha@123',
          unexpectedAdminFlag: true,
        },
        { type: 'body', metatype: CreateStudentDto },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects invalid civil dates and datetime values for birthDate', async () => {
    await expect(
      pipe.transform(
        {
          name: 'Maria Silva',
          password: 'Senha@123',
          birthDate: '2026-02-31',
        },
        { type: 'body', metatype: CreateStudentDto },
      ),
    ).rejects.toThrow();

    await expect(
      pipe.transform(
        {
          name: 'Maria Silva',
          password: 'Senha@123',
          birthDate: '1995-08-20T03:00:00.000Z',
        },
        { type: 'body', metatype: CreateStudentDto },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects login payloads without either supported identifier', async () => {
    await expect(
      pipe.transform(
        { password: 'Senha@123' },
        { type: 'body', metatype: LoginDto },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
