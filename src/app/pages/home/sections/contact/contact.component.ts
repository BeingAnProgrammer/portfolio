import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PERSON, RESUME_PDF_PATH } from '../../../../data/portfolio.data';
import { MagneticDirective } from '../../../../shared/magnetic.directive';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective, MagneticDirective, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly person = PERSON;
  protected readonly resumePdfPath = RESUME_PDF_PATH;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly copied = signal(false);
  protected readonly copyLabel = computed(() => (this.copied() ? 'Copied ✓' : 'Copy email'));

  protected readonly products = [
    { label: 'PRODUCT · KORIVA', url: 'https://koriva.rvnk.in/', name: 'koriva.rvnk.in', tagline: 'AI meeting intelligence' },
    { label: 'PRODUCT · ANYDOC LLM', url: 'https://anydocllm.rvnk.in', name: 'anydocllm.rvnk.in', tagline: 'Document → Markdown, in-browser' },
  ];

  async copyEmail(): Promise<void> {
    if (this.isBrowser) {
      try {
        await navigator.clipboard.writeText(this.person.email);
      } catch {
        /* clipboard unavailable — label still confirms the address is above */
      }
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }
}
