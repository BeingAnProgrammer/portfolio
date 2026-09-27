import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CaseStudyService } from '../../../../core/case-study.service';
import { LayoutService } from '../../../../core/layout.service';
import { onScrollFrame } from '../../../../shared/on-scroll-frame';

@Component({
  selector: 'app-case-study-overlay',
  standalone: true,
  templateUrl: './case-study-overlay.component.html',
  styleUrl: './case-study-overlay.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudyOverlayComponent {
  protected readonly caseStudy = inject(CaseStudyService);
  private readonly layout = inject(LayoutService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly closeButtonRef = viewChild<ElementRef<HTMLElement>>('closeButton');
  private readonly fillRef = viewChild<ElementRef<HTMLElement>>('archFill');

  protected readonly archSteps = computed(() => {
    const project = this.caseStudy.project();
    if (!project) return [];
    return project.arch.length
      ? project.arch
      : [{ title: 'Product → UX → Frontend → SEO', detail: 'An end-to-end independent build' }];
  });

  protected readonly isNarrow = computed(() => this.layout.viewportWidth() < 760);
  protected readonly isRowFlow = computed(() => !this.isNarrow() && this.archSteps().length <= 5);

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  private lastFocused: HTMLElement | null = null;
  private readonly injector = inject(Injector);
  private scrollCleanup?: () => void;

  constructor() {
    effect(() => {
      const project = this.caseStudy.project();
      if (!this.isBrowser) return;

      if (project) {
        // Only remember the trigger on first open — "Next project" re-runs this with the dialog already up.
        this.lastFocused ??= document.activeElement as HTMLElement | null;
        document.body.style.overflow = 'hidden';
        afterNextRender(
          () => {
            this.closeButtonRef()?.nativeElement.focus({ preventScroll: true });
            this.dialogRef()?.nativeElement.scrollTo({ top: 0 });
            this.playEntrance();
          },
          { injector: this.injector },
        );
      } else {
        document.body.style.overflow = '';
        this.scrollCleanup?.();
        this.lastFocused?.focus({ preventScroll: true });
        this.lastFocused = null;
      }
    });

    if (this.isBrowser) {
      const onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.caseStudy.openId()) this.close();
      };
      addEventListener('keydown', onKeydown);
      this.destroyRef.onDestroy(() => {
        removeEventListener('keydown', onKeydown);
        this.scrollCleanup?.();
        // Leaving the page (e.g. browser back) must not leave the overlay "open" or the page scroll-locked.
        this.caseStudy.close();
        document.body.style.overflow = '';
      });
    }
  }

  close(): void {
    this.caseStudy.close();
  }

  next(): void {
    const nextProject = this.caseStudy.nextProject();
    if (nextProject) this.caseStudy.open(nextProject.id);
  }

  private playEntrance(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) return;

    if (!this.isRowFlow()) this.setupZigScrollProgress(dialog);
    if (this.layout.prefersReducedMotion()) return;

    dialog.animate([{ opacity: 0, transform: 'translateY(48px)' }, { opacity: 1, transform: 'none' }], {
      duration: 700,
      easing: 'cubic-bezier(.2,.7,.1,1)',
    });

    const items = Array.from(dialog.querySelectorAll<HTMLElement>('[data-arch-item]'));
    items.forEach((el, i) => {
      el.animate([{ opacity: 0, transform: 'translateX(-16px)' }, { opacity: 1, transform: 'none' }], {
        duration: 600,
        delay: 300 + i * 70,
        easing: 'cubic-bezier(.2,.7,.1,1)',
        fill: 'backwards',
      });
    });

    if (this.isRowFlow()) {
      this.fillRef()?.nativeElement.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
        duration: 1400,
        delay: 300,
        easing: 'cubic-bezier(.7,0,.2,1)',
        fill: 'backwards',
      });
    }
  }

  /** Zig-zag arch flow highlights each step as it crosses ~62% of the viewport while the dialog scrolls. */
  private setupZigScrollProgress(dialog: HTMLElement): void {
    this.scrollCleanup?.();
    const list = dialog.querySelector<HTMLElement>('[data-arch-list="zig"]');
    const fill = this.fillRef()?.nativeElement;
    if (!list || !fill) return;

    const reduce = this.layout.prefersReducedMotion();
    this.scrollCleanup = onScrollFrame(() => {
      const mark = innerHeight * 0.62;
      const rect = list.getBoundingClientRect();
      const progress = reduce ? 1 : Math.max(0, Math.min(1, (mark - rect.top) / rect.height));
      fill.style.transform = `scaleY(${progress})`;
      list.querySelectorAll<HTMLElement>('[data-arch-item]').forEach((item) => {
        const box = item.getBoundingClientRect();
        item.classList.toggle('past', reduce || box.top + box.height / 2 < mark);
      });
    }, dialog);
  }
}
