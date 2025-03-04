import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { LinkLibraryService } from './link-library.service';
import { LinkCategoryData, LinkData, LinkTagData } from './link-library.model';

@Controller('link-library')
export class LinkLibraryController {
  constructor(private readonly linkLibraryService: LinkLibraryService) {}

  // *** LINKS ***
  @Get()
  async getLinks() {
    return this.linkLibraryService.getLibraryLinks();
  }

  @Post()
  async addLink(@Body() link: LinkData) {
    return this.linkLibraryService.addLibraryLink(link);
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
    return this.linkLibraryService.getLinkCategories();
  }

  @Post('categories')
  async addLinkCategory(@Body() category: LinkCategoryData) {
    return this.linkLibraryService.addLinkCategory(category);
  }

  @Put('categories/:id')
  async updateLinkCategory(@Param('id') id: number, @Body() category: LinkCategoryData) {
    return this.linkLibraryService.updateLinkCategory(Number(id), category);
  }

  @Delete('categories/:id')
  async deleteLinkCategory(@Param('id') id: number) {
    return this.linkLibraryService.deleteLinkCategory(Number(id));
  }

  // *** LINK TAGS ***
  @Get('tags')
  async getTags() {
    return this.linkLibraryService.getLinkTags();
  }

  @Post('tags')
  async addLinkTag(@Body() tag: LinkTagData) {
    return this.linkLibraryService.addLinkTag(tag);
  }

  @Put('tags/:id')
  async updateLinkTag(@Param('id') id: number, @Body() tag: LinkTagData) {
    return this.linkLibraryService.updateLinkTag(Number(id), tag);
  }

  @Delete('tags/:id')
  async deleteLinkTag(@Param('id') id: number) {
    return this.linkLibraryService.deleteLinkTag(Number(id));
  }
}
