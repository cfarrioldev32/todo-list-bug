import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from './constants';

import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        
        if (!token) {
            this.logger.warn('Missing Baerer token');
            throw new UnauthorizedException('Missing Baerer token');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            request['user'] = payload;
        } catch (e) {
              if (e instanceof TokenExpiredError) {
                this.logger.warn('Expired JWT token');
                throw new UnauthorizedException('Token expired');
            } else if (e instanceof JsonWebTokenError) {
                this.logger.warn('Invalid JWT token');
                throw new UnauthorizedException('Invalid Token');
            } else {
                this.logger.error('Unexpected JWT error', e);
                throw new UnauthorizedException('Unexpected error');
  }
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] =
            request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
