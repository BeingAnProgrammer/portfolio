import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { ActiveSectionService } from '../../core/active-section.service';
import { SeoService } from '../../core/seo.service';
import { NAV_ITEMS } from '../../data/portfolio.data';
import { AboutComponent } from './sections/about/about.component';
import { CaseStudyOverlayComponent } from './sections/case-study-overlay/case-study-overlay.component';
import { ContactComponent } from './sections/contact/contact.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { HeroComponent } from './sections/hero/hero.component';
import { ProofComponent } from './sections/proof/proof.component';
import { StackComponent } from './sections/stack/stack.component';
import { WorkComponent } from './sections/work/work.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    WorkComponent,
    AboutComponent,
    ExperienceComponent,
    StackComponent,
    ProofComponent,
    ContactComponent,
    CaseStudyOverlayComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnDestroy {
  private readonly activeSection = inject(ActiveSectionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    inject(SeoService).setPage({
      title: 'R V Nitesh Kumar — Forward Deployed Engineer | AI & Full Stack Engineer',
      description:
        'R V Nitesh Kumar builds AI agent platforms, RAG systems, enterprise SaaS and geospatial products — full-stack and AI engineering from Chennai, India.',
      path: '/',
    });

    if (this.isBrowser) {
      afterNextRender(() => this.activeSection.track(NAV_ITEMS.map((item) => item.id)));
    }
  }

  ngOnDestroy(): void {
    this.activeSection.stop();
  }
}
