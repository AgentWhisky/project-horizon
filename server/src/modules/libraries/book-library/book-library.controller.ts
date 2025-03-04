import { Controller, Get } from '@nestjs/common';
import { BookLibraryService } from './book-library.service';

@Controller('book-library')
export class BookLibraryController {
  
  
  constructor(private readonly bookLibraryService: BookLibraryService) {}

  @Get()
  getBooks() {
    return this.bookLibraryService.getBooks();
  }
}
