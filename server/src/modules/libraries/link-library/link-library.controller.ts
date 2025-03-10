import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LinkLibraryService } from './link-library.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';

@Controller('link-library')
@UseInterceptors(CacheInterceptor)
export class LinkLibraryController {
  constructor(private readonly linkLibraryService: LinkLibraryService) {}

  @Get()
  @CacheKey(CACHE_KEY.LINK_LIBRARY)
  async getLinks() {
    return this.linkLibraryService.getLibraryLinks();
  }
}
