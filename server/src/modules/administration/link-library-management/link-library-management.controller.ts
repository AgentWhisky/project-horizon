import { Controller } from '@nestjs/common';
import { LinkLibraryManagementService } from './link-library-management.service';

@Controller('link-library-management')
export class LinkLibraryManagementController {
  constructor(private readonly linkLibraryManagementService: LinkLibraryManagementService) {}
}
