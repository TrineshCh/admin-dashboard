import { Component, ChangeDetectionStrategy, input, ElementRef, viewChild, effect } from '@angular/core';
import { ChartData } from '../../types';
declare const d3: any;

@Component({
  selector: 'app-d3-chart',
  template: `<div #chartContainer class="w-full h-64 md:h-80"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class D3ChartComponent {
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

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = el.clientWidth - margin.left - margin.right;
    const height = el.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(el).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.label))
      .padding(0.2);

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('fill', 'rgb(107 114 128)');

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.value)])
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', 'rgb(107 114 128)');

    svg.selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d: ChartData) => x(d.label))
      .attr('y', (d: ChartData) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: ChartData) => height - y(d.value))
      .attr('fill', '#6366f1');
  }
}
