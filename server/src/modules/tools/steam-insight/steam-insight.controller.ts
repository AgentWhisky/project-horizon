import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { SteamInsightService } from './steam-insight.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { SteamGameQueryDto } from './dto/steam-query.dto';
import { QueryAwareCacheInterceptor } from 'src/modules/tools/steam-insight/interceptors/query-aware-cache.interceptor';
import { ParamAwareCacheInterceptor } from 'src/modules/tools/steam-insight/interceptors/param-aware-cache.interceptor';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Steam Insight')
@Controller('steam-insight')
@UseInterceptors(CacheInterceptor)
export class SteamInsightController {
  constructor(private readonly steamInsightService: SteamInsightService) {}

  @Get()
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @UseInterceptors(QueryAwareCacheInterceptor)
  async getSteamGames(@Query() query: SteamGameQueryDto) {
    return this.steamInsightService.getSteamGames(query);
  }

  @Get(':appid')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @UseInterceptors(ParamAwareCacheInterceptor)
  async getSteamAppById(@Param('appid') appid: number) {
    return this.steamInsightService.getSteamAppDetails(appid);
  }
}
