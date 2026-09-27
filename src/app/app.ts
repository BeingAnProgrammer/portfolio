import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CaseStudyService } from './core/case-study.service';
import { NavModelService } from './core/nav-model.service';
import { SeoService } from './core/seo.service';
import { PERSON, PROJECTS } from './data/portfolio.data';
import { CursorDotComponent } from './shared/cursor-dot.component';
import { MobileNavComponent } from './shell/mobile-nav/mobile-nav.component';
import { SideRailComponent } from './shell/side-rail/side-rail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SideRailComponent, MobileNavComponent, CursorDotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly navModel = inject(NavModelService);
  protected readonly caseStudy = inject(CaseStudyService);

  constructor() {
    inject(SeoService).setJsonLd('person-jsonld', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          name: PERSON.name,
          jobTitle: PERSON.role,
          worksFor: { '@type': 'Organization', name: PERSON.employer },
          address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressCountry: 'IN' },
          email: `mailto:${PERSON.email}`,
          alumniOf: 'Sathyabama Institute of Science and Technology',
          knowsAbout: [
            'AI agents', 'Retrieval-augmented generation', 'Azure OpenAI', 'Full-stack development',
            '.NET', 'Angular', 'MongoDB', 'Geospatial systems',
          ],
          sameAs: [PERSON.linkedin.url, PERSON.github.url, PERSON.medium.url],
        },
        { '@type': 'WebSite', name: PERSON.name, url: PERSON.siteUrl },
        ...PROJECTS.filter((p) => p.featured).map((p) => ({
          '@type': 'CreativeWork',
          name: p.title,
          description: p.kind,
          creator: PERSON.name,
        })),
      ],
    });
  }
}
