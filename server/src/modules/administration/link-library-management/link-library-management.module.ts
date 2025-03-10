import { Module } from '@nestjs/common';
import { LinkLibraryManagementService } from './link-library-management.service';
import { LinkLibraryManagementController } from './link-library-management.controller';
import { LinkEntity } from 'src/entities/link.entity';
import { LinkCategoryEntity } from 'src/entities/link-categories.entity';
import { LinkTagEntity } from 'src/entities/link-tags.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheUtils } from 'src/common/utils/cache.utils';

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity, LinkCategoryEntity, LinkTagEntity])],
  controllers: [LinkLibraryManagementController],
  providers: [LinkLibraryManagementService, CacheUtils],
})
export class LinkLibraryManagementModule {}
