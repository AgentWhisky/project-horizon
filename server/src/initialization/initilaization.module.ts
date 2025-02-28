import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RightEntity } from 'src/entities/right.entity';
import { InitRightService } from './init-rights.service';

@Module({
  imports: [TypeOrmModule.forFeature([RightEntity])],
  providers: [InitRightService],
  exports: [InitRightService],
})
export class InitializationModule {}
