// NestJS imports
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { USER_RIGHTS } from '@hz/common/constants';
import { RequireRight } from '@hz/common/decorators';
import { DeleteResponse } from '@hz/common/model';
import { getContentDispositionHeader, getFilenameTimestamp } from '@hz/common/utils';

import { LinkDto } from './dto/link.dto';
import { CategoryDto } from './dto/category.dto';
import { TagDto } from './dto/tag.dto';
import { UpdateLinkSortKeyDto } from './dto/update-link-sort-key.dto';

import { LinkLibraryManagementService } from './link-library-management.service';
import { Link, LinkCategory, LinkTag } from './link-library-management.model';

@ApiTags('Link Library Management')
@Controller('link-library-management')
export class LinkLibraryManagementController {
  constructor(private readonly linkLibraryManagementService: LinkLibraryManagementService) {}

  // *** LINKS ***
  @Get('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getLinks(): Promise<Link[]> {
    return this.linkLibraryManagementService.getLinks();
  }

  @Post('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLink(@Body() linkDto: LinkDto): Promise<Link> {
    return this.linkLibraryManagementService.addLink(linkDto);
  }

  @Put('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLink(@Param('id', ParseIntPipe) id: number, @Body() linkDto: LinkDto): Promise<Link> {
    return this.linkLibraryManagementService.updateLink(id, linkDto);
  }

  @Put('links/:id/sortKey')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkSortKey(@Param('id', ParseIntPipe) id: number, @Body() updateLinkSortKeyDto: UpdateLinkSortKeyDto): Promise<Link> {
    return this.linkLibraryManagementService.updateLinkSortKey(id, updateLinkSortKeyDto.category ?? null, updateLinkSortKeyDto.sortKey);
  }

  @Delete('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLink(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponse> {
    return this.linkLibraryManagementService.deleteLink(id);
  }

  @Post('links/rebase')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async rebaseLinks() {
    return this.linkLibraryManagementService.rebaseLinks();
  }

  // *** CATEGORY ***
  @Get('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getCategories(): Promise<LinkCategory[]> {
    return this.linkLibraryManagementService.getCategories();
  }

  @Post('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLinkCategory(@Body() categoryDto: CategoryDto): Promise<LinkCategory> {
    return this.linkLibraryManagementService.addCategory(categoryDto);
  }

  @Put('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkCategory(@Param('id', ParseIntPipe) id: number, @Body() categoryDto: CategoryDto): Promise<LinkCategory> {
    return this.linkLibraryManagementService.updateCategory(id, categoryDto);
  }

  @Delete('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkCategory(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponse> {
    return this.linkLibraryManagementService.deleteCategory(id);
  }

  // *** TAGS ***
  @Get('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getTags(): Promise<LinkTag[]> {
    return this.linkLibraryManagementService.getTags();
  }

  @Post('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLinkTag(@Body() tagDto: TagDto): Promise<LinkTag> {
    return this.linkLibraryManagementService.addTag(tagDto);
  }

  @Put('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkTag(@Param('id', ParseIntPipe) id: number, @Body() tagDto: TagDto): Promise<LinkTag> {
    return this.linkLibraryManagementService.updateTag(id, tagDto);
  }

  @Delete('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkTag(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponse> {
    return this.linkLibraryManagementService.deleteTag(id);
  }

  // *** IMPORT & EXPORT ***
  @Post('import')
  @RequireRight(USER_RIGHTS.IMPORT_LINK_LIBRARY)
  @UseInterceptors(FileInterceptor('file'))
  async importLinkLibrary(@UploadedFile() file: Express.Multer.File) {
    return this.linkLibraryManagementService.importLinkLibrary(file);
  }

  @Get('export')
  @ApiProduces('application/json')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="linkLibraryExport.json"')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS, USER_RIGHTS.IMPORT_LINK_LIBRARY)
  async exportLinkLibrary(@Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const jsonString = await this.linkLibraryManagementService.exportLinkLibrary();
    const buffer = Buffer.from(jsonString, 'utf-8');

    const filename = `linkLibraryExport_${getFilenameTimestamp()}.json`;

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': getContentDispositionHeader(filename),
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });

    return new StreamableFile(buffer);
  }
}
