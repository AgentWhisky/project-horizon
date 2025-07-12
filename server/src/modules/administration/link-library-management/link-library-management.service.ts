import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { LinkCategoryEntity } from 'src/entities/link-categories.entity';
import { LinkTagEntity } from 'src/entities/link-tags.entity';
import { LinkEntity } from 'src/entities/link.entity';
import { DataSource, EntityManager, Not, Repository } from 'typeorm';
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
import { DeleteResponse } from 'src/common/model/delete-response.model';
import { OperationResult } from 'src/common/model/operation-result.model';
import { MINOR_BASE, MINOR_LENGTH, MINOR_STEP } from 'src/common/constants/lexo-rank.constants';

@Injectable()
export class LinkLibraryManagementService {
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

  // *** LINK FUNCTIONS ***
  async getLinks(): Promise<Link[]> {
    const libaryLinks: Link[] = await this.libraryLinkRepository.find({
      select: {
        id: true,
        url: true,
        name: true,
        description: true,
        category: { id: true, name: true, description: true },
        tags: { id: true, name: true },
        sortKey: true,
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
      category: { id: linkPayload.category },
      tags: linkPayload.tags.map((tagId) => ({ id: tagId })),
      sortKey: linkPayload.sortKey || 'zzz',
    });

    return await this.libraryLinkRepository.findOne({
      select: {
        id: true,
        url: true,
        name: true,
        description: true,
        category: { id: true, name: true, description: true },
        tags: { id: true, name: true },
        sortKey: true,
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
      category: { id: linkPayload.category },
      tags: linkPayload.tags.map((tagId) => ({ id: tagId })),
      sortKey: linkPayload.sortKey || 'zzz',
    });

    return await this.libraryLinkRepository.findOne({
      select: {
        id: true,
        url: true,
        name: true,
        description: true,
        category: { id: true, name: true, description: true },
        tags: { id: true, name: true },
        sortKey: true,
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
        // Update current category and reset minor
        if (link.category.id !== currentCategory) {
          currentCategory = link.category.id;
          currentMinor = parseInt(MINOR_BASE, 36);
        }

        // Generate new sort key
        const major = link.category.id.toString().padStart(6, '0');
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
      throw new InternalServerErrorException(`Failed to rebase links: ${error.message}`);
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
      .orderBy('category.id', 'ASC')
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
  async importLinkLibrary(linkLibrary: LinkLibrary) {
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
          category: { id: categoryMap.get(link.category) },
          tags: link.tags.map((tagId) => ({ id: tagMap.get(tagId) })),
        }))
      );

      await queryRunner.commitTransaction();
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
        url: true,
        name: true,
        description: true,
        category: { id: true, name: true },
        tags: { id: true, name: true },
        sortKey: true,
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
        category: item.category.id,
        tags: item.tags.map((tag) => tag.id),
      })),
      categories,
      tags,
    };

    return JSON.stringify(exportLibrary, null, 2);
  }
}
