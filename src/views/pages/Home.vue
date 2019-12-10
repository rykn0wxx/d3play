<template>
  <div class="home">
    <h1>I am Home</h1>
    <BarChart :data="barData" :options="chartOpts" :margin="margin" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import BarChart from '../../components/d3/BarChart'
const demoData = [
  { key: '01-01-2018', value: '127' },
  { key: '02-01-2018', value: '185' },
  { key: '03-01-2018', value: '29' },
  { key: '04-01-2018', value: '196' },
  { key: '05-01-2018', value: '27' },
  { key: '06-01-2018', value: '105' },
  { key: '07-01-2018', value: '14' },
  { key: '08-01-2018', value: '181' },
  { key: '09-01-2018', value: '21' },
  { key: '10-01-2018', value: '100' },
  { key: '11-01-2018', value: '27' },
  { key: '12-01-2018', value: '200' },
  { key: '01-01-2019', value: '160' },
  { key: '02-01-2019', value: '34' },
  { key: '03-01-2019', value: '59' },
  { key: '04-01-2019', value: '36' },
  { key: '05-01-2019', value: '179' },
  { key: '06-01-2019', value: '132' },
  { key: '07-01-2019', value: '27' },
  { key: '08-01-2019', value: '45' },
  { key: '09-01-2019', value: '188' },
  { key: '10-01-2019', value: '63' },
  { key: '11-01-2019', value: '112' },
  { key: '12-01-2019', value: '148' }
].map(d => {
  return {
    key: new Date(d.key),
    value: +d.value,
    y: '$ Close'
  }
})
export default {
  name: 'Home',
  components: {
    BarChart
  },
  data() {
    return {
      barData: [
        { key: '2019-May', value: 104 },
        { key: '2019-Jun', value: 52 },
        { key: '2019-Jul', value: 103 },
        { key: '2019-Aug', value: 30 },
        { key: '2019-Sep', value: 56 },
        { key: '2019-Oct', value: 47 },
        { key: '2019-Nov', value: 172 },
        { key: '2019-Dec', value: 118 }
      ],
      chartOpts: {
        width: 450,
        height: 200
      },
      margin: { t: 0, r: 0, b: 0, l: 0 },
      chartData: demoData,
      yText: '$ Close',
      windowSize: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    init() {
      // this.$nextTick(this.drawChart)
      console.log(this)
    },
    drawChart() {
      const canva = d3.select(this.$el)
      const svgRoot = canva
        .append('svg')
        .classed('svg-root', true)
        .attr('height', 500)
        .attr('width', 850)
        .attr('viewBox', `0 0 850 500`)
      const xScale = d3
        .scaleUtc()
        .domain(d3.extent(this.chartData, d => d.key))
        .range([this.margin.l, 850 - this.margin.r])
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(this.chartData, d => d.value)])
        .nice()
        .range([500 - this.margin.b, this.margin.t])
      const xAxis = g =>
        g.attr('transform', `translate(0,${500 - this.margin.b})`).call(
          d3
            .axisBottom(xScale)
            .ticks(850 / 80)
            .tickSizeOuter(0)
        )
      const yAxis = g =>
        g
          .attr('transform', `translate(${this.margin.l}, 0)`)
          .call(d3.axisLeft(yScale))
          .call(g => g.select('.domain').remove())
          .call(g =>
            g
              .select('.tick:last-of-type text')
              .clone()
              .attr('x', 3)
              .attr('text-anchor', 'start')
              .attr('font-weight', 'bold')
              .text(this.yText)
          )
      const curve = d3.curveBasis
      const area = d3
        .area()
        .curve(curve)
        .x(d => xScale(d.key))
        .y0(yScale(0))
        .y1(d => yScale(d.value))
      svgRoot
        .append('path')
        .datum(this.chartData)
        .attr('fill', '#85C1E9')
        .attr('fill-opacity', 0.4)
        .attr('stroke', '#5DADE2')
        .attr('stroke-width', 1.5)
        .attr('d', area)
      svgRoot.append('g').call(xAxis)
      svgRoot.append('g').call(yAxis)
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped></style>
