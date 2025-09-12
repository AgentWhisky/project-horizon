import { booleanAttribute, Component, ContentChild, ElementRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hz-card',
  imports: [CommonModule],
  templateUrl: './hz-card.component.html',
  styleUrl: './hz-card.component.scss',
})
export class HzCardComponent {
  readonly primary = input(false, { transform: booleanAttribute });

  @ContentChild('hz-card-header', { read: ElementRef }) cardHeader?: ElementRef;
  @ContentChild('hz-card-chip', { read: ElementRef }) cardChip?: ElementRef;
  @ContentChild('hz-card-body', { read: ElementRef }) cardBody?: ElementRef;

  get hasHeader(): boolean {
    return !!this.cardHeader;
  }

  get hasChip(): boolean {
    return !!this.cardChip;
  }

  get hasBody(): boolean {
    return !!this.cardBody;
  }
}
