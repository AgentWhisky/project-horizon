import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CACHE_KEY } from '../constants/cache-keys.constants';

@Injectable()
export class CacheUtils {
  readonly cachedSteamInsightKeys = new Set<string>();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Administration
  async clearAdminDashboard() {
    await this.cacheManager.del(CACHE_KEY.ADMIN_DASHBOARD);
  }

  // Links
  async clearLinkCache() {
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY_EXPORT);
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY);
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY_MANAGEMENT);
  }

  async clearLinkCategoryCache() {
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY_EXPORT);
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY);
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY_MANAGEMENT);
    await this.cacheManager.del(CACHE_KEY.LINK_CATEGORY_MANAGEMENT);
  }

  async clearLinkTagCache() {
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY_EXPORT);
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY);
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY_MANAGEMENT);
    await this.cacheManager.del(CACHE_KEY.LINK_TAG_MANAGEMENT);
  }

  async clearLinkLibraryCache() {
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY_EXPORT);
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY);
    await this.cacheManager.del(CACHE_KEY.LINK_LIBRARY_MANAGEMENT);
    await this.cacheManager.del(CACHE_KEY.LINK_CATEGORY_MANAGEMENT);
    await this.cacheManager.del(CACHE_KEY.LINK_TAG_MANAGEMENT);
  }

  async clearSteamInsightKeys() {
    const deletePromises: Promise<boolean>[] = [];

    for (const key of this.cachedSteamInsightKeys) {
      deletePromises.push(this.cacheManager.del(key));
      this.cachedSteamInsightKeys.delete(key);
    }

    await Promise.all(deletePromises);
  }
}
