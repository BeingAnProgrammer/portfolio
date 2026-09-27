import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { LayoutService } from '../../../../core/layout.service';
import { MARQUEE_ITEMS } from '../../../../data/portfolio.data';
import { MagneticDirective } from '../../../../shared/magnetic.directive';
import { onScrollFrame } from '../../../../shared/on-scroll-frame';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MagneticDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly marqueeLoop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  private readonly heroRef = viewChild.required<ElementRef<HTMLElement>>('hero');
  private readonly heroTextRef = viewChild.required<ElementRef<HTMLElement>>('heroText');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    afterNextRender(() => {
      this.followPointer();
      this.setupParallax();
    });
  }

  /** Moves the grid spotlight with the pointer. A raw listener: nothing here needs change detection. */
  private followPointer(): void {
    const el = this.heroRef().nativeElement;
    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    this.destroyRef.onDestroy(() => el.removeEventListener('mousemove', onMove));
  }

  private setupParallax(): void {
    if (this.layout.prefersReducedMotion()) return;
    const el = this.heroTextRef().nativeElement;
    const stop = onScrollFrame(() => {
      const y = scrollY;
      const h = innerHeight;
      if (y >= h * 1.2) return;
      el.style.transform = `translateY(${y * -0.12}px)`;
      el.style.opacity = `${Math.max(0, 1 - y / (h * 0.9))}`;
    });
    this.destroyRef.onDestroy(stop);
  }
}
