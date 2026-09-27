import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CaseStudyService } from '../../../../../core/case-study.service';
import { LayoutService } from '../../../../../core/layout.service';
import { MEETING_QUOTES, Project } from '../../../../../data/portfolio.data';
import { CursorLabelDirective } from '../../../../../shared/cursor-label.directive';
import { RevealDirective } from '../../../../../shared/reveal.directive';
import { visibleTicker } from '../../../../../shared/visible-ticker';

const SEGMENTS: [number, number][] = [[0, 28], [29, 58], [59, 90], [91, 119]];
const MARK_POSITIONS = [40, 68, 88];

@Component({
  selector: 'app-project-koriva',
  standalone: true,
  imports: [RevealDirective, CursorLabelDirective],
  templateUrl: './project-koriva.component.html',
  styleUrl: './project-koriva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectKorivaComponent {
  readonly project = input.required<Project>();

  protected readonly quotes = MEETING_QUOTES;
  protected readonly marks = MARK_POSITIONS;

  private readonly layout = inject(LayoutService);
  private readonly caseStudy = inject(CaseStudyService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostEl = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly quoteEl = viewChild<ElementRef<HTMLElement>>('quoteEl');

  private readonly tick = signal(0);
  protected readonly quoteIndex = computed(() => Math.floor(this.tick() / 3) % this.quotes.length);
  protected readonly quote = computed(() => this.quotes[this.quoteIndex()]);
  // Changes the @for length, so it waits for hydration to keep the prerendered markup matching.
  protected readonly barCount = computed(() => (this.layout.hydrated() && this.layout.isCompact() ? 60 : 120));

  protected readonly bars = computed(() => {
    const q = this.quoteIndex();
    const barCount = this.barCount();
    const scale = barCount / 120;
    const segments = SEGMENTS.map(([x, y]) => [Math.round(x * scale), Math.round(y * scale)]);
    const markPos = (this.marks[q] * barCount) / 100;
    const activeSegment = segments.findIndex(([x, y]) => markPos >= x && markPos <= y);
    return Array.from({ length: barCount }, (_, j) => {
      const i = j / scale;
      const height = 18 + 72 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.113)) + 8 * Math.sin(i * 1.7);
      const segment = segments.findIndex(([x, y]) => j >= x && j <= y);
      const color =
        segment === activeSegment
          ? 'oklch(0.5 0.2 300)'
          : j < markPos
            ? 'rgba(21,20,18,.5)'
            : 'rgba(21,20,18,.16)';
      return { heightPct: Math.max(8, Math.min(100, height)), color };
    });
  });

  protected readonly markLines = computed(() =>
    this.marks.map((left, i) => ({ left, active: i === this.quoteIndex() })),
  );

  protected readonly cards = computed(() =>
    this.quotes.map((quote, i) => ({
      kind: quote.kind,
      text: quote.card,
      meta: quote.meta,
      active: i === this.quoteIndex(),
    })),
  );

  private skipFirstQuoteAnimation = true;

  constructor() {
    effect(() => {
      this.quoteIndex();
      if (!this.isBrowser || this.layout.prefersReducedMotion()) return;
      if (this.skipFirstQuoteAnimation) {
        this.skipFirstQuoteAnimation = false;
        return;
      }
      this.quoteEl()?.nativeElement.animate(
        [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 700, easing: 'cubic-bezier(.2,.7,.1,1)' },
      );
    });

    if (this.isBrowser) afterNextRender(() => this.setupVisibilityGatedTicker());
  }

  openCaseStudy(): void {
    this.caseStudy.open(this.project().id);
  }

  private setupVisibilityGatedTicker(): void {
    if (this.layout.prefersReducedMotion()) return;
    this.destroyRef.onDestroy(visibleTicker(this.hostEl, 1500, () => this.tick.update((v) => v + 1)));
  }
}
