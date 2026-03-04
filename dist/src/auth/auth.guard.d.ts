import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare const GetUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
