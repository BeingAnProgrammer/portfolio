import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { LayoutService } from '../../../../core/layout.service';
import { HOME_TIMELINE, TRAJECTORY_ERAS } from '../../../../data/portfolio.data';
import { onScrollFrame } from '../../../../shared/on-scroll-frame';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  protected readonly eras = TRAJECTORY_ERAS;
  protected readonly timeline = HOME_TIMELINE;

  protected readonly layout = inject(LayoutService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly timelineRef = viewChild.required<ElementRef<HTMLElement>>('timelineTrack');
  private readonly fillRef = viewChild.required<ElementRef<HTMLElement>>('timelineFill');

  constructor() {
    if (this.isBrowser) afterNextRender(() => this.setupScrollFill());
  }

  private setupScrollFill(): void {
    if (this.layout.prefersReducedMotion()) {
      this.fillRef().nativeElement.style.transform = 'scaleY(1)';
      return;
    }
    const stop = onScrollFrame(() => {
      const rect = this.timelineRef().nativeElement.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight * 0.6 - rect.top) / rect.height));
      this.fillRef().nativeElement.style.transform = `scaleY(${progress})`;
    });
    this.destroyRef.onDestroy(stop);
  }
}
