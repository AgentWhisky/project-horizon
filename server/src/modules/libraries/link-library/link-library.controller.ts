import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LinkLibraryService } from './link-library.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LinkDto } from './dto/link.dto';

@ApiTags('Link Library')
@Controller('link-library')
@UseInterceptors(CacheInterceptor)
export class LinkLibraryController {
  constructor(private readonly linkLibraryService: LinkLibraryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all library links' })
  @ApiResponse({ status: 200, description: 'List of links', type: [LinkDto] })
  @CacheKey(CACHE_KEY.LINK_LIBRARY)
  async getLinks() {
    return this.linkLibraryService.getLibraryLinks();
  }
}
