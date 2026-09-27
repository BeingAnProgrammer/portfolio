import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';

const FORMATTER = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

/** Current time in Chennai (IST), shown in the nav rail's "(BASED)" line. */
@Injectable({ providedIn: 'root' })
export class ClockService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  readonly time = signal('');

  constructor() {
    if (!this.isBrowser) return;
    afterNextRender(() => {
      const update = () => this.time.set(FORMATTER.format(new Date()));
      update();
      const id = setInterval(update, 15000);
      this.destroyRef.onDestroy(() => clearInterval(id));
    });
  }
}
