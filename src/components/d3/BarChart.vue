<template>
  <div class="bar-chart" :style="{ width: width, height: height }">
    <svg class="svg-root" :width="w" :height="h" :viewBox="`0 0 ${w} ${h}`">
      <g class="svg-wrapper" :transform="`translate(${margin.l}, ${margin.t})`">
        <g class="bars" fill="steelblue"></g>
        <g
          v-if="options.xAxis"
          class="x-axis"
          :transform="`translate(0, ${g_h})`"
        ></g>
        <g
          v-if="options.yAxis"
          class="y-axis"
          :transform="`translate(${margin.l}, 0)`"
        ></g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import mixins from '../../services/charting/mixins'
export default {
  name: 'BarChart',
  mixins: [mixins],
  methods: {
    drawChart() {
      const [w, h] = this.getElWidthHeight()
      const { l, t } = this.margin
      this.w = w
      this.h = h
      const canva = d3
        .select(this.$el)
        .append('svg')
        .classed('svg-root', true)
        .attr('width', this.w)
        .attr('height', this.h)
        .attr('viewBox', `0 0 ${this.w} ${this.h}`)
      const svg = canva
        .append('g')
        .classed('svg-wrapper', true)
        .attr('transform', `translate(${l}, ${t})`)
      const xValue = d => d.key
      const yValue = d => d.value
      const xScale = d3
        .scaleBand()
        .range([l, this.g_w])
        .domain(this.data.map(xValue))
        .padding(0.1)
      const yScale = d3
        .scaleLinear()
        .range([this.g_h, 0])
        .domain([0, d3.max(this.data, yValue)])
        .nice()
      const xAxis = g =>
        g
          .attr('transform', `translate(0, ${this.g_h})`)
          .call(d3.axisBottom(xScale).tickSizeOuter(0))
      const yAxis = g =>
        g
          .attr('transform', `translate(${l}, 0)`)
          .call(d3.axisLeft(yScale))
          .call(g => g.select('.domain').remove())

      const bars = svg
        .append('g')
        .attr('fill', 'steelblue')
        .classed('bars', true)
        .selectAll('rect')
        .data(this.data)
      bars
        .join('rect')
        .classed('bar', true)
        .attr('x', d => xScale(xValue(d)))
        .attr('y', d => yScale(yValue(d)))
        .attr('height', d => this.g_h - yScale(yValue(d)))
        .attr('width', xScale.bandwidth())

      svg
        .append('g')
        .classed('x-axis', true)
        .call(xAxis)
      svg
        .append('g')
        .classed('y-axis', true)
        .call(yAxis)
    },
    genChart() {
      const [w, h] = this.getElWidthHeight()
      const { l, t } = this.margin
      this.w = this.options.width ? this.options.width : w
      this.h = this.options.height ? this.options.height : h
      const xValue = d => d.key
      const yValue = d => d.value
      const canva = d3.select(this.$el).select('svg')
      canva
        .attr('width', this.w)
        .attr('height', this.h)
        .attr('viewBox', `0 0 ${this.w} ${this.h}`)
      const svg = canva.select('.svg-wrapper')
      svg.attr('transform', `translate(${l}, ${t})`)

      const xScale = d3
        .scaleBand()
        .range([l, this.g_w])
        .domain(this.data.map(xValue))
        .padding(0.1)
      const yScale = d3
        .scaleLinear()
        .range([this.g_h, 0])
        .domain([0, d3.max(this.data, yValue)])
        .nice()
      const x = g =>
        g
          .attr('transform', `translate(0, ${this.g_h})`)
          .call(d3.axisBottom(xScale).tickSizeOuter(0))
      const yAxis = g =>
        g
          .attr('transform', `translate(${l}, 0)`)
          .call(d3.axisLeft(yScale))
          .call(g => g.select('.domain').remove())
      const bars = svg
        .select('.bars')
        .selectAll('rect')
        .data(this.data)
      bars
        .join('rect')
        .classed('bar', true)
        .attr('x', d => xScale(xValue(d)))
        .attr('y', d => yScale(yValue(d)))
        .attr('height', d => this.g_h - yScale(yValue(d)))
        .attr('width', xScale.bandwidth())
      const xAxis = svg.select('.x-axis').call(x)
      svg.select('.y-axis').call(yAxis)
      xAxis
        .selectAll('g')
        .select('text')
        .style('font-family', 'Roboto')
        .style('font-size', 12)
        .style('font-weight', 500)
    },
    safeDraw() {
      // this.drawChart()
      this.genChart()
    },
    onResize() {
      this.safeDraw()
    }
  }
}
</script>

<style lang="scss" scoped></style>
