import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validate(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  issueJwt(userId: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('Missing JWT_SECRET');
    return jwt.sign({ sub: userId }, secret, { expiresIn: '8h' });
  }
}
