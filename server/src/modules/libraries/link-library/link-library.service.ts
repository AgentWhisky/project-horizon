import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from './entities/link.entity';
import { In, Repository } from 'typeorm';
import { Link, LinkCategory, LinkCategoryCode, LinkCategoryData, LinkData, LinkTag, LinkTagCode, LinkTagData } from './link-library.model';
import { LinkCategoryEntity } from './entities/link-categories.entity';
import { LinkTagEntity } from './entities/link-tags.entity';

@Injectable()
export class LinkLibraryService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly libraryLinkRepository: Repository<LinkEntity>,

    @InjectRepository(LinkCategoryEntity)
    private readonly linkCategoryRepository: Repository<LinkCategoryEntity>,

    @InjectRepository(LinkTagEntity)
    private readonly linkTagRepository: Repository<LinkTagEntity>
  ) {}

  // *** Link DB Functions ***
  async getLibraryLinks() {
    const libaryLinks: Link[] = await this.libraryLinkRepository.find({
      select: ['id', 'url', 'name', 'description', 'category', 'thumbnail'],
      relations: ['category', 'tags'],
    });

    return libaryLinks.sort((a, b) => a.id - b.id);
  }

  async addLibraryLink(link: LinkData) {
    const newLink = await this.libraryLinkRepository.save({
      name: link.name,
      description: link.description,
      url: link.url,
      category: { id: link.category },
      tags: link.tags.map((tagId) => ({ id: tagId })),
    });

    return await this.libraryLinkRepository.findOne({
      select: ['id', 'url', 'name', 'description', 'category', 'thumbnail'],
      where: { id: newLink.id },
      relations: ['category', 'tags'],
    });
  }

  async updateLibraryLink(id: number, link: LinkData) {
    const existingLink = await this.libraryLinkRepository.findOne({ where: { id } });

    if (!existingLink) {
      throw new HttpException(`Link with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.libraryLinkRepository.save({
      id,
      name: link.name,
      description: link.description,
      url: link.url,
      category: { id: link.category },
      tags: link.tags.map((tagId) => ({ id: tagId })),
    });

    return await this.libraryLinkRepository.findOne({
      select: ['id', 'url', 'name', 'description', 'category', 'thumbnail'],
      where: { id },
      relations: ['category', 'tags'],
    });
  }

  async deleteLibraryLink(id: number) {
    const deleteResult = await this.libraryLinkRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  // *** Link Category DB Functions ***
  async getLinkCategories() {
    const linkCategories: LinkCategoryCode[] = await this.linkCategoryRepository
      .createQueryBuilder('category')
      .leftJoin(LinkEntity, 'link', 'link.categoryId = category.id')
      .select(['category.id AS id', 'category.name AS name', 'category.description AS description'])
      .addSelect('COUNT(link.id) > 0', 'inUse')
      .groupBy('category.id')
      .getRawMany();

    return linkCategories.sort((a, b) => a.id - b.id);
  }

  async addLinkCategory(category: LinkCategoryData) {
    const newCategory = await this.linkCategoryRepository.save({
      name: category.name,
      description: category.description,
    });

    const categoryRecord = await this.linkCategoryRepository.findOne({
      select: ['id', 'name', 'description'],
      where: { id: newCategory.id },
    });

    return {
      ...categoryRecord,
      isUsed: false,
    };
  }

  async updateLinkCategory(id: number, category: LinkCategoryData) {
    const existingCategory = await this.linkCategoryRepository.findOne({ where: { id } });

    if (!existingCategory) {
      throw new HttpException(`Category with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.linkCategoryRepository.save({
      id,
      name: category.name,
      description: category.description,
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

  async deleteLinkCategory(id: number) {
    const deleteResult = await this.linkCategoryRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  // *** Link Tag DB Functions ***
  async getLinkTags() {
    //const linkTags: LinkTag[] = await this.linkTagRepository.find();

    const linkTags: LinkTagCode[] = await this.linkTagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.links', 'link')
      .select(['tag.id AS id', 'tag.name AS name'])
      .addSelect('COUNT(link.id) > 0', 'inUse')
      .groupBy('tag.id')
      .getRawMany();

    return linkTags.sort((a, b) => a.id - b.id);
  }

  async addLinkTag(tag: LinkTagData) {
    const newtag = await this.linkTagRepository.save({
      name: tag.name,
    });

    const tagRecord = await this.linkTagRepository.findOne({
      select: ['id', 'name'],
      where: { id: newtag.id },
    });

    return {
      ...tagRecord,
      isUsed: false,
    };
  }

  async updateLinkTag(id: number, tag: LinkTagData) {
    const existingTag = await this.linkTagRepository.findOne({ where: { id } });

    if (!existingTag) {
      throw new HttpException(`Tag with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.linkTagRepository.save({
      id,
      name: tag.name,
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

  async deleteLinkTag(id: number) {
    const deleteResult = await this.linkTagRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }
}
