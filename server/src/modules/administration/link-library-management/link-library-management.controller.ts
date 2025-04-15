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
import { LinkLibraryManagementService } from './link-library-management.service';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { LinkDto } from './dto/link.dto';
import { CategoryDto } from './dto/category.dto';
import { TagDto } from './dto/tag.dto';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResponse } from 'src/common/model/delete-response.model';
import { DeleteResponseDto } from 'src/common/dto/delete-response.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { LinkResponseDto } from './dto/link-response.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { LinkLibrary } from './link-library-management.model';

@ApiTags('Link Library Management')
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all links for management' })
  @ApiOkResponse({ description: 'List of links for management', type: [LinkResponseDto] })
  async getLinks(): Promise<LinkResponseDto[]> {
    return this.linkLibraryManagementService.getLinks();
  }

  @Post('links')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiBody({ type: LinkDto })
  @ApiCreatedResponse({ description: 'Link created successfully', type: LinkResponseDto })
  async addLink(@Body() linkDto: LinkDto): Promise<LinkResponseDto> {
    const link = await this.linkLibraryManagementService.addLink(linkDto);
    await this.cacheUtils.clearLinkCache();
    return link;
  }

  @Put('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing link' })
  @ApiParam({ name: 'id', description: 'ID of the link', type: Number })
  @ApiBody({ type: LinkDto })
  @ApiCreatedResponse({ description: 'Link updated successfully', type: LinkResponseDto })
  async updateLink(@Param('id', ParseIntPipe) id: number, @Body() linkDto: LinkDto): Promise<LinkResponseDto> {
    const link = await this.linkLibraryManagementService.updateLink(id, linkDto);
    await this.cacheUtils.clearLinkCache();
    return link;
  }

  @Delete('links/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', description: 'ID of the link', type: Number })
  @ApiOkResponse({ description: 'Link deleted successfully', type: DeleteResponseDto })
  async deleteLink(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponse> {
    const deleteResponse = this.linkLibraryManagementService.deleteLink(id);
    await this.cacheUtils.clearLinkCache();
    return deleteResponse;
  }

  // *** CATEGORY ENDPOINTS ***
  @Get('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @CacheKey(CACHE_KEY.LINK_CATEGORY_MANAGEMENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all categories for management' })
  @ApiOkResponse({ description: 'List of categories for management', type: [CategoryResponseDto] })
  async getCategories() {
    return this.linkLibraryManagementService.getCategories();
  }

  @Post('categories')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new category' })
  @ApiBody({ type: CategoryDto })
  @ApiCreatedResponse({ description: 'Category successfully created', type: CategoryResponseDto })
  async addLinkCategory(@Body() categoryDto: CategoryDto) {
    const category = await this.linkLibraryManagementService.addCategory(categoryDto);
    await this.cacheUtils.clearLinkCategoryCache();
    return category;
  }

  @Put('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing category' })
  @ApiParam({ name: 'id', description: 'ID of the category', type: Number })
  @ApiBody({ type: CategoryDto })
  @ApiCreatedResponse({ description: 'Category successfully updated', type: CategoryResponseDto })
  async updateLinkCategory(@Param('id', ParseIntPipe) id: number, @Body() categoryDto: CategoryDto) {
    const category = await this.linkLibraryManagementService.updateCategory(id, categoryDto);
    await this.cacheUtils.clearLinkCategoryCache();
    return category;
  }

  @Delete('categories/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'ID of the category', type: Number })
  @ApiOkResponse({ description: 'Category successfully deleted', type: DeleteResponseDto })
  async deleteLinkCategory(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = await this.linkLibraryManagementService.deleteCategory(id);
    await this.cacheUtils.clearLinkCategoryCache();
    return deleteResponse;
  }

  // *** TAGS ENDPOINTS ***
  @Get('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @CacheKey(CACHE_KEY.LINK_TAG_MANAGEMENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all tags for management' })
  @ApiOkResponse({ description: 'List of tags for management', type: [TagResponseDto] })
  async getTags() {
    return this.linkLibraryManagementService.getTags();
  }

  @Post('tags')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: TagDto })
  @ApiCreatedResponse({ description: 'Tag created successfully', type: TagResponseDto })
  async addLinkTag(@Body() tagDto: TagDto) {
    const tag = await this.linkLibraryManagementService.addTag(tagDto);
    await this.cacheUtils.clearLinkTagCache();
    return tag;
  }

  @Put('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing tag' })
  @ApiParam({ name: 'id', description: 'ID of the tag', type: Number })
  @ApiBody({ type: TagDto })
  @ApiCreatedResponse({ description: 'Link updated successfully', type: TagResponseDto })
  async updateLinkTag(@Param('id', ParseIntPipe) id: number, @Body() tagDto: TagDto) {
    const tag = await this.linkLibraryManagementService.updateTag(id, tagDto);
    await this.cacheUtils.clearLinkTagCache();
    return tag;
  }

  @Delete('tags/:id')
  @RequireRight(USER_RIGHTS.MANAGE_LINKS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'id', description: 'ID of the tag', type: Number })
  @ApiOkResponse({ description: 'Tag deleted successfully', type: DeleteResponseDto })
  async deleteLinkTag(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = await this.linkLibraryManagementService.deleteTag(id);
    await this.cacheUtils.clearLinkTagCache();
    return deleteResponse;
  }

  @Post('import')
  @RequireRight(USER_RIGHTS.IMPORT_LINK_LIBRARY)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Import link library from JSON file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'JSON file containing the link library data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Link library imported successfully' })
  @ApiBadRequestResponse({ description: 'Invalid file or data format' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export link library as JSON file' })
  @ApiOkResponse({
    description: 'Returns a downloadable JSON file',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async exportLinkLibrary(@Res() res: Response) {
    const jsonString = await this.linkLibraryManagementService.exportLinkLibrary();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="linkLibraryExport.json"');

    res.send(jsonString);
  }
}
