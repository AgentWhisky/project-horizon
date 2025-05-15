import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { SteamInsightService } from './steam-insight.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { SteamGameQueryDto } from './dto/steam-query.dto';

@ApiTags('Steam Insight')
@Controller('steam-insight')
@UseInterceptors(CacheInterceptor)
export class SteamInsightController {
  constructor(private readonly steamInsightService: SteamInsightService) {}

  @Get()
  //@CacheKey(CACHE_KEY.STEAM_INSIGHT)
  async getSteamGames(@Query() query: SteamGameQueryDto) {
    return this.steamInsightService.getSteamGames(query);
  }
}
