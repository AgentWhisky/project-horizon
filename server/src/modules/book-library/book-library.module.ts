import { Module } from '@nestjs/common';
import { BookLibraryService } from './book-library.service';
import { BookLibraryController } from './book-library.controller';

@Module({
  controllers: [BookLibraryController],
  providers: [BookLibraryService],
})
export class BookLibraryModule {}
