import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

/**
 * Scroll-spy used for both the home nav rail and the resume table of contents.
 * Only one page tracks sections at a time, so a single root instance is reused across routes.
 */
@Injectable({ providedIn: 'root' })
export class ActiveSectionService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  readonly activeId = signal('');

  track(ids: string[], rootMargin = '-45% 0px -50% 0px'): void {
    this.stop();
    if (!ids.length) return;
    this.activeId.set(ids[0]);
    if (!this.isBrowser) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.activeId.set(entry.target.id);
        }
      },
      { rootMargin },
    );
    for (const id of ids) {
      const el = this.doc.getElementById(id);
      if (el) this.observer.observe(el);
    }
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
