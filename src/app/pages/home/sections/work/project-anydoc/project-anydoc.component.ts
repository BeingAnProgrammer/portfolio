import { isPlatformBrowser } from '@angular/common';
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
  viewChild,
} from '@angular/core';
import { CaseStudyService } from '../../../../../core/case-study.service';
import { LayoutService } from '../../../../../core/layout.service';
import { ANYDOC_STEPS, Project } from '../../../../../data/portfolio.data';
import { CursorLabelDirective } from '../../../../../shared/cursor-label.directive';
import { MagneticDirective } from '../../../../../shared/magnetic.directive';
import { RevealDirective } from '../../../../../shared/reveal.directive';
import { visibleTicker } from '../../../../../shared/visible-ticker';

@Component({
  selector: 'app-project-anydoc',
  standalone: true,
  imports: [RevealDirective, MagneticDirective, CursorLabelDirective],
  templateUrl: './project-anydoc.component.html',
  styleUrl: './project-anydoc.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAnydocComponent {
  readonly project = input.required<Project>();

  protected readonly layout = inject(LayoutService);
  private readonly caseStudy = inject(CaseStudyService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostEl = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly sliderEl = viewChild<ElementRef<HTMLElement>>('slider');

  private readonly stage = signal(0);
  protected readonly steps = computed(() =>
    ANYDOC_STEPS.map((step, i) => ({ ...step, state: i === this.stage() ? 'active' : i < this.stage() ? 'done' : 'pending' })),
  );

  /** Kept as data: template whitespace collapsing would otherwise squash the column padding. */
  protected readonly markdownTable = ['| Region | Q1  | Q2  |', '|--------|-----|-----|', '| North  | 1.2 | 1.4 |', '| South  | 0.9 | 1.1 |'];

  protected readonly split = signal(52);
  private dragging = false;

  constructor() {
    if (this.isBrowser) afterNextRender(() => this.setupVisibilityGatedStage());
  }

  openCaseStudy(): void {
    this.caseStudy.open(this.project().id);
  }

  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    this.updateSplitFromEvent(event);
  }

  onPointerMove(event: PointerEvent): void {
    if (this.dragging) this.updateSplitFromEvent(event);
  }

  onPointerUp(): void {
    this.dragging = false;
  }

  onHandleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.split.update((v) => Math.max(0, v - 5));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.split.update((v) => Math.min(100, v + 5));
    }
  }

  private updateSplitFromEvent(event: PointerEvent): void {
    const el = this.sliderEl()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const value = ((event.clientX - rect.left) / rect.width) * 100;
    this.split.set(Math.max(0, Math.min(100, value)));
  }

  private setupVisibilityGatedStage(): void {
    if (this.layout.prefersReducedMotion()) return;
    this.destroyRef.onDestroy(visibleTicker(this.hostEl, 1500, () => this.stage.update((v) => (v + 1) % ANYDOC_STEPS.length)));
  }
}
