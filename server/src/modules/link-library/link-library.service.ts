import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LinkEntity } from "./entities/link.entity";
import { Repository } from "typeorm";
import { Link } from "./link-library.model";

@Injectable()
export class LinkLibraryService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly libraryLinkRepository: Repository<LinkEntity>
  ) {}

  async getLibraryLinks() {
    const libaryLinks: Link[] = await this.libraryLinkRepository.find({
      select: ["id", "url", "name", "description", "category", "thumbnail"],
      relations: ["tags"],
    });

    return libaryLinks;
  }
}
