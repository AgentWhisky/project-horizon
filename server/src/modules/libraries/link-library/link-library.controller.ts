import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LinkLibraryService } from './link-library.service';
import { LinkCategoryResponseDto, LinkResponseDto, LinkTagResponseDto } from './dto/link.dto';

@ApiTags('Link Library')
@Controller('link-library')
export class LinkLibraryController {
  constructor(private readonly linkLibraryService: LinkLibraryService) {}

  @Get('/links')
  async getLinks(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('tags') tags?: string
  ): Promise<LinkResponseDto[]> {
    return this.linkLibraryService.getLinks(search, category, tags);
  }

  @Get('/categories')
  async getCategories(): Promise<LinkCategoryResponseDto[]> {
    return this.linkLibraryService.getCategories();
  }

  @Get('/tags')
  async getTags(): Promise<LinkTagResponseDto[]> {
    return this.linkLibraryService.getTags();
  }
}
