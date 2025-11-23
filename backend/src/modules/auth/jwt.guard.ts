import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: any = context.switchToHttp().getRequest();
    const token = req.cookies?.token;
    if (!token) throw new UnauthorizedException();
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new UnauthorizedException();
    try {
      const decoded = jwt.verify(token, secret) as { sub: string };
      req.userId = decoded.sub;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
