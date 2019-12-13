<template>
  <div class="demo">
    <svg
      class="svg-root"
      :enable-background="`new 0 0 ${opts.svgDim.w} ${opts.svgDim.h}`"
      xml:space="preserve"
      :id="vuid"
      :viewBox="vBox"
      :width="opts.svgDim.w"
      :height="opts.svgDim.h"
    >
      <g class="svg-wrap" :transform="svgWrapTranslate">
        <transition-group
          class="svg-plot"
          name="svg-trans"
          tag="g"
          :fill="opts.fill"
        >
          <rect
            v-for="(r, i) in rects"
            :key="i"
            :height="r.height"
            :width="r.width"
            :y="r.y"
            :x="r.x"
            :fill="r.fill"
            @mouseenter="handleMouseEnter($event, r)"
            @mousemove="handleMouseMove($event, r)"
            @mouseleave="handleMouseLeave($event, r)"
            class="bar"
            opacity="1"
          />
        </transition-group>
        <g
          class="svg-axis x-axis x-axis__g"
          text-anchor="opts.xAxisTextAnchor"
          font-size="12"
          font-family="Roboto"
          :transform="`translate(0, ${chartDim.gh})`"
        />
        <g
          class="svg-axis y-axis y-axis__g"
          transform="translate(0, 0)"
          text-anchor="end"
          font-size="12"
          font-family="Roboto"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'Demo',
  props: {
    ds: {
      type: Array
    },
    opts: {
      type: Object,
      default: () => {
        return {
          svgDim: { h: 300, w: 900 },
          margin: { l: 40, t: 20, r: 0, b: 30 },
          fill: '#137B80',
          xAxisName: 'key',
          yAxisName: 'value',
          xAxisFontSize: 12,
          xAxisFontFamily: 'Roboto',
          xAxisTextAnchor: 'middle',
          yAxisFontSize: 12,
          yAxisFontFamily: 'Roboto',
          yAxisTextAnchor: 'end'
        }
      }
    }
  },
  data() {
    return {
      dataLoaded: false,
      bar: null
    }
  },
  computed: {
    vuid: function() {
      return this.$vuuid().slice(0, 8)
    },
    vBox() {
      return `0 0 ${this.opts.svgDim.w} ${this.opts.svgDim.h}`
    },
    svgWrapTranslate() {
      return `translate(${this.opts.margin.l}, ${this.opts.margin.t})`
    },
    chartDim() {
      const { l, t, r, b } = this.opts.margin
      const { h, w } = this.opts.svgDim
      return { gh: h - t - b, gw: w - l - r }
    },
    xValue() {
      const { xAxisName } = this.opts
      return d => d[xAxisName]
    },
    xScale() {
      const { chartDim, ds, xValue } = this
      return d3
        .scaleBand()
        .domain(ds.map(xValue))
        .range([0, chartDim.gw - 2])
        .padding(0.1)
    },
    xAxis() {
      return d3
        .axisBottom()
        .tickSizeOuter(0)
        .scale(this.xScale)
    },
    yValue() {
      const { yAxisName } = this.opts
      return d => d[yAxisName]
    },
    yScale() {
      const { chartDim, ds, yValue } = this
      return d3
        .scaleLinear()
        .domain([0, d3.max(ds, yValue)])
        .nice()
        .range([chartDim.gh, 0])
    },
    yAxis() {
      return d3.axisLeft().scale(this.yScale)
    },
    barTransition() {
      return d3
        .transition()
        .duration(250)
        .ease(d3.easeQuadInOut)
        .delay((d, i) => i * 20)
    },
    defTrans() {
      return d3.transition().duration(200)
    },
    rects() {
      let formattedRects = []
      if (this.dataLoaded) {
        formattedRects = this.ds.map((d, i) => {
          return {
            height: this.chartDim.gh - this.yScale(this.yValue(d)),
            width: this.xScale.bandwidth(),
            x: this.xScale(this.xValue(d)),
            y: this.yScale(this.yValue(d)),
            d: this.ds[i],
            fill: this.opts.fill,
            i: i
          }
        })
      }
      return formattedRects
    }
  },
  watch: {
    ds: {
      immediate: true,
      deep: true,
      handler: function(n, o) {
        if (n) {
          this.dataLoaded = true
          this.processData(n)
        }
      }
    }
  },
  methods: {
    processData: async function(n) {
      if (n) {
        await this.$nextTick()
        this.drawChart()
      }
    },
    xBarOff(d) {
      return d.x + this.margin.l + this.margin.r
    },
    yBarOff(d) {
      return this.opts.svgDim.h - d.x - this.margin.b
    },
    handleMouseEnter(e, d) {
      d.fill = d3
        .color(d.fill)
        .brighter(10)
        .formatHex()
      console.log(d)
    },
    handleMouseMove(e, d) {
      console.log('handleMouseMove')
    },
    handleMouseLeave(e, d) {
      console.log('handleMouseLeave')
    },
    drawChart() {
      const canva = d3.select(this.$el)
      // const svgData = canva.selectAll(`svg#${this.vuid}`).data([null])
      const svgData = canva.selectAll(`svg`).data([null])
      const svg = svgData
        .enter()
        .append('svg')
        .merge(svgData)

      svg.select('g.svg-axis.x-axis.x-axis__g').call(this.xAxis)
      svg.select('g.svg-axis.y-axis.y-axis__g').call(this.yAxis)
      svg.selectAll('g.svg-axis.x-axis.x-axis__g').call(g =>
        g
          .attr('font-family', this.opts.xAxisFontFamily)
          .attr('font-size', this.opts.xAxisFontSize)
          .attr('text-anchor', this.opts.xAxisTextAnchor)
      )
      svg.selectAll('g.svg-axis.y-axis.y-axis__g').call(g =>
        g
          .attr('font-family', this.opts.yAxisFontFamily)
          .attr('font-size', this.opts.yAxisFontSize)
          .attr('text-anchor', this.opts.yAxisTextAnchor)
          .select('.domain')
          .remove()
      )
      // const barsData = svg.selectAll('.bar').data(this.rects)
      // const bars = barsData
      //   .enter()
      //   .append('rect')
      //   .merge(barsData)
      // // const myTrans = (g, _th) => {
      // //   _th.opts.fill = d3.color(_th.opts.fill)
      // // }
      // bars
      //   .on('mouseenter', function(bar, i) {
      //     d3.select(this)
      //       .transition()
      //       .duration(200)
      //       .attr('opacity', 0.6)
      //   })
      //   .on('mouseleave', function(bar, i) {
      //     d3.select(this)
      //       .transition()
      //       .duration(200)
      //       .attr('opacity', 1)
      //   })
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-trans {
  &-enter-active,
  &-leave-active {
    transition: all 0.2s ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
.bar {
  pointer-events: all;
}
</style>
