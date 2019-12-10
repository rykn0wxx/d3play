<template>
  <div class="basic">
    <div>
      <input type="text" v-model="opts.fill" />
    </div>
    <svg
      class="svg-root"
      :width="dimension.w"
      :height="dimension.h"
      :viewBox="vBox"
    >
      <g class="svg-wrap" :transform="svgWrapTranslate">
        <g class="svg-plot" :fill="opts.fill" />
        <g class="svg-axis x-axis x-axis__g" />
        <g class="svg-axis y-axis y-axis__g" />
      </g>
    </svg>
  </div>
</template>

<script>
import {
  select,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisLeft,
  transition,
  easeQuadInOut,
  color,
  max
} from 'd3'
// axisBottom, axisLeft
export default {
  name: 'Basic',
  props: {
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      config: {
        xval: 'key',
        yval: 'value'
      },
      opts: {
        fill: '#137B80'
      },
      elWidth: 0,
      rects: [],
      xValue: d => d.key,
      yValue: d => d.value,
      baseTrans: transition()
        .duration(150)
        .ease(easeQuadInOut)
    }
  },
  computed: {
    vBox() {
      return `0 0 ${this.dimension.w} ${this.dimension.h}`
    },
    svgWrapTranslate() {
      return `translate(${this.margin.l}, ${this.margin.t})`
    },
    margin() {
      return { l: 40, t: 20, r: 0, b: 30 }
    },
    dimension() {
      return { h: 300, w: 900 }
    },
    chartDim() {
      const { l, t, r, b } = this.margin
      const { h, w } = this.dimension
      return { gh: h - t - b, gw: w - l - r }
    }
  },
  methods: {
    chartDataHandler(val, oldVal) {
      if (oldVal && val) {
        this.draw(val)
      }
    },
    draw(data) {
      const { gw, gh } = this.chartDim
      const { yval, xval } = this.config
      const xVal = d => d[xval]
      const yVal = d => d[yval]
      const barsTrans = transition()
        .duration(150)
        .ease(easeQuadInOut)

      const xScale = scaleBand()
        .domain(data.map(xVal))
        .range([0, gw - 2])
        .padding(0.1)
      const yScale = scaleLinear()
        .domain([0, max(data, yVal)])
        .nice()
        .range([gh, 0])
      const xAxis = g =>
        g
          .attr('transform', `translate(0, ${gh})`)
          .classed('svg-axis x-axis x-axis__g', true)
          .call(axisBottom(xScale).tickSizeOuter(0))
      const yAxis = g =>
        g
          .attr('transform', `translate(0, 0)`)
          .classed('svg-axis y-axis y-axis__g', true)
          .call(axisLeft(yScale))
          .call(g => g.select('.domain').remove())
      const rectFill = color(this.opts.fill)
      const canva = select(this.$el).select('svg')
      // xAxis()
      // yAxis()
      const svgPlotData = canva
        .select('.svg-wrap .svg-plot')
        .selectAll('rect')
        .data(data)
      const svgPlot = svgPlotData
        .enter()
        .append('rect')
        .classed('bar', true)
        .merge(svgPlotData)
      svgPlot
        .attr('height', 0)
        .attr('width', xScale.bandwidth())
        .attr('y', gh)
        .attr('x', d => xScale(xVal(d)))
        .attr('fill', rectFill.darker(0.8))
        .transition(barsTrans)
        .attr('fill', rectFill)
        .attr('y', d => yScale(yVal(d)))
        .attr('height', d => gh - yScale(yVal(d)))

      canva.select('.svg-wrap .svg-axis.x-axis.x-axis__g').call(xAxis)
      canva.select('.svg-wrap .svg-axis.y-axis.y-axis__g').call(yAxis)
    },
    checkMe() {
      console.log(this.$el.offsetWidth)
      this.elWidth = this.$el.offsetWidth
    }
  },
  watch: {
    chartData: {
      handler: 'chartDataHandler',
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$nextTick().then(this.checkMe)
  }
}
</script>

<style lang="scss" scoped>
.svg-grp {
  &-enter-active,
  &-leave-active {
    transition: all 1s ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
