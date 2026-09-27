import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ABOUT_STEPS } from '../../../../data/portfolio.data';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly steps = ABOUT_STEPS;
}
