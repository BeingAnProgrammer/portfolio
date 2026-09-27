import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClockService } from '../../core/clock.service';
import { NavModelService } from '../../core/nav-model.service';
import { PERSON, RESUME_PDF_PATH } from '../../data/portfolio.data';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeMenu()' },
})
export class MobileNavComponent {
  protected readonly navModel = inject(NavModelService);
  protected readonly clock = inject(ClockService);
  protected readonly person = PERSON;
  protected readonly resumePdfPath = RESUME_PDF_PATH;

  protected readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
