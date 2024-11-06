import { Module } from '@nestjs/common';
import { LinkLibraryService } from './link-library.service';
import { LinkLibraryController } from './link-library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryLinkEntity } from './entities/library-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryLinkEntity])],
  controllers: [LinkLibraryController],
  providers: [LinkLibraryService],
})
export class LinkLibraryModule {}
