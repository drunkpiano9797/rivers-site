import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { IsString, MinLength } from 'class-validator';
import crypto from 'crypto';
import { Request } from 'express';

class GuestDto {
  @IsString()
  name!: string;

  @IsString()
  @MinLength(1)
  message!: string;
}

@Controller('guest')
export class GuestController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.guestEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }

  @Post()
  async create(@Body() dto: GuestDto, @Req() req: Request) {
    const ipHash = crypto.createHash('sha256').update(req.ip || 'ip').digest('hex');
    return this.prisma.guestEntry.create({ data: { ...dto, ipHash } });
  }
}
