import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { PostsModule } from './modules/posts/posts.module';
import { GuestModule } from './modules/guest/guest.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, PostsModule, GuestModule, FilesModule]
})
export class AppModule {}
