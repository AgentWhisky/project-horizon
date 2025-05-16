import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { CACHE_KEY } from '../../../../common/constants/cache-keys.constants';
import { CacheUtils } from '../../../../common/utils/cache.utils';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ParamAwareCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
    protected readonly reflector: Reflector,
    private readonly cacheUtils: CacheUtils
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    const cacheKey = `${CACHE_KEY.STEAM_INSIGHT_DETAIL}:${params.appid}`;

    this.cacheUtils.cachedSteamInsightKeys.add(cacheKey);

    return cacheKey;
  }
}
