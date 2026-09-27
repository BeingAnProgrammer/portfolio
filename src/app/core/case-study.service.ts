import { Injectable, computed, signal } from '@angular/core';
import { PROJECTS } from '../data/portfolio.data';

/** Case-study overlay state, opened from any project card on the home page. */
@Injectable({ providedIn: 'root' })
export class CaseStudyService {
  private readonly openIdSignal = signal<string | null>(null);
  readonly openId = this.openIdSignal.asReadonly();

  readonly project = computed(() => PROJECTS.find((p) => p.id === this.openIdSignal()) ?? null);

  readonly nextProject = computed(() => {
    const index = PROJECTS.findIndex((p) => p.id === this.openIdSignal());
    return index < 0 ? null : PROJECTS[(index + 1) % PROJECTS.length];
  });

  open(id: string): void {
    this.openIdSignal.set(id);
  }

  close(): void {
    this.openIdSignal.set(null);
  }
}
