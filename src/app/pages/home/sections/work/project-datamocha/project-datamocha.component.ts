import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CaseStudyService } from '../../../../../core/case-study.service';
import { LayoutService } from '../../../../../core/layout.service';
import { DATAMOCHA_AGENTS, DATAMOCHA_BARS, DATAMOCHA_PIPELINE, Project } from '../../../../../data/portfolio.data';
import { CursorLabelDirective } from '../../../../../shared/cursor-label.directive';
import { onScrollFrame } from '../../../../../shared/on-scroll-frame';
import { RevealDirective } from '../../../../../shared/reveal.directive';
import { visibleTicker } from '../../../../../shared/visible-ticker';

@Component({
  selector: 'app-project-datamocha',
  standalone: true,
  imports: [RevealDirective, CursorLabelDirective, NgTemplateOutlet],
  templateUrl: './project-datamocha.component.html',
  styleUrl: './project-datamocha.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDatamochaComponent {
  readonly project = input.required<Project>();

  protected readonly layout = inject(LayoutService);
  private readonly caseStudy = inject(CaseStudyService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostEl = inject(ElementRef<HTMLElement>).nativeElement;

  private readonly stage = signal(0);

  /** Structural switch, so it waits for hydration — the prerendered HTML is always the wide layout. */
  protected readonly compact = computed(() => this.layout.hydrated() && this.layout.isCompact());

  protected readonly agents = computed(() => DATAMOCHA_AGENTS.map((a, i) => ({ ...a, active: i === this.stage() })));

  protected readonly pipeline = computed(() =>
    DATAMOCHA_PIPELINE.map((label, i) => ({
      label,
      n: String(i + 1).padStart(2, '0'),
      active: i === this.stage(),
      done: i <= this.stage(),
    })),
  );

  protected readonly bars = computed(() => {
    const stage = this.stage();
    const reduce = this.layout.prefersReducedMotion();
    return DATAMOCHA_BARS.map((hh, i) => {
      const forecast = i >= 9;
      const wobble = reduce ? 0 : ((stage + i) % 5) * 2;
      return { heightPct: hh - wobble, forecast };
    });
  });

  constructor() {
    if (this.isBrowser) {
      afterNextRender(() => {
        this.setupStageTicker();
        this.setupParallax();
      });
    }
  }

  openCaseStudy(): void {
    this.caseStudy.open(this.project().id);
  }

  private setupStageTicker(): void {
    if (this.layout.prefersReducedMotion()) return;
    this.destroyRef.onDestroy(visibleTicker(this.hostEl, 1500, () => this.stage.update((v) => (v + 1) % 5)));
  }

  /** All `[data-par]` cards share one canvas parent; each just scales the same scroll offset by its own factor. */
  private setupParallax(): void {
    if (this.layout.prefersReducedMotion()) return;
    let elements: HTMLElement[] = [];
    const stop = onScrollFrame(() => {
      // Re-query after the wide/compact layout swap replaces the cards.
      if (!elements[0]?.isConnected) elements = [...this.hostEl.querySelectorAll('[data-par]')] as HTMLElement[];
      const canvasRect = elements[0]?.parentElement?.getBoundingClientRect();
      if (!canvasRect) return;
      const h = innerHeight;
      if (canvasRect.bottom < -200 || canvasRect.top > h + 200) return;
      const offset = -(canvasRect.top + canvasRect.height / 2 - h / 2);
      for (const el of elements) {
        const factor = Number(el.dataset['par']);
        const translate = Math.max(-40, Math.min(40, offset * factor));
        el.style.translate = `0 ${translate.toFixed(1)}px`;
      }
    });
    this.destroyRef.onDestroy(stop);
  }
}
