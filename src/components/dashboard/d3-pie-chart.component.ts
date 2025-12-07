import { Component, ChangeDetectionStrategy, input, ElementRef, viewChild, effect } from '@angular/core';
import { ChartData } from '../../types';
declare const d3: any;

@Component({
  selector: 'app-d3-pie-chart',
  template: `<div #chartContainer class="w-full h-64 md:h-80"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class D3PieChartComponent {
  data = input.required<ChartData[]>();
  chartContainer = viewChild.required<ElementRef>('chartContainer');

  constructor() {
    effect(() => {
      const data = this.data();
      if (data && data.length > 0) {
        this.createChart(data);
      }
    });
  }

  private createChart(data: ChartData[]): void {
    const el = this.chartContainer().nativeElement;
    d3.select(el).select('svg').remove();

    const width = el.clientWidth;
    const height = el.clientHeight;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3.select(el).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']);

    const pie = d3.pie().value((d: any) => d.value);
    const data_ready = pie(data);

    const arc = d3.arc()
        .innerRadius(radius * 0.5) // For a donut chart
        .outerRadius(radius);

    svg.selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    svg.selectAll('slices')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d: any) => `${d.data.label} (${d.data.value})`)
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 14)
      .style('fill', '#fff');
  }
}
