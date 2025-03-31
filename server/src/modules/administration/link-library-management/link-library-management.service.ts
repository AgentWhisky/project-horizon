import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkCategoryEntity } from 'src/entities/link-categories.entity';
import { LinkTagEntity } from 'src/entities/link-tags.entity';
import { LinkEntity } from 'src/entities/link.entity';
import { Repository } from 'typeorm';
import { Category, CategoryPayload, Link, LinkPayload, Tag, TagPayload } from './link-library-management.model';
import { DeleteResponse } from 'src/common/model/delete-response.model';

@Injectable()
export class LinkLibraryManagementService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly libraryLinkRepository: Repository<LinkEntity>,

    @InjectRepository(LinkCategoryEntity)
    private readonly linkCategoryRepository: Repository<LinkCategoryEntity>,

    @InjectRepository(LinkTagEntity)
    private readonly linkTagRepository: Repository<LinkTagEntity>
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

  // *** CATEGORY FUNCTIONS ***
  async getCategories(): Promise<Category[]> {
    const linkCategories: Category[] = await this.linkCategoryRepository
      .createQueryBuilder('category')
      .leftJoin(LinkEntity, 'link', 'link.categoryId = category.id')
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
      .leftJoin(LinkEntity, 'link', 'link.categoryId = category.id')
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
      .orderBy('tag.id', 'ASC')
      .getRawMany();

    return linkTags;
  }

  async addTag(tagPayload: TagPayload): Promise<Tag> {
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
    const existingTag = await this.linkTagRepository.findOne({ where: { id } });

    if (!existingTag) {
      throw new NotFoundException(`Tag with ID: ${id} not found`);
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
    const deleteResult = await this.linkTagRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }
}
