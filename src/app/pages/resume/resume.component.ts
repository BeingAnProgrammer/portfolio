import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActiveSectionService } from '../../core/active-section.service';
import { LayoutService } from '../../core/layout.service';
import { SeoService } from '../../core/seo.service';
import {
  AWARDS,
  CERTIFICATIONS,
  EDUCATION,
  PERSON,
  RESUME_OTHER_EXPERIENCE,
  RESUME_PDF_PATH,
  RESUME_SDE_PROJECTS,
  RESUME_SKILLS,
  RESUME_SUMMARY,
  RESUME_TOC,
} from '../../data/portfolio.data';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [RevealDirective, MagneticDirective, RouterLink],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeComponent implements OnDestroy {
  protected readonly person = PERSON;
  protected readonly resumePdfPath = RESUME_PDF_PATH;
  protected readonly summary = RESUME_SUMMARY;
  protected readonly sdeProjects = RESUME_SDE_PROJECTS;
  protected readonly otherExperience = RESUME_OTHER_EXPERIENCE;
  protected readonly skills = RESUME_SKILLS;
  protected readonly certifications = CERTIFICATIONS;
  protected readonly awards = AWARDS;
  protected readonly education = EDUCATION;
  protected readonly toc = RESUME_TOC;

  protected readonly layout = inject(LayoutService);
  protected readonly activeSection = inject(ActiveSectionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly expanded = signal(new Set<number>([0]));

  constructor() {
    inject(SeoService).setPage({
      title: 'Resume — R V Nitesh Kumar | Forward Deployed Engineer',
      description: 'Resume of R V Nitesh Kumar — full-stack and AI engineer in Chennai: AI agent platforms, RAG, enterprise SaaS and geospatial systems.',
      path: '/resume',
    });

    if (this.isBrowser) {
      afterNextRender(() => this.activeSection.track(RESUME_TOC.map((t) => t.id), '-35% 0px -60% 0px'));
    }
  }

  ngOnDestroy(): void {
    this.activeSection.stop();
  }

  isExpanded(index: number): boolean {
    return this.expanded().has(index);
  }

  toggle(index: number): void {
    this.expanded.update((set) => {
      const next = new Set(set);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }
}
