import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { LayoutService } from '../../../../core/layout.service';
import { PROOF_AWARDS, PROOF_CERTIFICATIONS } from '../../../../data/portfolio.data';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-proof',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './proof.component.html',
  styleUrl: './proof.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProofComponent {
  protected readonly certifications = PROOF_CERTIFICATIONS;
  protected readonly awards = PROOF_AWARDS;
  protected readonly excellenceCount = signal(Number(PROOF_AWARDS[0].tag));

  private readonly layout = inject(LayoutService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly countEl = viewChild.required<ElementRef<HTMLElement>>('excellenceCountEl');

  constructor() {
    if (this.isBrowser) afterNextRender(() => this.setupCountUp());
  }

  private setupCountUp(): void {
    if (this.layout.prefersReducedMotion()) return;
    const target = this.excellenceCount();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / 1200);
          this.excellenceCount.set(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.1 },
    );
    observer.observe(this.countEl().nativeElement);
  }
}
