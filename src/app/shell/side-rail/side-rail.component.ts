import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClockService } from '../../core/clock.service';
import { LayoutService } from '../../core/layout.service';
import { NavModelService } from '../../core/nav-model.service';
import { PERSON, RESUME_PDF_PATH } from '../../data/portfolio.data';
import { MagneticDirective } from '../../shared/magnetic.directive';

@Component({
  selector: 'app-side-rail',
  standalone: true,
  imports: [RouterLink, MagneticDirective, NgTemplateOutlet],
  templateUrl: './side-rail.component.html',
  styleUrl: './side-rail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideRailComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly navModel = inject(NavModelService);
  protected readonly clock = inject(ClockService);
  protected readonly person = PERSON;
  protected readonly resumePdfPath = RESUME_PDF_PATH;

  private readonly expandedPanel = viewChild.required<ElementRef<HTMLElement>>('expandedPanel');
  private readonly collapsedPanel = viewChild.required<ElementRef<HTMLElement>>('collapsedPanel');

  protected readonly activeLabel = computed(
    () => this.navModel.items().find((item) => item.current)?.label ?? this.navModel.items()[0].label,
  );

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    // "]" toggles the rail, as in the design (desktop only, never while typing).
    const onKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key !== ']' || this.layout.isMobile() || target?.closest('input, textarea, [contenteditable]')) return;
      this.toggle();
    };
    addEventListener('keydown', onKeydown);
    inject(DestroyRef).onDestroy(() => removeEventListener('keydown', onKeydown));
  }

  protected toggle(): void {
    this.layout.toggleRail();
    if (this.layout.prefersReducedMotion()) return;
    const opening = this.layout.railOpen();
    const panel = (opening ? this.expandedPanel() : this.collapsedPanel()).nativeElement;
    panel.animate([{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'none' }], {
      duration: 450,
      delay: opening ? 220 : 120,
      easing: 'cubic-bezier(.2,.7,.1,1)',
      fill: 'backwards',
    });
  }
}
