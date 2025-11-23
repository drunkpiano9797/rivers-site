import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateFileDto } from './dto';
import { Request } from 'express';

@Controller('files')
export class FilesController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreateFileDto, @Req() req: Request) {
    const uploaderId = (req as any).userId as string;
    return this.prisma.fileAsset.create({
      data: {
        name: dto.name,
        size: dto.size,
        mime: dto.mime,
        checksum: dto.checksum,
        bucket: process.env.STORAGE_BUCKET || 'rivers-files',
        objectKey: dto.name,
        isPublic: !!dto.isPublic,
        uploaderId
      }
    });
  }

  @UseGuards(JwtGuard)
  @Get()
  async list(@Query('q') q?: string) {
    return this.prisma.fileAsset.findMany({
      where: q ? { name: { contains: q, mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.prisma.fileAsset.delete({ where: { id } });
    return { ok: true };
  }
}
