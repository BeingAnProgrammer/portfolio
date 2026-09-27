import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';

const RAIL_STORAGE_KEY = 'rvnk-rail';
const MOBILE_QUERY = '(max-width: 900px)';
const RAIL_OPEN_RESERVED = 308;
const RAIL_CLOSED_RESERVED = 88;
const COMPACT_CONTENT_WIDTH = 900;

/**
 * Responsive/motion state. Values are read synchronously in the browser so class/style bindings are
 * correct from the hydration pass. Anything that changes *structure* (@if/@for) must also wait for
 * `hydrated()`, otherwise the client render wouldn't match the prerendered HTML.
 * Rail open/closed is mirrored onto `<html data-rail>` (set pre-paint by an inline script in index.html)
 * so CSS can lay out the rail before Angular boots.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly hydrated = signal(false);
  readonly railOpen = signal(true);
  readonly isMobile = signal(false);
  readonly isShort = signal(false);
  readonly isCompact = signal(false);
  readonly isFinePointer = signal(false);
  readonly prefersReducedMotion = signal(false);
  readonly viewportWidth = signal(1280);

  constructor() {
    if (!this.isBrowser) return;
    this.railOpen.set(this.doc.documentElement.dataset['rail'] !== 'closed');
    this.listen();
    afterNextRender(() => this.hydrated.set(true));
  }

  toggleRail(): void {
    const open = !this.railOpen();
    this.railOpen.set(open);
    this.doc.documentElement.dataset['rail'] = open ? 'open' : 'closed';
    try {
      localStorage.setItem(RAIL_STORAGE_KEY, open ? 'open' : 'closed');
    } catch {
      /* storage unavailable (private mode) — preference just won't persist */
    }
    this.measure();
  }

  private listen(): void {
    const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const fineQuery = matchMedia('(pointer: fine)');
    const mobileQuery = matchMedia(MOBILE_QUERY);

    const update = () => {
      this.prefersReducedMotion.set(reduceQuery.matches);
      this.isFinePointer.set(fineQuery.matches && !reduceQuery.matches);
      this.isMobile.set(mobileQuery.matches);
      this.measure();
    };
    update();

    for (const query of [reduceQuery, fineQuery, mobileQuery]) query.addEventListener('change', update);
    addEventListener('resize', this.measure, { passive: true });
    this.destroyRef.onDestroy(() => {
      for (const query of [reduceQuery, fineQuery, mobileQuery]) query.removeEventListener('change', update);
      removeEventListener('resize', this.measure);
    });
  }

  private readonly measure = (): void => {
    const width = innerWidth;
    this.viewportWidth.set(width);
    this.isShort.set(innerHeight < 720);
    const mobile = matchMedia(MOBILE_QUERY).matches;
    const reserved = mobile ? 0 : this.railOpen() ? RAIL_OPEN_RESERVED : RAIL_CLOSED_RESERVED;
    this.isCompact.set(width - reserved < COMPACT_CONTENT_WIDTH);
  };
}
