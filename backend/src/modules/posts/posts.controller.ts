import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreatePostDto, Section, UpdatePostDto } from './dto';
import { JwtGuard } from '../auth/jwt.guard';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('section') section?: Section, @Query('limit') limit = 30) {
    return this.prisma.post.findMany({
      where: { section: section as Section | undefined, isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: Number(limit) || 30
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreatePostDto, @Req() req: Request) {
    const authorId = (req as any).userId as string;
    return this.prisma.post.create({ data: { ...dto, authorId } });
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data: dto });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prisma.post.delete({ where: { id } });
    return { ok: true };
  }
}
