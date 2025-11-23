import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';

@Module({
  controllers: [GuestController]
})
export class GuestModule {}
