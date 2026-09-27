import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Injectable, Input, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { LayoutService } from '../core/layout.service';

type RevealState = { seen: boolean; onFirst: (onScreen: boolean) => void; onEnter: () => void };

/** One shared IntersectionObserver for every [appReveal] element, as in the original design. */
@Injectable({ providedIn: 'root' })
class RevealObserver {
  private observer?: IntersectionObserver;
  private readonly states = new WeakMap<Element, RevealState>();

  observe(el: Element, state: RevealState): void {
    this.observer ??= new IntersectionObserver((entries) => this.handle(entries), {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08,
    });
    this.states.set(el, state);
    this.observer.observe(el);
  }

  unobserve(el: Element): void {
    this.observer?.unobserve(el);
    this.states.delete(el);
  }

  private handle(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      const state = this.states.get(entry.target);
      if (!state) continue;
      if (!state.seen) {
        state.seen = true;
        // Anything already on screen when the app boots was painted from the prerendered HTML —
        // re-hiding it would flash, so it simply stays put.
        const onScreen = entry.boundingClientRect.top < innerHeight && entry.boundingClientRect.bottom > 0;
        state.onFirst(onScreen);
        if (onScreen) {
          this.unobserve(entry.target);
          continue;
        }
      }
      if (entry.isIntersecting) {
        state.onEnter();
        this.unobserve(entry.target);
      }
    }
  }
}

const KEYFRAMES: Record<RevealVariant, Keyframe[]> = {
  up: [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }],
  fade: [{ opacity: 0 }, { opacity: 1 }],
};

type RevealVariant = 'up' | 'fade';

/**
 * Scroll-reveal, ported from the design's `data-reveal` attributes.
 * Usage: `appReveal="up"` or `appReveal="fade"`, with an optional `[revealDelay]` in ms.
 * Above-the-fold intro animations use the CSS `.reveal-*` utilities instead (see styles.css).
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  @Input('appReveal') variant: RevealVariant = 'up';
  @Input() revealDelay = 0;

  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly layout = inject(LayoutService);
  private readonly revealObserver = inject(RevealObserver);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    if (!this.isBrowser || this.layout.prefersReducedMotion()) return;

    let animation: Animation | undefined;
    this.revealObserver.observe(this.el, {
      seen: false,
      onFirst: (onScreen) => {
        if (onScreen) return;
        const reveal = this.el.animate(KEYFRAMES[this.variant], {
          duration: 900,
          delay: this.revealDelay,
          easing: 'cubic-bezier(.2,.7,.1,1)',
          fill: 'both',
        });
        reveal.pause();
        animation = reveal;
      },
      onEnter: () => animation?.play(),
    });
  }

  ngOnDestroy(): void {
    this.revealObserver.unobserve(this.el);
  }
}
