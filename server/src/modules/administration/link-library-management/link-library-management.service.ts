import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DataSource, EntityManager, Not, Repository } from 'typeorm';

import { flattenValidationErrors } from '@hz/common/utils';
import { DeleteResponse, OperationResult } from '@hz/common/model';
import { MINOR_BASE, MINOR_LENGTH, MINOR_STEP } from '@hz/common/constants';

import { LinkCategoryEntity } from 'src/entities/link-categories.entity';
import { LinkEntity } from 'src/entities/link.entity';
import { LinkTagEntity } from 'src/entities/link-tags.entity';

import { LinkLibraryDto } from './dto/link-library.dto';
import {
  Category,
  CategoryPayload,
  Link,
  LinkCategory,
  LinkLibrary,
  LinkPayload,
  LinkTag,
  Tag,
  TagPayload,
} from './link-library-management.model';

@Injectable()
export class LinkLibraryManagementService implements OnModuleInit {
  private readonly logger = new Logger(LinkLibraryManagementService.name);

  constructor(
    @InjectRepository(LinkEntity)
    private readonly libraryLinkRepository: Repository<LinkEntity>,

    @InjectRepository(LinkCategoryEntity)
    private readonly linkCategoryRepository: Repository<LinkCategoryEntity>,

    @InjectRepository(LinkTagEntity)
    private readonly linkTagRepository: Repository<LinkTagEntity>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async onModuleInit() {
    this.logger.log('Rebasing Link Library sort keys...');
    this.rebaseLinks()
      .then(() => this.logger.log('Completed rebasing links.'))
      .catch((err) => this.logger.error('Failed to rebase links:', err));
  }

  // *** LINK FUNCTIONS ***
  async getLinks(): Promise<Link[]> {
    const libaryLinks: Link[] = await this.libraryLinkRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        icon: true,
        category: { id: true, name: true, description: true },
        tags: { id: true, name: true },
        sortKey: true,
        contrastBackground: true,
      },
      relations: { category: true, tags: true },
      order: { id: 'ASC' },
    });

    return libaryLinks;
  }

  async addLink(linkPayload: LinkPayload): Promise<Link> {
    const newLink = await this.libraryLinkRepository.save({
      name: linkPayload.name,
      description: linkPayload.description,
      url: linkPayload.url,
      icon: linkPayload.icon,
      category: { id: linkPayload.category },
      tags: linkPayload.tags.map((tagId) => ({ id: tagId })),
      sortKey: linkPayload.sortKey || '',
      contrastBackground: linkPayload.contrastBackground,
    });

    return await this.libraryLinkRepository.findOne({
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        icon: true,
        category: { id: true, name: true, description: true },
        tags: { id: true, name: true },
        sortKey: true,
        contrastBackground: true,
      },
      where: { id: newLink.id },
      relations: { category: true, tags: true },
    });
  }

  async updateLink(id: number, linkPayload: LinkPayload): Promise<Link> {
    const existingLink = await this.libraryLinkRepository.findOne({ where: { id } });

    if (!existingLink) {
      throw new NotFoundException(`Link with ID: ${id} not found`);
    }

    await this.libraryLinkRepository.save({
      id,
      name: linkPayload.name,
      description: linkPayload.description,
      url: linkPayload.url,
      icon: linkPayload.icon,
      category: { id: linkPayload.category },
      tags: linkPayload.tags.map((tagId) => ({ id: tagId })),
      sortKey: linkPayload.sortKey || '',
      contrastBackground: linkPayload.contrastBackground,
    });

    return await this.libraryLinkRepository.findOne({
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        icon: true,
        category: { id: true, name: true, description: true },
        tags: { id: true, name: true },
        sortKey: true,
        contrastBackground: true,
      },
      where: { id },
      relations: { category: true, tags: true },
    });
  }

  async updateLinkSortKey(id: number, categoryId: number | null, sortKey: string): Promise<Link> {
    const existingLink = await this.libraryLinkRepository.findOne({ where: { id } });

    if (!existingLink) {
      throw new NotFoundException(`Link with ID: ${id} not found`);
    }

    // Verify Category exists
    if (categoryId !== null) {
      const categoryExists = await this.linkCategoryRepository.exists({ where: { id: categoryId } });
      if (!categoryExists) {
        throw new BadRequestException(`Category with ID ${categoryId} does not exist`);
      }
    }

    await this.libraryLinkRepository.save({
      id,
      sortKey,
      category: { id: categoryId },
    });

    return await this.libraryLinkRepository.findOne({
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        icon: true,
        category: { id: true, name: true, description: true },
        tags: { id: true, name: true },
        sortKey: true,
        contrastBackground: true,
      },
      where: { id },
      relations: { category: true, tags: true },
    });
  }

  async deleteLink(id: number): Promise<DeleteResponse> {
    const deleteResult = await this.libraryLinkRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  async rebaseLinks(): Promise<OperationResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const links = await queryRunner.manager.find(LinkEntity, {
        select: {
          id: true,
          name: true,
          sortKey: true,
          category: { id: true },
        },
        relations: {
          category: true,
        },
        order: {
          category: { id: 'ASC' },
          sortKey: 'ASC',
        },
      });

      let affectedRows = 0;
      let currentCategory = 0;
      let currentMinor = parseInt(MINOR_BASE, 36);

      for (const link of links) {
        const categoryId = link.category?.id ?? 0;

        // Update current category and reset minor
        if (categoryId !== currentCategory) {
          currentCategory = categoryId;
          currentMinor = parseInt(MINOR_BASE, 36);
        }

        // Generate new sort key
        const major = categoryId.toString().padStart(6, '0');
        const minor = currentMinor.toString(36).toUpperCase().padStart(MINOR_LENGTH, '0');
        const sortKey = `${major}:${minor}`;

        await queryRunner.manager.update(LinkEntity, link.id, { sortKey });

        currentMinor += MINOR_STEP;
        affectedRows++;
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        affectedRows,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to rebase links');
    } finally {
      await queryRunner.release();
    }
  }

  // *** CATEGORY FUNCTIONS ***
  async getCategories(): Promise<Category[]> {
    const linkCategories: Category[] = await this.linkCategoryRepository
      .createQueryBuilder('category')
      .leftJoin(LinkEntity, 'link', 'link.category_id = category.id')
      .select(['category.id AS id', 'category.name AS name', 'category.description AS description'])
      .addSelect('COUNT(link.id) > 0', 'inUse')
      .groupBy('category.id')
      .orderBy('category.name', 'ASC')
      .getRawMany();

    return linkCategories;
  }

  async addCategory(categoryPayload: CategoryPayload): Promise<Category> {
    const newCategory = await this.linkCategoryRepository.save({
      name: categoryPayload.name,
      description: categoryPayload.description,
    });

    const categoryRecord = await this.linkCategoryRepository.findOne({
      select: { id: true, name: true, description: true },
      where: { id: newCategory.id },
    });

    return {
      ...categoryRecord,
      inUse: false,
    };
  }

  async updateCategory(id: number, categoryPayload: CategoryPayload): Promise<Category> {
    const existingCategory = await this.linkCategoryRepository.findOne({ where: { id } });

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID: ${id} not found`);
    }

    await this.linkCategoryRepository.save({
      id,
      name: categoryPayload.name,
      description: categoryPayload.description,
    });

    return await this.linkCategoryRepository
      .createQueryBuilder('category')
      .leftJoin(LinkEntity, 'link', 'link.category_id = category.id')
      .select(['category.id AS id', 'category.name AS name', 'category.description AS description'])
      .where('category.id = :id', { id })
      .addSelect('COUNT(link.id) > 0', 'inUse')
      .groupBy('category.id')
      .getRawOne();
  }

  async deleteCategory(id: number): Promise<DeleteResponse> {
    const { inUse } = await this.linkCategoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.links', 'link')
      .where('category.id = :id', { id })
      .select('COUNT(link.id) > 0', 'inUse')
      .getRawOne<{ inUse: boolean }>();

    if (inUse) {
      throw new BadRequestException(`Category with ID '${id}' is in use and cannot be deleted.`);
    }

    const deleteResult = await this.linkCategoryRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  // *** TAG FUNCTIONS ***
  async getTags(): Promise<Tag[]> {
    const linkTags: Tag[] = await this.linkTagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.links', 'link')
      .select(['tag.id AS id', 'tag.name AS name'])
      .addSelect('COUNT(link.id) > 0', 'inUse')
      .groupBy('tag.id')
      .orderBy('tag.name', 'ASC')
      .getRawMany();

    return linkTags;
  }

  async addTag(tagPayload: TagPayload): Promise<Tag> {
    const conflictTag = await this.linkTagRepository.findOne({ where: { name: tagPayload.name } });
    if (conflictTag) {
      throw new BadRequestException(`Tag with name '${tagPayload.name}' already exists.`);
    }

    const newTag = await this.linkTagRepository.save({
      name: tagPayload.name,
    });

    const tagRecord = await this.linkTagRepository.findOne({
      select: { id: true, name: true },
      where: { id: newTag.id },
    });

    return {
      ...tagRecord,
      inUse: false,
    };
  }

  async updateTag(id: number, tagPayload: TagPayload): Promise<Tag> {
    const conflictTag = await this.linkTagRepository.findOne({ where: { name: tagPayload.name, id: Not(id) } });
    if (conflictTag) {
      throw new BadRequestException(`Tag with name '${tagPayload.name}' already exists.`);
    }

    const existingTag = await this.linkTagRepository.findOne({ where: { id } });

    if (!existingTag) {
      throw new NotFoundException(`Tag with ID '${id}' not found`);
    }

    await this.linkTagRepository.save({
      id,
      name: tagPayload.name,
    });

    return await this.linkTagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.links', 'link')
      .select(['tag.id AS id', 'tag.name AS name'])
      .where('tag.id = :id', { id })
      .addSelect('COUNT(link.id) > 0', 'inUse')
      .groupBy('tag.id')
      .getRawOne();
  }

  async deleteTag(id: number): Promise<DeleteResponse> {
    const { inUse } = await this.linkTagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.links', 'link')
      .where('tag.id = :id', { id })
      .select('COUNT(link.id) > 0', 'inUse')
      .getRawOne<{ inUse: boolean }>();

    if (inUse) {
      throw new BadRequestException(`Tag with ID '${id}' is in use and cannot be deleted.`);
    }

    const deleteResult = await this.linkTagRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  // *** Import/Export Library ***
  async importLinkLibrary(file: Express.Multer.File): Promise<OperationResult> {
    if (!file || file.mimetype !== 'application/json') {
      throw new BadRequestException('Invalid file or filetype. Expected a JSON file.');
    }

    // Parse JSON File
    let parsed: unknown;
    try {
      parsed = JSON.parse(file.buffer.toString('utf-8'));
    } catch {
      throw new BadRequestException('Malformed JSON file.');
    }

    // Validate JSON file for link library structure
    const linkLibrary = plainToInstance(LinkLibraryDto, parsed);
    const errors = await validate(linkLibrary, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed for link library file',
        errors: flattenValidationErrors(errors),
      });
    }

    // Import Data
    const tags = linkLibrary.tags.map((tag) => ({ ...tag }));
    const categories = linkLibrary.categories.map((category) => ({ ...category }));

    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Clear Link Library Lists
      await queryRunner.manager.delete(LinkEntity, {});
      await queryRunner.manager.delete(LinkCategoryEntity, {});
      await queryRunner.manager.delete(LinkTagEntity, {});

      // Import Tags
      const dbTags = await queryRunner.manager.save(LinkTagEntity, tags);
      const tagMap = new Map<number, number>();
      linkLibrary.tags.forEach((oldTag) => tagMap.set(oldTag.id, dbTags.find((newTag) => newTag.name === oldTag.name).id));

      // Import Categories
      const dbCategories = await queryRunner.manager.save(LinkCategoryEntity, categories);
      const categoryMap = new Map<number, number>();
      linkLibrary.categories.forEach((oldCategory) =>
        categoryMap.set(oldCategory.id, dbCategories.find((newCategory) => newCategory.name === oldCategory.name).id)
      );

      // Import Links
      await queryRunner.manager.save(
        LinkEntity,
        linkLibrary.links.map((link) => ({
          ...link,
          icon: link.icon ?? '',
          category: { id: categoryMap.get(link.category) },
          tags: link.tags.map((tagId) => ({ id: tagMap.get(tagId) })),
        }))
      );

      await queryRunner.commitTransaction();
      return {
        success: true,
        message: 'Successfully imported link library',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async exportLinkLibrary(): Promise<string> {
    // Get Links to export
    const links: Link[] = await this.libraryLinkRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        icon: true,
        status: true,
        category: { id: true, name: true },
        tags: { id: true, name: true },
        sortKey: true,
        contrastBackground: true,
      },
      relations: { category: true, tags: true },
      order: { id: 'ASC' },
    });

    // Get Categories to export
    const categories: LinkCategory[] = await this.linkCategoryRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
      },
      order: { id: 'ASC' },
    });

    // Get Tags to export
    const tags: LinkTag[] = await this.linkTagRepository.find({
      select: { id: true, name: true },
      order: { id: 'ASC' },
    });

    const exportLibrary: LinkLibrary = {
      links: links.map((item) => ({
        ...item,
        icon: item.icon?.trim() || null, // Default empty icons to null
        category: item.category?.id ?? null, // Allow null category
        tags: item.tags.map((tag) => tag.id),
      })),
      categories,
      tags,
    };

    return JSON.stringify(exportLibrary, null, 2);
  }
}
