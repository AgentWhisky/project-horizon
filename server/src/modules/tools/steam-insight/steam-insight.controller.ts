import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { SteamInsightService } from './steam-insight.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { SteamGameQueryDto } from './dto/steam-query.dto';
import { QueryAwareCacheInterceptor } from 'src/common/interceptors/query-aware-cache.interceptor';

@ApiTags('Steam Insight')
@Controller('steam-insight')
@UseInterceptors(CacheInterceptor)
export class SteamInsightController {
  constructor(private readonly steamInsightService: SteamInsightService) {}

  @Get()
  @UseInterceptors(QueryAwareCacheInterceptor)
  async getSteamGames(@Query() query: SteamGameQueryDto) {
    return this.steamInsightService.getSteamGames(query);
  }
}
