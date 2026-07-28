import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ActiveUserType } from '../../interfaces/active-user.interface';
import authConfig from '../../config/auth.config';
import { IS_PUBLIC_KEY } from '../decorators/allow-anonymous.decorator';

type RequestWithActiveUser = Request & { user?: ActiveUserType };

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<RequestWithActiveUser>();
    const token = request.cookies?.access_token as string | undefined;

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync<ActiveUserType>(
          token,
          { secret: this.authConfiguration.secret },
        );
        request.user = payload;
      } catch {
        // Invalid/expired token — silently ignore on public routes,
        // request.user simply stays undefined (treated as a guest)
      }
    }

    if (isPublic) {
      return true; // no login required, but request.user may now be populated
    }

    if (!request.user) {
      throw new UnauthorizedException(
        'No access token provided or token invalid',
      );
    }

    return true;
  }
}
