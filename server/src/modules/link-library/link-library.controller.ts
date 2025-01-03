import { Body, Controller, Delete, Get, Param, Put, Res } from '@nestjs/common';
import { LinkLibraryService } from './link-library.service';
import { LinkData } from './link-library.model';

@Controller('link-library')
export class LinkLibraryController {
  constructor(private readonly linkLibraryService: LinkLibraryService) {}

  // *** LINKS ***
  @Get()
  async getLinks() {
    return this.linkLibraryService.getLibraryLinks();
  }

  @Put(':id')
  async updateLink(@Param('id') id: number, @Body() link: LinkData) {
    return this.linkLibraryService.updateLibraryLink(Number(id), link);
  }

  @Delete(':id')
  async deleteLink(@Param('id') id: number) {
    return this.linkLibraryService.deleteLibraryLink(Number(id));
  }

  // *** LINK CATEGORIES ***
  @Get('categories')
  async getCategories() {
    return this.linkLibraryService.getCategories();
  }

  // *** LINK TAGS ***
  @Get('tags')
  async getTags() {
    return this.linkLibraryService.getTags();
  }
}
