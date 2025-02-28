import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { RefreshTokenCleanupService } from '../maintenance/refresh-token-cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  providers: [RefreshTokenCleanupService],
  exports: [RefreshTokenCleanupService],
})
export class MaintenanceModule {}
