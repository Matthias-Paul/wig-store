import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ActiveUserType } from '../../interfaces/active-user.interface';

export interface CartsIdentity {
  userId?: string;
  guestId?: string;
}

type RequestWithActiveUser = Request & { user?: ActiveUserType };

export const GetCartsIdentity = createParamDecorator(
  (data: unknown, context: ExecutionContext): CartsIdentity => {
    const request = context.switchToHttp().getRequest<RequestWithActiveUser>();
    const userId = request.user?.sub;
    const guestId = request.headers['x-guest-id'] as string | undefined;

    if (!userId && !guestId) {
      throw new BadRequestException(
        'Missing guest identifier (X-Guest-Id header) or authentication',
      );
    }

    return { userId, guestId };
  },
);
