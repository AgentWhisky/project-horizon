import { Controller, Get, Query } from '@nestjs/common';

import { LinkLibraryService } from './link-library.service';
import { Link, LinkCategory, LinkTag } from './link-library.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Link Library')
@Controller('link-library')
export class LinkLibraryController {
  constructor(private readonly linkLibraryService: LinkLibraryService) {}

  @Get('/links')
  async getLinks(@Query('search') search?: string, @Query('name') name?: string, @Query('category') category?: string): Promise<Link[]> {
    return this.linkLibraryService.getLinks(search, name, category);
  }

  @Get('/categories')
  async getCategories(@Query('name') name?: string): Promise<LinkCategory[]> {
    return this.linkLibraryService.getCategories(name);
  }

  @Get('/tags')
  async getTags(): Promise<LinkTag[]> {
    return this.linkLibraryService.getTags();
  }
}
