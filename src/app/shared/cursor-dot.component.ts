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
import { LayoutService } from '../core/layout.service';
import { CursorService } from './cursor.service';

const FOLLOW = 0.2;
const SETTLED_PX = 0.1;

/**
 * Custom cursor for fine pointers. Visibility is pure CSS (so it's never in the hydration diff),
 * and the follow loop writes the transform directly and stops once the dot catches up,
 * so it costs nothing while the mouse is still.
 */
@Component({
  selector: 'app-cursor-dot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #dot class="cursor-dot" [class.labeled]="!!cursor.label()" aria-hidden="true">
      <span>{{ cursor.label() }}</span>
    </div>
  `,
  styles: `
    .cursor-dot {
      position: fixed;
      left: 0;
      top: 0;
      width: 10px;
      height: 10px;
      margin: -5px 0 0 -5px;
      border-radius: 50%;
      background: var(--accent);
      pointer-events: none;
      z-index: 90;
      display: none;
      align-items: center;
      justify-content: center;
      color: var(--paper);
      font: 500 11px var(--font-mono);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      transform: translate3d(-100px, -100px, 0);
      transition: width 0.35s var(--ease-out), height 0.35s var(--ease-out), margin 0.35s var(--ease-out);
      will-change: transform;
    }

    @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
      .cursor-dot {
        display: flex;
      }
    }

    .cursor-dot.labeled {
      width: 76px;
      height: 76px;
      margin: -38px 0 0 -38px;
    }
  `,
})
export class CursorDotComponent {
  protected readonly cursor = inject(CursorService);
  private readonly layout = inject(LayoutService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) afterNextRender(() => this.follow());
  }

  private follow(): void {
    if (!this.layout.isFinePointer()) return;
    const el = this.dot().nativeElement;
    let x = -100, y = -100, targetX = -100, targetY = -100;
    let rafId = 0;

    const step = () => {
      x += (targetX - x) * FOLLOW;
      y += (targetY - y) * FOLLOW;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
      rafId = Math.abs(targetX - x) + Math.abs(targetY - y) > SETTLED_PX ? requestAnimationFrame(step) : 0;
    };
    const onMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!rafId) rafId = requestAnimationFrame(step);
    };

    addEventListener('mousemove', onMove, { passive: true });
    this.destroyRef.onDestroy(() => {
      removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    });
  }
}
