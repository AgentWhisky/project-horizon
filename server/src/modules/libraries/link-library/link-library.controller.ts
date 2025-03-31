import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LinkLibraryService } from './link-library.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LinkLibraryResponseDto, LinkResponseDto } from './dto/link.dto';

@ApiTags('Link Library')
@Controller('link-library')
@UseInterceptors(CacheInterceptor)
export class LinkLibraryController {
  constructor(private readonly linkLibraryService: LinkLibraryService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all library links', description: 'Returns a list of library links from the database.' })
  @ApiOkResponse({ description: 'Successfully retrieved list of links.', type: [LinkResponseDto] })
  @CacheKey(CACHE_KEY.LINK_LIBRARY)
  async getLinks(): Promise<LinkLibraryResponseDto> {
    return this.linkLibraryService.getLibraryLinks();
  }
}
