import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Role, User } from 'src/user/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class PremiumGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user: User = request.user;
    return user.role === Role.PREMIUM;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (user.role === Role.ADMIN) {
      return true;
    } else {
      throw new ForbiddenException('You must be an ADMIN to perform this action');
    }
  }
}
