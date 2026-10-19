import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erro interno do servidor.';

    const sensitivePatterns = [
      '/auth/login',
      '/progress-photos',
      '/body-measurements',
    ];
    const isSensitive = sensitivePatterns.some((p) => req.url.includes(p));

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url} → ${status}`,
        isSensitive ? '[conteúdo omitido]' : JSON.stringify(rawMessage),
      );
    }

    const message =
      typeof rawMessage === 'object' && rawMessage !== null && 'message' in rawMessage
        ? (rawMessage as { message: unknown }).message
        : rawMessage;

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
    });
  }
}
