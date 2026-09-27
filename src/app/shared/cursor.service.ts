import { Injectable, signal } from '@angular/core';

/** Label shown inside the custom cursor dot while hovering an `[appCursor]` element. */
@Injectable({ providedIn: 'root' })
export class CursorService {
  readonly label = signal('');
}
