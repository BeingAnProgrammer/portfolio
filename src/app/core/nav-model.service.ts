import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { NAV_ITEMS } from '../data/portfolio.data';
import { ActiveSectionService } from './active-section.service';

export interface NavLinkModel {
  id: string;
  label: string;
  num: string;
  /** Plain in-page anchor href, used only when `routerLink` is null. */
  href: string;
  /** Set when the link must navigate to another route (e.g. back to '/' from the resume page). */
  routerLink: string | null;
  fragment?: string;
  current: boolean;
}

/** Builds the nav rail / mobile menu model, aware of whether we're on the home page or the resume page. */
@Injectable({ providedIn: 'root' })
export class NavModelService {
  private readonly router = inject(Router);
  private readonly activeSection = inject(ActiveSectionService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly isResumePage = computed(() => this.currentUrl().startsWith('/resume'));

  readonly items = computed<NavLinkModel[]>(() => {
    const onResume = this.isResumePage();
    const active = this.activeSection.activeId();
    const sectionItems: NavLinkModel[] = NAV_ITEMS.map((item, i) => ({
      id: item.id,
      label: item.label,
      num: String(i + 1).padStart(2, '0'),
      href: `#${item.id}`,
      routerLink: onResume ? '/' : null,
      fragment: onResume ? item.id : undefined,
      current: !onResume && active === item.id,
    }));
    if (!onResume) return sectionItems;
    return [...sectionItems, { id: 'resume', label: 'Resume', num: '08', href: '/resume', routerLink: '/resume', current: true }];
  });
}
