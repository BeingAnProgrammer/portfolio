import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CaseStudyService } from '../../../../../core/case-study.service';
import { LayoutService } from '../../../../../core/layout.service';
import { MINOR_PROJECTS } from '../../../../../data/portfolio.data';
import { CursorLabelDirective } from '../../../../../shared/cursor-label.directive';
import { RevealDirective } from '../../../../../shared/reveal.directive';

@Component({
  selector: 'app-minor-projects',
  standalone: true,
  imports: [RevealDirective, CursorLabelDirective],
  templateUrl: './minor-projects.component.html',
  styleUrl: './minor-projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinorProjectsComponent {
  protected readonly projects = MINOR_PROJECTS;
  protected readonly layout = inject(LayoutService);
  private readonly caseStudy = inject(CaseStudyService);

  open(id: string): void {
    this.caseStudy.open(id);
  }
}
