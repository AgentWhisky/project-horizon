import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkEntity } from 'src/entities/link.entity';
import { Repository } from 'typeorm';
import { Link } from './link-library.model';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class LinkLibraryService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly libraryLinkRepository: Repository<LinkEntity>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getLibraryLinks() {
    const libaryLinks: Link[] = await this.libraryLinkRepository.find({
      select: ['id', 'url', 'name', 'description', 'category', 'thumbnail'],
      relations: ['category', 'tags'],
      order: { id: 'ASC' },
    });

    return libaryLinks;
  }
}
