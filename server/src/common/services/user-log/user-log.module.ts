import { Module } from '@nestjs/common';
import { UserLogService } from './user-log.service';
import { UserLogEntity } from 'src/entities/user-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserLogEntity])],
  providers: [UserLogService],
  exports: [UserLogService],
})
export class UserLogModule {}
