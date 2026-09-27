import { Directive, HostListener, Input, inject } from '@angular/core';
import { CursorService } from './cursor.service';

/** Sets the custom cursor's label while hovering this element, ported from `data-cursor="…"`. */
@Directive({ selector: '[appCursor]', standalone: true })
export class CursorLabelDirective {
  @Input('appCursor') label = '';

  private readonly cursor = inject(CursorService);

  @HostListener('mouseenter')
  onEnter(): void {
    this.cursor.label.set(this.label);
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.cursor.label.set('');
  }
}
