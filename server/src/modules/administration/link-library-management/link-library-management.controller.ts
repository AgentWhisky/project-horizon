import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';

import { RequireRight } from 'src/common/decorators/require-right.decorator';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';
import { DeleteResponse } from 'src/common/model/delete-response.model';

import { LinkLibraryManagementService } from './link-library-management.service';
import { LinkDto } from './dto/link.dto';
import { CategoryDto } from './dto/category.dto';
import { TagDto } from './dto/tag.dto';
import { LinkResponseDto } from './dto/link-response.dto';
import { LinkLibrary } from './link-library-management.model';
import { Throttle } from '@nestjs/throttler';

@Controller('link-library-management')
@UseInterceptors(CacheInterceptor)
export class LinkLibraryManagementController {
  constructor(
    private readonly linkLibraryManagementService: LinkLibraryManagementService,
    private readonly cacheUtils: CacheUtils
  ) {}

  // *** LINKS ***
  @Get('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @CacheKey(CACHE_KEY.LINK_LIBRARY_MANAGEMENT)
  async getLinks(): Promise<LinkResponseDto[]> {
    return this.linkLibraryManagementService.getLinks();
  }

  @Post('links')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLink(@Body() linkDto: LinkDto): Promise<LinkResponseDto> {
    const link = await this.linkLibraryManagementService.addLink(linkDto);
    await this.cacheUtils.clearLinkLibraryCache();
    return link;
  }

  @Put('links/:id')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLink(@Param('id', ParseIntPipe) id: number, @Body() linkDto: LinkDto): Promise<LinkResponseDto> {
    const link = await this.linkLibraryManagementService.updateLink(id, linkDto);
    await this.cacheUtils.clearLinkLibraryCache();
    return link;
  }

  @Delete('links/:id')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLink(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponse> {
    const deleteResponse = this.linkLibraryManagementService.deleteLink(id);
    await this.cacheUtils.clearLinkLibraryCache();
    return deleteResponse;
  }

  @Post('links/rebase')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async rebaseLinks() {
    const operationResult = await this.linkLibraryManagementService.rebaseLinks();
    await this.cacheUtils.clearLinkLibraryCache();
    return operationResult;
  }

  // *** CATEGORY ***
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

  // *** TAGS ***
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

  // *** IMPORT & EXPORT ***
  @Post('import')
  @RequireRight(USER_RIGHTS.IMPORT_LINK_LIBRARY)
  @UseInterceptors(FileInterceptor('file'))
  async importLinkLibrary(@UploadedFile() file: Express.Multer.File) {
    if (!file || file.mimetype !== 'application/json') {
      throw new BadRequestException();
    }

    try {
      const jsonString = file.buffer.toString('utf-8');
      const jsonObject: LinkLibrary = JSON.parse(jsonString);

      this.linkLibraryManagementService.importLinkLibrary(jsonObject);
      await this.cacheUtils.clearLinkLibraryCache();

      return { message: 'File imported successfully' };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get('export')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS, USER_RIGHTS.IMPORT_LINK_LIBRARY)
  @CacheKey(CACHE_KEY.LINK_LIBRARY_EXPORT)
  async exportLinkLibrary(@Res() res: Response) {
    const jsonString = await this.linkLibraryManagementService.exportLinkLibrary();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="linkLibraryExport.json"');

    res.send(jsonString);
  }
}
