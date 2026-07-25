import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { ActiveUserType } from '../../interfaces/active-user.interface';

type RequestWithActiveUser = Request & { user?: ActiveUserType };

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserType | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithActiveUser>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
