import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma.service';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Request, Response } from 'express';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private prisma: PrismaService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validate(body.email, body.password);
    const token = this.auth.issueJwt(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // set true behind HTTPS in prod
      maxAge: 1000 * 60 * 60 * 8
    });
    return { id: user.id, email: user.email };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { ok: true };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return null;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    return { id: user.id, email: user.email };
  }
}
