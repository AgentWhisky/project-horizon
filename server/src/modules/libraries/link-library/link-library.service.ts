import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from 'src/entities/link.entity';
import { Repository } from 'typeorm';
import { Link } from './link-library.model';

@Injectable()
export class LinkLibraryService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly libraryLinkRepository: Repository<LinkEntity>
  ) {}

  async getLibraryLinks() {
    const links: Link[] = await this.libraryLinkRepository.find({
      select: {
        id: true,
        url: true,
        name: true,
        description: true,
        tags: { id: true, name: true },
        category: { id: true, name: true, description: true },
        sortKey: true,
      },
      where: { status: 'A' },
      relations: { tags: true, category: true },
      order: { id: 'ASC' },
    });

    const categories = Array.from(new Set(links.map((link) => link.category.name))).sort();
    const tags = Array.from(new Set(links.flatMap((link) => link.tags.map((tag) => tag.name)))).sort();

    return {
      links,
      categories,
      tags,
    };
  }
}
