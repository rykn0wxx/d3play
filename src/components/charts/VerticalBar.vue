<template>
  <div ref="verticalBar" class="vertical-bar" :style="wrapperStyle"></div>
</template>

<script>
import { defaultOptions } from './defOpts'
import { ResizeObserver, Uuid } from '@/services/utils'
import { debounce, eq } from 'lodash'
import {
  select,
  scaleLinear,
  scaleBand,
  axisBottom,
  axisLeft,
  format,
  max
} from 'd3'
export default {
  name: 'VerticalBar',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    margin: {
      type: Object,
      default: () => ({})
    },
    chartData: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      doneInit: false,
      resizeObserver: null,
      dims: {
        h: 300,
        w: 900
      },
      opts: null,
      svg: {}
    }
  },
  computed: {
    wrapperStyle: function() {
      return `width: ${this.dims.w}px; height: ${this.dims.h}px;`
    },
    axisXLabelLane: function() {
      const { axisXLabel, axisYLabel } = this.opts
      return {
        h: axisXLabel ? 0 : 60,
        w: axisYLabel ? 0 : 60
      }
    }
  },
  watch: {
    chartData: {
      handler: 'chartDataHandler',
      immediate: true
    }
  },
  methods: {
    chartDataHandler(newVal, oldVal) {
      if (oldVal !== undefined && newVal) {
        this.drawChart()
      }
    },
    drawChart() {
      const { classes, offset } = defaultOptions
      const { t, l } = this.opts.margin
      const o = this.opts
      const data = this.chartData
      const xVal = d => d.key
      const yVal = d => d.value

      const yScale = scaleLinear()
        .range([o.gh, 0])
        .domain([0, max(data, yVal)])
      if (o.nice) yScale.nice()

      const xScale = scaleBand()
        .range([0, o.gw])
        .paddingInner([o.paddingInner])
        .paddingOuter([o.paddingOuter])
        .domain(data.map(xVal))

      const svgData = this.svg.root.selectAll(`.${classes.root}`).data([null])
      const svg = svgData
        .enter()
        .append('svg')
        .merge(svgData)
        .classed(classes.root, true)
        .attr('width', this.dims.w)
        .attr('height', this.dims.h)
        .attr('viewBox', `0 0 ${this.dims.w} ${this.dims.h}`)

      svg.select('defs').remove()
      svg
        .append('defs')
        .append('clipPath')
        .attr('id', this.clipId)
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', o.gw)
        .attr('height', o.gh)

      const axisXLaneData = svg
        .selectAll('g.axis-x-lane, g.axis.x-axis')
        .data([null])
      const axisXLane = axisXLaneData
        .enter()
        .append('g')
        .classed('axis-x-lane', true)
        .merge(axisXLaneData)
        .attr(
          'transform',
          `translate(${l + this.axisXLabelLane.w + o.axisYLaneWidth}, ${t +
            o.gh +
            offset.top})`
        )
      axisXLaneData.exit().remove()
      const axisYLaneData = svg
        .selectAll('g.axis-y-lane, g.axis.y-axis')
        .data([null])
      const axisYLane = axisYLaneData
        .enter()
        .append('g')
        .merge(axisYLaneData)
        .classed('axis-y-lane', true)
        .attr(
          'transform',
          `translate(${l + this.axisXLabelLane.w}, ${t + offset.top})`
        )
      axisYLaneData.exit().remove()
      const xAxis = axisBottom(xScale)
        .tickFormat(o.axisXTickFormat)
        .tickSize(o.tickSize)
        .tickPadding(o.tickPadding)
        .tickSizeOuter(0)
      const yAxis = axisLeft(yScale)
        .ticks(10)
        .tickFormat(format(o.axisYTickFormat))
        .tickSize(o.tickSize)
        .tickPadding(o.tickPadding)

      const gAxisX = axisXLane.selectAll(`.${classes.xAxis}`).data([null])
      gAxisX
        .enter()
        .append('g')
        .merge(gAxisX)
        .classed(classes.xAxis, true)
        .call(xAxis)
        .attr('font-size', o.axisFontSize)
        .attr('font-weight', o.axisFontWeight)
        .attr('opacity', o.axisFontOpacity)
      const gAxisY = axisYLane.selectAll(`.${classes.yAxis}`).data([null])
      gAxisY
        .enter()
        .append('g')
        .merge(gAxisY)
        .classed(classes.yAxis, true)
        .attr('transform', `translate(${o.axisYLaneWidth}, 0)`)
        .call(yAxis)
        // .call(axisShow, isAxisPathShow, isAxisTickShow)
        .attr('font-size', o.axisFontSize)
        .attr('font-weight', o.axisFontWeight)
        .attr('opacity', o.axisFontOpacity)

      const svgPlotData = svg.selectAll('g.svg-plot').data([null])
      const g = svgPlotData
        .enter()
        .append('g')
        .merge(svgPlotData)
        .classed('svg-plot', true)
        .attr(
          'transform',
          `translate(${l + this.axisXLabelLane.w + o.axisYLaneWidth}, ${t +
            offset.top})`
        )

      const gData = g.selectAll('rect').data(data)
      const rects = gData
        .enter()
        .append('rect')
        .merge(gData)
        .attr('clip-path', `url(#${this.clipId})`)
        .attr('x', d => xScale(xVal(d)))
        .attr('y', o.gh)
        .attr('height', 0)
        .attr('width', xScale.bandwidth())
        .attr('fill', o.fill)
        .attr('fill-opacity', o.fillOpacity)
      rects
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr('y', d => yScale(yVal(d)))
        .attr('height', d => o.gh - yScale(yVal(d)))
    },
    initChart() {
      this.opts = { ...defaultOptions.options, ...this.options }
      this.opts.margin = { ...defaultOptions.margin, ...this.margin }
      this.setWidth()
      this.clipId = Uuid()
      this.svg.root = select(this.$el)
      // this.drawChart()
      this.doneInit = true
    },
    setWidth() {
      const oldDims = this.dims
      this.dims = {
        w: this.$refs.verticalBar.parentElement.offsetWidth - 2,
        h: this.$refs.verticalBar.parentElement.offsetHeight
      }
      this.opts.gh =
        this.dims.h -
        this.opts.margin.t -
        this.opts.margin.b -
        this.axisXLabelLane.h -
        defaultOptions.offset.top
      this.opts.gw =
        this.dims.w -
        this.opts.margin.l -
        this.opts.margin.r -
        this.axisXLabelLane.w -
        defaultOptions.offset.right
      this.$nextTick(function() {
        if (this.doneInit && this.chartData[0] && !eq(oldDims.w, this.dims.w)) {
          this.drawChart()
        }
      })
    }
  },
  mounted() {
    this.$nextTick().then(this.initChart)
    this.handleResize = debounce(this.setWidth, 500)
    this.resizeObserver = new ResizeObserver(window, this.handleResize)
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.destroy()
    }
  }
}
</script>

<style lang="scss" scoped></style>
