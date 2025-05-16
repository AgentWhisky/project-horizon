import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { CACHE_KEY } from '../constants/cache-keys.constants';
import { createHash } from 'crypto';
import { CacheUtils } from '../utils/cache.utils';
import { Reflector } from '@nestjs/core';

@Injectable()
export class QueryAwareCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager,
    protected readonly reflector: Reflector,
    private readonly cacheUtils: CacheUtils
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const query = request.query;
    const queryHash = this.hashQuery(query);

    const cacheKey = `${CACHE_KEY.STEAM_INSIGHT}:${queryHash}`;

    // Add Cache Key to utils for tracking
    this.cacheUtils.cachedSteamInsightKeys.add(cacheKey);

    return cacheKey;
  }

  private hashQuery(query: any): string {
    const sorted = Object.entries(query)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    return createHash('sha1').update(sorted).digest('hex').substring(0, 10);
  }
}
