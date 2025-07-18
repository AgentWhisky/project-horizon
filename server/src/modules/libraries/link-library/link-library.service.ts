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

  async getLinks(search?: string, name?: string, category?: string): Promise<Link[]> {
    let links: Link[] = await this.linkRepository.find({
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

    // Filter by search keywords
    if (search) {
      const keywords = search
        .split(/[\s,]+/)
        .map((kw) => kw.trim().toLowerCase())
        .filter(Boolean);

      links = links.filter((link) =>
        keywords.every((keyword) => {
          return (
            link.name.toLowerCase().includes(keyword) ||
            link.description?.toLowerCase().includes(keyword) ||
            link.category.name.toLowerCase().includes(keyword) ||
            link.category.description?.toLowerCase().includes(keyword) ||
            link.tags.some((tag) => tag.name.toLowerCase().includes(keyword))
          );
        })
      );
    }

    // Filter by name
    if (name) {
      links = links.filter((link) => link.name.toLowerCase().includes(name.toLowerCase()));
    }

    // Filter by category
    if (category) {
      links = links.filter((link) => link.category?.name.toLowerCase().includes(category.toLowerCase()));
    }

    return links;
  }

  async getCategories(name: string): Promise<LinkCategory[]> {
    let categories: LinkCategory[] = await this.categoryRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
      },
      order: { name: 'ASC' },
    });

    // Filter by name
    if (name) {
      categories = categories.filter((category) => category.name.toLowerCase().includes(name.toLowerCase()));
    }

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
