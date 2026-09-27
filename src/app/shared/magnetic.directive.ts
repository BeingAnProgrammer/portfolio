import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Directive, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { LayoutService } from '../core/layout.service';

/**
 * Subtle mouse-follow effect for primary CTAs, ported from the design's `data-magnetic` buttons.
 * Uses raw listeners (not @HostListener) so pointer movement never schedules change detection.
 */
@Directive({ selector: '[appMagnetic]', standalone: true })
export class MagneticDirective {
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const el: HTMLElement = inject(ElementRef).nativeElement;
    const layout = inject(LayoutService);

    // The element's own CSS transition (hover colours), kept when we add the spring-back.
    let baseTransition: string | undefined;
    const onMove = (event: MouseEvent) => {
      if (!layout.isFinePointer()) return;
      baseTransition ??= getComputedStyle(el).transition;
      const rect = el.getBoundingClientRect();
      el.style.transition = baseTransition;
      el.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.22}px,${(event.clientY - rect.top - rect.height / 2) * 0.3}px)`;
    };
    const onLeave = () => {
      if (baseTransition === undefined) return;
      el.style.transition = `${baseTransition}, transform .5s cubic-bezier(.2,.7,.1,1)`;
      el.style.transform = '';
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    inject(DestroyRef).onDestroy(() => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    });
  }
}
