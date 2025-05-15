import { Module } from '@nestjs/common';
import { SteamInsightService } from './steam-insight.service';
import { SteamInsightController } from './steam-insight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { SteamAppEntity } from 'src/entities/steam-app.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SteamAppEntity]), CacheModule.register()],
  controllers: [SteamInsightController],
  providers: [SteamInsightService],
})
export class SteamInsightModule {}
