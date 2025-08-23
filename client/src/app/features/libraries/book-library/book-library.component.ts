import { Component } from '@angular/core';
import { MessageCardComponent } from '@hz/shared/components';


@Component({
  selector: 'hz-book-library',
  imports: [MessageCardComponent],
  templateUrl: './book-library.component.html',
  styleUrl: './book-library.component.scss',
})
export class BookLibraryComponent {}
