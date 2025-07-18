// NestJS imports
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
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';

import { RequireRight } from 'src/common/decorators/require-right.decorator';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';
import { DeleteResponse } from 'src/common/model/delete-response.model';

import { LinkLibraryManagementService } from './link-library-management.service';
import { LinkLibrary } from './link-library-management.model';
import { LinkDto } from './dto/link.dto';
import { CategoryDto } from './dto/category.dto';
import { TagDto } from './dto/tag.dto';
import { LinkResponseDto } from './dto/link-response.dto';

@Controller('link-library-management')
export class LinkLibraryManagementController {
  constructor(private readonly linkLibraryManagementService: LinkLibraryManagementService) {}

  // *** LINKS ***
  @Get('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getLinks(): Promise<LinkResponseDto[]> {
    return this.linkLibraryManagementService.getLinks();
  }

  @Post('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLink(@Body() linkDto: LinkDto): Promise<LinkResponseDto> {
    const link = await this.linkLibraryManagementService.addLink(linkDto);
    return link;
  }

  @Put('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLink(@Param('id', ParseIntPipe) id: number, @Body() linkDto: LinkDto): Promise<LinkResponseDto> {
    const link = await this.linkLibraryManagementService.updateLink(id, linkDto);
    return link;
  }

  @Delete('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLink(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponse> {
    const deleteResponse = this.linkLibraryManagementService.deleteLink(id);
    return deleteResponse;
  }

  @Post('links/rebase')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async rebaseLinks() {
    const operationResult = await this.linkLibraryManagementService.rebaseLinks();
    return operationResult;
  }

  // *** CATEGORY ***
  @Get('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getCategories() {
    return this.linkLibraryManagementService.getCategories();
  }

  @Post('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLinkCategory(@Body() categoryDto: CategoryDto) {
    const category = await this.linkLibraryManagementService.addCategory(categoryDto);
    return category;
  }

  @Put('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkCategory(@Param('id', ParseIntPipe) id: number, @Body() categoryDto: CategoryDto) {
    const category = await this.linkLibraryManagementService.updateCategory(id, categoryDto);
    return category;
  }

  @Delete('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkCategory(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = await this.linkLibraryManagementService.deleteCategory(id);
    return deleteResponse;
  }

  // *** TAGS ***
  @Get('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async getTags() {
    return this.linkLibraryManagementService.getTags();
  }

  @Post('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async addLinkTag(@Body() tagDto: TagDto) {
    const tag = await this.linkLibraryManagementService.addTag(tagDto);
    return tag;
  }

  @Put('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async updateLinkTag(@Param('id', ParseIntPipe) id: number, @Body() tagDto: TagDto) {
    const tag = await this.linkLibraryManagementService.updateTag(id, tagDto);
    return tag;
  }

  @Delete('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  async deleteLinkTag(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = await this.linkLibraryManagementService.deleteTag(id);
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

      return { message: 'File imported successfully' };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get('export')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS, USER_RIGHTS.IMPORT_LINK_LIBRARY)
  async exportLinkLibrary(@Res() res: Response) {
    const jsonString = await this.linkLibraryManagementService.exportLinkLibrary();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="linkLibraryExport.json"');

    res.send(jsonString);
  }
}
