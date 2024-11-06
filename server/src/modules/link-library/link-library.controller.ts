import { Controller, Get } from '@nestjs/common';
import { LinkLibraryService } from './link-library.service';

@Controller('link-library')
export class LinkLibraryController {
  constructor(private readonly linkLibraryService: LinkLibraryService) {}

  @Get()
  getLinks() {
    return this.linkLibraryService.getLibraryLinks();
  }
}
