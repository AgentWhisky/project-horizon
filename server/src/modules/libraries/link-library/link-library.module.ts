import { Module } from '@nestjs/common';
import { LinkLibraryService } from './link-library.service';
import { LinkLibraryController } from './link-library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkEntity } from 'src/entities/link.entity';
import { LinkCategoryEntity } from 'src/entities/link-categories.entity';
import { LinkTagEntity } from 'src/entities/link-tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity, LinkCategoryEntity, LinkTagEntity])],
  controllers: [LinkLibraryController],
  providers: [LinkLibraryService],
})
export class LinkLibraryModule {}
