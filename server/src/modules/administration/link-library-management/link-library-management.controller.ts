import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LinkLibraryManagementService } from './link-library-management.service';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { USER_RIGHTS } from 'src/constants';
import { LinkDto } from './dto/link.dto';
import { CategoryDto } from './dto/category.dto';
import { TagDto } from './dto/tag.dto';

@Controller('link-library-management')
export class LinkLibraryManagementController {
  constructor(private readonly linkLibraryManagementService: LinkLibraryManagementService) {}

  // *** LINK ENDPOINTS ***
  @Get('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getLinks() {
    return this.linkLibraryManagementService.getLinks();
  }

  @Post('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLink(@Body() link: LinkDto) {
    return this.linkLibraryManagementService.addLink(link);
  }

  @Put('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLink(@Param('id', ParseIntPipe) id: number, @Body() link: LinkDto) {
    return this.linkLibraryManagementService.updateLink(id, link);
  }

  @Delete('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLink(@Param('id', ParseIntPipe) id: number) {
    return this.linkLibraryManagementService.deleteLink(id);
  }

  // *** CATEGORY ENDPOINTS ***
  @Get('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getCategories() {
    return this.linkLibraryManagementService.getCategories();
  }

  @Post('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLinkCategory(@Body() category: CategoryDto) {
    return this.linkLibraryManagementService.addCategory(category);
  }

  @Put('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkCategory(@Param('id', ParseIntPipe) id: number, @Body() category: CategoryDto) {
    return this.linkLibraryManagementService.updateCategory(id, category);
  }

  @Delete('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkCategory(@Param('id', ParseIntPipe) id: number) {
    return this.linkLibraryManagementService.deleteCategory(id);
  }

  // *** TAGS ENDPOINTS ***
  @Get('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getTags() {
    return this.linkLibraryManagementService.getTags();
  }

  @Post('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLinkTag(@Body() tag: TagDto) {
    return this.linkLibraryManagementService.addTag(tag);
  }

  @Put('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkTag(@Param('id', ParseIntPipe) id: number, @Body() tag: TagDto) {
    return this.linkLibraryManagementService.updateTag(id, tag);
  }

  @Delete('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkTag(@Param('id', ParseIntPipe) id: number) {
    return this.linkLibraryManagementService.deleteTag(id);
  }
}
