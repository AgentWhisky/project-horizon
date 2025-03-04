import { Module } from '@nestjs/common';
import { LinkLibraryManagementService } from './link-library-management.service';
import { LinkLibraryManagementController } from './link-library-management.controller';

@Module({
  controllers: [LinkLibraryManagementController],
  providers: [LinkLibraryManagementService],
})
export class LinkLibraryManagementModule {}
