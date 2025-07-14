import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from 'src/entities/link.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Link, LinkCategory, LinkTag } from './link-library.model';
import { LinkCategoryEntity } from 'src/entities/link-categories.entity';
import { LinkTagEntity } from 'src/entities/link-tags.entity';

@Injectable()
export class LinkLibraryService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly linkRepository: Repository<LinkEntity>,

    @InjectRepository(LinkCategoryEntity)
    private readonly categoryRepository: Repository<LinkCategoryEntity>,

    @InjectRepository(LinkTagEntity)
    private readonly tagRepository: Repository<LinkTagEntity>
  ) {}

  async getLinks(search: string, category: string, tags: string): Promise<Link[]> {
    const links: Link[] = await this.linkRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        icon: true,
        tags: { id: true, name: true },
        category: { id: true, name: true, description: true },
        sortKey: true,
      },
      where: { status: true, category: Not(IsNull()) },
      relations: { tags: true, category: true },
      order: { name: 'ASC' },
    });

    if (search) {
      const keywords = search
        .split(/[\s,]+/)
        .map((kw) => kw.trim().toLowerCase())
        .filter(Boolean);

      // Filter by name and description
    }

    if (category) {
      // Filter by category
    }

    if (tags) {
      // Filter by tags
    }

    return links;
  }

  async getCategories(): Promise<LinkCategory[]> {
    const categories: LinkCategory[] = await this.categoryRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
      },
      order: { name: 'ASC' },
    });

    return categories;
  }

  async getTags() {
    const tags: LinkTag[] = await this.tagRepository.find({
      select: {
        id: true,
        name: true,
      },
      order: { name: 'ASC' },
    });

    return tags;
  }
}
