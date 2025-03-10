import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { LinkLibraryManagementService } from './link-library-management.service';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { CACHE_KEY, USER_RIGHTS } from 'src/common/constants';
import { LinkDto } from './dto/link.dto';
import { CategoryDto } from './dto/category.dto';
import { TagDto } from './dto/tag.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheUtils } from 'src/common/utils/cache.utils';

@Controller('link-library-management')
@UseInterceptors(CacheInterceptor)
export class LinkLibraryManagementController {
  constructor(
    private readonly linkLibraryManagementService: LinkLibraryManagementService,
    private readonly cacheUtils: CacheUtils
  ) {}

  // *** LINK ENDPOINTS ***
  @Get('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @CacheKey(CACHE_KEY.LINK_LIBRARY_MANAGEMENT)
  async getLinks() {
    return this.linkLibraryManagementService.getLinks();
  }

  @Post('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLink(@Body() link: LinkDto) {
    await this.cacheUtils.clearLinkCache();
    return this.linkLibraryManagementService.addLink(link);
  }

  @Put('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLink(@Param('id', ParseIntPipe) id: number, @Body() link: LinkDto) {
    await this.cacheUtils.clearLinkCache();
    return this.linkLibraryManagementService.updateLink(id, link);
  }

  @Delete('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLink(@Param('id', ParseIntPipe) id: number) {
    await this.cacheUtils.clearLinkCache();
    return this.linkLibraryManagementService.deleteLink(id);
  }

  // *** CATEGORY ENDPOINTS ***
  @Get('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @CacheKey(CACHE_KEY.LINK_CATEGORY_MANAGEMENT)
  async getCategories() {
    return this.linkLibraryManagementService.getCategories();
  }

  @Post('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLinkCategory(@Body() category: CategoryDto) {
    await this.cacheUtils.clearLinkCategoryCache();
    return this.linkLibraryManagementService.addCategory(category);
  }

  @Put('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkCategory(@Param('id', ParseIntPipe) id: number, @Body() category: CategoryDto) {
    await this.cacheUtils.clearLinkCategoryCache();
    return this.linkLibraryManagementService.updateCategory(id, category);
  }

  @Delete('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkCategory(@Param('id', ParseIntPipe) id: number) {
    await this.cacheUtils.clearLinkCategoryCache();
    return this.linkLibraryManagementService.deleteCategory(id);
  }

  // *** TAGS ENDPOINTS ***
  @Get('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @CacheKey(CACHE_KEY.LINK_TAG_MANAGEMENT)
  async getTags() {
    return this.linkLibraryManagementService.getTags();
  }

  @Post('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLinkTag(@Body() tag: TagDto) {
    await this.cacheUtils.clearLinkTagCache();
    return this.linkLibraryManagementService.addTag(tag);
  }

  @Put('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkTag(@Param('id', ParseIntPipe) id: number, @Body() tag: TagDto) {
    await this.cacheUtils.clearLinkTagCache();
    return this.linkLibraryManagementService.updateTag(id, tag);
  }

  @Delete('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkTag(@Param('id', ParseIntPipe) id: number) {
    await this.cacheUtils.clearLinkTagCache();
    return this.linkLibraryManagementService.deleteTag(id);
  }
}
