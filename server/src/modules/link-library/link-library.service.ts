import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryLinkEntity } from './entities/library-link.entity';
import { Repository } from 'typeorm';
import { LibraryLink } from './link-library.model';

@Injectable()
export class LinkLibraryService {
  constructor(
    @InjectRepository(LibraryLinkEntity)
    private readonly libraryLinkRepository: Repository<LibraryLinkEntity>
  ) {}

  async getLibraryLinks() {
    const libaryLinks: LibraryLink[] = await this.libraryLinkRepository.find({
      select: ['id', 'url', 'name', 'description', 'category', 'tags', 'thumbnail'],
    });

    return libaryLinks;
  }
}
