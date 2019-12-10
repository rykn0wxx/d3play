<template>
  <g :class="plotClass" :fill="fill"></g>
</template>

<script>
import * as d3 from 'd3'
import barMixins from './barMixins'
export default {
  name: 'BarPlot',
  mixins: [barMixins],
  props: {
    fill: {
      type: String,
      default: '#137B80'
    },
    chartData: {
      type: Array,
      default: () => []
    },
    chartDimensions: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      plotClass: 'svg-bar-plot',
      svgBarPlot: null,
      svgBarGrp: null,
      svgBarData: null,
      xAxisGrpPrep: null
    }
  },
  watch: {
    chartData: {
      handler: 'chartDataHandler',
      immediate: true
    },
    chartDimensions: {
      handler: 'chartDimensionsHandler',
      immediate: true
    }
  },
  methods: {
    chartDataHandler(newVal, oldVal) {
      if (oldVal !== undefined && newVal) {
        this.options.data = newVal
        this.prepSvgBar()
      }
    },
    chartDimensionsHandler(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.options.dimensions = newVal
        this.options.chartDims = {
          h:
            this.options.dimensions.h -
            this.options.margin.t -
            this.options.margin.b,
          w:
            this.options.dimensions.w -
            this.options.margin.l -
            this.options.margin.r
        }
      }
    },
    prepSvgBar() {
      if (this.chartData) {
        this.svgBarPlot = d3.select(`.${this.plotClass}`)
        this.svgBarData = this.svgBarPlot.selectAll('rect').data(this.chartData)
        this.svgBarGrp = this.svgBarData
          .enter()
          .append('rect')
          .classed('rect', true)
          .attr('fill', this.fill)
          .merge(this.svgBarData)
          .attr('x', d => this.xScale()(this.xValue()(d)))
          .attr('y', d => this.yScale()(this.yValue()(d)))
          .attr(
            'height',
            d => this.options.chartDims.h - this.yScale()(this.yValue()(d))
          )
          .attr('width', this.xScale().bandwidth())
        this.svgBarData.exit().remove()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
