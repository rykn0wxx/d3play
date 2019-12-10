<template>
  <div class="bar-chart" ref="barChart">
    <svg
      ref="svgRoot"
      class="svg-root"
      :width="options.dimensions.w"
      :height="options.dimensions.h"
      :viewBox="svgViewBox"
    >
      <g class="svg-wrap" :transform="svgWrapTranslate"></g>
    </svg>
  </div>
</template>

<script>
import ResizeObserver from '../../services/utils/resize-observer'
import { select, scaleBand, scaleLinear, max, axisBottom, axisLeft } from 'd3'

export default {
  name: 'BarChart',
  props: {
    barData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: {
        dimensions: {
          h: 300,
          w: 960
        },
        margin: { l: 40, t: 20, r: 0, b: 30 },
        fill: '#137B80',
        font: {
          family: 'Segoe UI',
          size: 12,
          weight: 400
        },
        classes: {
          root: 'svg-root',
          wrap: 'svg-wrap',
          plot: 'svg-plot',
          xAxis: 'x-axis',
          yAxis: 'y-axis'
        },
        chartDims: {}
      },
      chartSelects: {
        canva: null,
        svgRoot: null,
        svgWrap: null,
        plotPrep: null,
        plotGrp: null,
        xAxisGrpPrep: null
      }
    }
  },
  computed: {
    svgViewBox() {
      const { w, h } = this.options.dimensions
      return `0 0 ${w} ${h}`
    },
    svgWrapTranslate() {
      const { l, t } = this.options.margin
      return `translate(${l}, ${t})`
    }
  },
  watch: {
    barData: {
      handler: 'barDataHandler',
      immediate: true
    }
  },
  methods: {
    barDataHandler(newVal, oldVal) {
      if (oldVal !== undefined && newVal) {
        this.options.data = newVal
        this.drawChart()
      }
    },
    setWidth() {
      this.options.dimensions = {
        w: this.$refs.barChart.offsetWidth - 2,
        h: this.options.dimensions.h
      }
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
      if (this.options.data) {
        this.drawChart()
      }
    },
    xValue() {
      return d => d.key
    },
    xScale() {
      const { data, chartDims } = this.options
      return scaleBand()
        .domain(data.map(this.xValue()))
        .range([0, chartDims.w - 2])
        .padding(0.1)
    },
    xAxis() {
      const { chartDims } = this.options
      return g =>
        g
          .attr('transform', `translate(0, ${chartDims.h})`)
          .classed('x-axis__g', true)
          .call(axisBottom(this.xScale()).tickSizeOuter(0))
    },
    yValue() {
      return d => d.value
    },
    yScale() {
      const { data, chartDims } = this.options
      return scaleLinear()
        .domain([0, max(data, this.yValue())])
        .nice()
        .range([chartDims.h, 0])
    },
    yAxis() {
      return g =>
        g
          .attr('transform', `translate(0, 0)`)
          .classed('y-axis__g', true)
          .call(axisLeft(this.yScale()))
          .call(g => g.select('.domain').remove())
    },
    axisStyle() {
      const { font } = this.options
      return g =>
        g
          .attr('font-family', font.family)
          .attr('font-size', font.size)
          .attr('font-weight', font.weight)
    },
    drawChart() {
      this.chartSelects.canva = select(this.$el)
      this.chartSelects.svgRoot = this.chartSelects.canva.select(
        `.${this.options.classes.root}`
      )
      this.chartSelects.svgWrap = this.chartSelects.svgRoot.select(
        `.${this.options.classes.wrap}`
      )

      this.chartSelects.xAxisGrpPrep = this.chartSelects.svgWrap
        .selectAll(`.${this.options.classes.xAxis}`)
        .data([null])
      this.chartSelects.plotPrep = this.chartSelects.svgWrap
        .selectAll(`.${this.options.classes.plot}`)
        .data([null])
      this.chartSelects.yAxisGrpPrep = this.chartSelects.svgWrap
        .selectAll(`.${this.options.classes.yAxis}`)
        .data([null])

      this.chartSelects.plotGrp = this.chartSelects.plotPrep
        .enter()
        .append('g')
        .merge(this.chartSelects.plotPrep)
        .classed(this.options.classes.plot, true)
      this.chartSelects.xAxisGrp = this.chartSelects.xAxisGrpPrep
        .enter()
        .append('g')
        .merge(this.chartSelects.xAxisGrpPrep)
        .classed(this.options.classes.xAxis, true)
      this.chartSelects.yAxisGrp = this.chartSelects.yAxisGrpPrep
        .enter()
        .append('g')
        .merge(this.chartSelects.yAxisGrpPrep)
        .classed(this.options.classes.yAxis, true)

      this.chartSelects.plotGrpData = this.chartSelects.plotGrp
        .selectAll('rect')
        .data(this.options.data)
      this.chartSelects.plot = this.chartSelects.plotGrpData
        .enter()
        .append('rect')
        .classed('rect', true)
        .attr('fill', this.options.fill)
        .merge(this.chartSelects.plotGrpData)
        .attr('x', d => this.xScale()(this.xValue()(d)))
        .attr('y', d => this.yScale()(this.yValue()(d)))
        .attr(
          'height',
          d => this.options.chartDims.h - this.yScale()(this.yValue()(d))
        )
        .attr('width', this.xScale().bandwidth())

      this.chartSelects.xAxisGrp
        .call(this.xAxis())
        .call(this.axisStyle())
        .selectAll('g.tick, path')
        .attr('style', 'color: #42526E')
      this.chartSelects.yAxisGrp
        .call(this.yAxis())
        .call(this.axisStyle())
        .selectAll('g.tick, path')
        .attr('style', 'color: #42526E')
    }
  },
  mounted() {
    this.$nextTick().then(this.setWidth)
    this.windowResizeObserver = new ResizeObserver(window, this.setWidth)
  },
  beforeDestroy() {
    if (this.windowResizeObserver) {
      this.windowResizeObserver.destroy()
    }
  }
}
</script>

<style lang="scss" scoped></style>
