import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Metric } from '../../types';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardComponent {
  metric = input.required<Metric>();
}
