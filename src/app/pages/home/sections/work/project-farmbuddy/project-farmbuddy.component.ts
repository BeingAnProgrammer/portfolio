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
import { FARMBUDDY_POLYGON, Project, SPECTRAL_INDICES } from '../../../../../data/portfolio.data';
import { MagneticDirective } from '../../../../../shared/magnetic.directive';
import { RevealDirective } from '../../../../../shared/reveal.directive';
import { visibleTicker } from '../../../../../shared/visible-ticker';

const GRID_COLS = 32;
const GRID_ROWS = 18;

function cellValue(x: number, y: number, k: number): number {
  const v = 0.5 + 0.24 * Math.sin(x * 0.34 + y * 0.42 + k) + 0.18 * Math.cos(x * 0.17 - y * 0.55 + k * 0.6) + 0.08 * Math.sin(x * 1.9 + y * 1.3);
  return Math.max(0, Math.min(1, v));
}

function inPolygon(x: number, y: number): boolean {
  let inside = false;
  const poly = FARMBUDDY_POLYGON;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

@Component({
  selector: 'app-project-farmbuddy',
  standalone: true,
  imports: [RevealDirective, MagneticDirective],
  templateUrl: './project-farmbuddy.component.html',
  styleUrl: './project-farmbuddy.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFarmbuddyComponent {
  readonly project = input.required<Project>();

  protected readonly indicesData = SPECTRAL_INDICES;
  protected readonly svgPoints = FARMBUDDY_POLYGON.map(([x, y]) => `${x},${y}`).join(' ');
  protected readonly vertices = FARMBUDDY_POLYGON.map(([x, y]) => ({
    left: `${(x / GRID_COLS) * 100}%`,
    top: `${(y / GRID_ROWS) * 100}%`,
  }));

  private readonly layout = inject(LayoutService);
  private readonly caseStudy = inject(CaseStudyService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostEl = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly canvasRef = viewChild.required<ElementRef<HTMLElement>>('canvas');
  private readonly crosshairRef = viewChild.required<ElementRef<HTMLElement>>('crosshair');
  private readonly readoutRef = viewChild.required<ElementRef<HTMLElement>>('readout');

  private readonly tick = signal(0);
  private readonly pinnedIndex = signal<number | null>(null);
  protected readonly activeIndex = computed(
    () => this.pinnedIndex() ?? Math.floor(this.tick() / 5) % SPECTRAL_INDICES.length,
  );

  protected readonly indices = computed(() =>
    SPECTRAL_INDICES.map((spectral, i) => ({ ...spectral, on: i === this.activeIndex() })),
  );

  protected readonly cells = computed(() => {
    const activeIndex = this.activeIndex();
    const { hue, span } = SPECTRAL_INDICES[activeIndex];
    const cells: { bg: string; opacity: number }[] = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const v = cellValue(x, y, activeIndex);
        const h = hue + (span ? v * span : 0);
        cells.push({
          bg: `oklch(${(0.22 + v * 0.42).toFixed(3)} ${(0.04 + v * 0.11).toFixed(3)} ${h.toFixed(0)})`,
          opacity: inPolygon(x + 0.5, y + 0.5) ? 1 : 0.42,
        });
      }
    }
    return cells;
  });

  protected readonly polyCount = (() => {
    let count = 0;
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (inPolygon(x + 0.5, y + 0.5)) count++;
      }
    }
    return count;
  })();

  protected readonly legend = computed(() => {
    const { hue, span } = SPECTRAL_INDICES[this.activeIndex()];
    return `linear-gradient(90deg, oklch(.22 .04 ${hue}), oklch(.64 .15 ${hue + span}))`;
  });

  constructor() {
    if (this.isBrowser) {
      afterNextRender(() => {
        this.setupTicker();
        this.setupCrosshair();
      });
    }
  }

  openCaseStudy(): void {
    this.caseStudy.open(this.project().id);
  }

  pickIndex(i: number, event: Event): void {
    event.stopPropagation();
    this.pinnedIndex.set(i);
  }

  /** Raw listeners: the crosshair writes to the DOM directly, so pointer moves never re-check the 576-cell grid. */
  private setupCrosshair(): void {
    const canvas = this.canvasRef().nativeElement;
    const onMove = (event: MouseEvent) => this.moveCrosshair(canvas, event);
    const onLeave = () => {
      this.crosshairRef().nativeElement.style.opacity = '0';
    };
    canvas.addEventListener('mousemove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);
    this.destroyRef.onDestroy(() => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    });
  }

  private moveCrosshair(canvas: HTMLElement, event: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cx = Math.min(GRID_COLS - 1, Math.max(0, Math.floor((x / rect.width) * GRID_COLS)));
    const cy = Math.min(GRID_ROWS - 1, Math.max(0, Math.floor((y / rect.height) * GRID_ROWS)));
    const v = cellValue(cx, cy, this.activeIndex());

    const crosshair = this.crosshairRef().nativeElement;
    crosshair.style.transform = `translate(${x}px,${y}px)`;
    crosshair.style.opacity = '1';
    const name = SPECTRAL_INDICES[this.activeIndex()].name;
    const value = (v * 1.6 - 0.6).toFixed(2);
    const lat = (22.5 - (cy / GRID_ROWS) * 4.6).toFixed(3);
    const lng = (81.5 + (cx / GRID_COLS) * 6).toFixed(3);
    const flag = inPolygon(cx + 0.5, cy + 0.5) ? ' · IN POLYGON' : '';
    this.readoutRef().nativeElement.textContent = `${name} ${value} · ${lat}°N ${lng}°E${flag}`;
  }

  private setupTicker(): void {
    if (this.layout.prefersReducedMotion()) return;
    this.destroyRef.onDestroy(visibleTicker(this.hostEl, 1500, () => this.tick.update((v) => v + 1)));
  }
}
