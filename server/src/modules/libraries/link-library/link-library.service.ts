import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from 'src/entities/link.entity';
import { IsNull, Not, Repository } from 'typeorm';
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
      where: { status: true, category: Not(IsNull()) },
      relations: { tags: true, category: true },
      order: { id: 'ASC' },
    });

    return links;
  }
}
