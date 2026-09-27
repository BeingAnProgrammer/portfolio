import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { STACK, WORKS } from '../../../../data/portfolio.data';
import { RevealDirective } from '../../../../shared/reveal.directive';

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackComponent {
  protected readonly groups = STACK;
  protected readonly selected = signal('RAG');

  protected readonly usedBy = computed(() => {
    for (const group of STACK) {
      const item = group.items.find((i) => i.name === this.selected());
      if (item) return item.usedBy;
    }
    return [];
  });

  protected readonly techProjects = computed(() => {
    const usedBy = this.usedBy();
    return WORKS.map((work) => ({ ...work, used: usedBy.includes(work.id) }));
  });

  protected readonly techCount = computed(() => {
    const count = this.usedBy().length;
    return count ? `${count} OF ${WORKS.length} PROJECTS` : 'EVERYDAY TOOLKIT';
  });

  select(name: string): void {
    this.selected.set(name);
  }
}
