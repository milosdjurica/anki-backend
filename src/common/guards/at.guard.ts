import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      // first check on methods
      context.getHandler(),
      // if dont find check on whole controller
      context.getClass(),
    ]);

    // if method is public, then we can access it
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
