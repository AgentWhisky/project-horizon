import { Component } from '@angular/core';
import { MessageCardComponent } from '../../../shared/components/message-card/message-card.component';

@Component({
  selector: 'hz-book-library',
  imports: [MessageCardComponent],
  templateUrl: './book-library.component.html',
  styleUrl: './book-library.component.scss',
})
export class BookLibraryComponent {}
