import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FEATURED_PROJECTS } from '../../../../data/portfolio.data';
import { RevealDirective } from '../../../../shared/reveal.directive';
import { MinorProjectsComponent } from './minor-projects/minor-projects.component';
import { ProjectAnydocComponent } from './project-anydoc/project-anydoc.component';
import { ProjectDatamochaComponent } from './project-datamocha/project-datamocha.component';
import { ProjectFarmbuddyComponent } from './project-farmbuddy/project-farmbuddy.component';
import { ProjectKorivaComponent } from './project-koriva/project-koriva.component';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [
    RevealDirective,
    ProjectDatamochaComponent,
    ProjectKorivaComponent,
    ProjectAnydocComponent,
    ProjectFarmbuddyComponent,
    MinorProjectsComponent,
  ],
  templateUrl: './work.component.html',
  styleUrl: './work.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkComponent {
  protected readonly agentic = FEATURED_PROJECTS.find((p) => p.id === 'agentic')!;
  protected readonly koriva = FEATURED_PROJECTS.find((p) => p.id === 'koriva')!;
  protected readonly anydoc = FEATURED_PROJECTS.find((p) => p.id === 'anydoc')!;
  protected readonly farmbuddy = FEATURED_PROJECTS.find((p) => p.id === 'farmbuddy')!;
}
