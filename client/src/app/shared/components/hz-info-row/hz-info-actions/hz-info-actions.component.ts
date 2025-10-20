import { Component, ContentChildren, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { HzInfoActionsDirective } from './hz-info-actions.directive';

@Component({
  selector: 'hz-info-actions',
  imports: [],
  templateUrl: './hz-info-actions.component.html',
  styleUrl: './hz-info-actions.component.scss',
})
export class HzInfoActionsComponent {
  @ContentChildren(HzInfoActionsDirective, { read: ElementRef })
  actionElements!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {}

  ngAfterContentInit(): void {
    this.actionElements.forEach((el) => this.renderer.addClass(el.nativeElement, 'icon-small'));
  }
}
