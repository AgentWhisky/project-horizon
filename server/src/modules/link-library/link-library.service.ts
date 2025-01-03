import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from './entities/link.entity';
import { In, Repository } from 'typeorm';
import { Link, LinkCategory, LinkData, LinkTag } from './link-library.model';
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

  // *** CRUD OPERATIONS ***
  async getLibraryLinks() {
    const libaryLinks: Link[] = await this.libraryLinkRepository.find({
      select: ['id', 'url', 'name', 'description', 'category', 'thumbnail'],
      relations: ['category', 'tags'],
    });

    return libaryLinks;
  }

  async updateLibraryLink(id: number, link: LinkData) {
    const existingLink = await this.libraryLinkRepository.findOne({ where: { id } });

    if (existingLink) {
      console.log('LINK EXISTS');
    } else {
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

  // *** GET DROPDOWN CODES ***
  async getCategories() {
    const linkCategories: LinkCategory[] = await this.linkCategoryRepository.find();

    return linkCategories.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTags() {
    const linkTags: LinkTag[] = await this.linkTagRepository.find();

    return linkTags.sort((a, b) => a.name.localeCompare(b.name));
  }
}
