<template>
  <div class="single-score" v-resize="handleResize" :style="elemStyle">
    vue component {{ dims }}
    <svg
      class="svg-root"
      :height="dims.h"
      :width="dims.w"
      :viewBox="`0 0  ${dims.w} ${dims.h}`"
    ></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import autoFontSize from '../../services/charting/auto-font-size'
export default {
  name: 'SingleScore',
  props: {
    margin: {
      type: Object,
      default: () => ({
        l: 0,
        r: 0,
        t: 0,
        b: 0
      })
    }
  },
  data() {
    return {
      chartOptions: {
        axisXLabel: null,
        axisLabelFontSize: 14,
        axisLabelFontWeight: 400,
        axisLabelFontOpacity: 0.8,
        metricLabelColor: '#635F5D',
        metricLabelFontWeight: 700,
        metricLabelFontOpacity: 0.8,
        metricTitle: d => `${d}`,
        metricPrecision: 2
      },
      data: 4152,
      dims: {
        h: 0,
        w: 0
      }
    }
  },
  computed: {
    elemStyle: function() {
      return {
        height: `${this.dims.h}px`,
        width: `100%`
      }
    },
    axisXLabelLaneHeight: function() {
      return this.chartOptions.axisXLabel ? 30 : 0
    },
    g_w: function() {
      return this.dims.w - this.margin.l - this.margin.r
    },
    g_h: function() {
      return (
        this.dims.h - this.margin.t - this.margin.t - this.axisXLabelLaneHeight
      )
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.handleResize()
        setTimeout(() => {
          this.drawVisual()
        }, 500)
      })
    },
    handleResize() {
      const { height, width } = this.$el.getBoundingClientRect()
      this.dims = {
        h: Math.max(300, height || 0),
        w: Math.max(300, width || 0)
      }
    },
    drawVisual() {
      const svgRoot = d3.select(this.$el).select('.svg-root')
      const axisXLabelLane = svgRoot
        .append('g')
        .attr('transform', `translate(${this.margin.l}, ${this.margin.t})`)
        .classed('x-axis-label-lane', true)
      const svgGrp = svgRoot
        .append('g')
        .attr(
          'transform',
          `translate(${this.margin.l}, ${this.margin.t +
            this.axisXLabelLaneHeight})`
        )
        .classed('svg-grp', true)
      axisXLabelLane
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', this.g_w / 2)
        .attr('dy', '0.32em')
        .text(this.chartOptions.axisXLabel)
      svgGrp
        .append('text')
        .datum(this.data)
        .attr('text-anchor', 'middle')
        .attr('x', this.g_w / 2)
        .attr('y', this.g_h / 2)
        .attr('dy', '0.32em')
        .text(this.data)
        .attr('fill', this.chartOptions.metricLabelColor)
        .style('font-size', '1px')
        .attr('font-weight', this.chartOptions.metricLabelFontWeight)
        .call(autoFontSize(svgRoot))
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped></style>
