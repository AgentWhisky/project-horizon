import { SetMetadata } from '@nestjs/common';

export const QUERY_CACHE_KEY = 'QUERY_CACHE_KEY';

export const QueryCacheKey = (key: string) => SetMetadata(QUERY_CACHE_KEY, key);
