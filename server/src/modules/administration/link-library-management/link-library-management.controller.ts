import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { LinkLibraryManagementService } from './link-library-management.service';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { LinkDto } from './dto/link.dto';
import { CategoryDto } from './dto/category.dto';
import { TagDto } from './dto/tag.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';

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
  async addLink(@Body() linkDto: LinkDto) {
    const link = await this.linkLibraryManagementService.addLink(linkDto);
    await this.cacheUtils.clearLinkCache();
    return link;
  }

  @Put('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLink(@Param('id', ParseIntPipe) id: number, @Body() linkDto: LinkDto) {
    const link = await this.linkLibraryManagementService.updateLink(id, linkDto);
    await this.cacheUtils.clearLinkCache();
    return link;
  }

  @Delete('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLink(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = this.linkLibraryManagementService.deleteLink(id);
    await this.cacheUtils.clearLinkCache();
    return deleteResponse;
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
  async addLinkCategory(@Body() categoryDto: CategoryDto) {
    const category = await this.linkLibraryManagementService.addCategory(categoryDto);
    await this.cacheUtils.clearLinkCategoryCache();
    return category;
  }

  @Put('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkCategory(@Param('id', ParseIntPipe) id: number, @Body() categoryDto: CategoryDto) {
    const category = await this.linkLibraryManagementService.updateCategory(id, categoryDto);
    await this.cacheUtils.clearLinkCategoryCache();
    return category;
  }

  @Delete('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkCategory(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = await this.linkLibraryManagementService.deleteCategory(id);
    await this.cacheUtils.clearLinkCategoryCache();
    return deleteResponse;
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
  async addLinkTag(@Body() tagDto: TagDto) {
    const tag = await this.linkLibraryManagementService.addTag(tagDto);
    await this.cacheUtils.clearLinkTagCache();
    return tag;
  }

  @Put('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkTag(@Param('id', ParseIntPipe) id: number, @Body() tagDto: TagDto) {
    const tag = await this.linkLibraryManagementService.updateTag(id, tagDto);
    await this.cacheUtils.clearLinkTagCache();
    return tag;
  }

  @Delete('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkTag(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = await this.linkLibraryManagementService.deleteTag(id);
    await this.cacheUtils.clearLinkTagCache();
    return deleteResponse;
  }
}
