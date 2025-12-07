import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataService } from '../../services/data.service';
import { ChartData, Metric, User } from '../../types';
import { StatsCardComponent } from './stats-card.component';
import { D3ChartComponent } from './d3-chart.component';
import { D3LineChartComponent } from './d3-line-chart.component';
import { D3PieChartComponent } from './d3-pie-chart.component';
import { RecentUsersComponent } from './recent-users.component';
import { interval, startWith, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatsCardComponent, D3ChartComponent, D3LineChartComponent, D3PieChartComponent, RecentUsersComponent]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private destroy$ = new Subject<void>();

  metrics = signal<Metric[]>([]);
  postsByMonthData = signal<ChartData[]>([]);
  signupsByDayData = signal<ChartData[]>([]);
  roleDistributionData = signal<ChartData[]>([]);
  recentUsers = signal<Pick<User, 'name' | 'email' | 'createdAt'>[]>([]);
  
  ngOnInit(): void {
    interval(30000).pipe(
      startWith(0), // fetch immediately on load
      switchMap(() => this.dataService.getMetrics()),
      takeUntil(this.destroy$)
    ).subscribe(data => this.metrics.set(data));

    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.dataService.getPostsByMonthData()),
      takeUntil(this.destroy$)
    ).subscribe(data => this.postsByMonthData.set(data));

    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.dataService.getSignupsByDayData()),
      takeUntil(this.destroy$)
    ).subscribe(data => this.signupsByDayData.set(data));

    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.dataService.getRoleDistributionData()),
      takeUntil(this.destroy$)
    ).subscribe(data => this.roleDistributionData.set(data));

    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.dataService.getRecentUsers()),
      takeUntil(this.destroy$)
    ).subscribe(data => this.recentUsers.set(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}