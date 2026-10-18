import { Role } from '@prisma/client';
export interface CurrentUserPayload {
    sub: string;
    role: Role;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
