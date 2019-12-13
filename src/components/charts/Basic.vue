<template>
  <div class="basic">
    <div>
      <input type="text" v-model="mouseOffset.x" />
      <input type="text" v-model="mouseOffset.y" />
    </div>
    <svg
      class="svg-root"
      :id="uuid"
      :width="opts.svgDim.w"
      :height="opts.svgDim.h"
      :viewBox="vBox"
    >
      <g class="svg-wrap" :transform="svgWrapTranslate">
        <transition-group
          class="svg-plot"
          name="svg-trans"
          tag="g"
          :fill="opts.fill"
        >
          <rect
            v-for="(b, i) in bars"
            :key="i"
            :height="b.height"
            :width="b.width"
            :y="b.y"
            :x="b.x"
            v-on:mouseover.stop.prevent="startMove($event, b)"
            class="bar"
            fill="rgb(19, 123, 128)"
          ></rect>
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
        <g
          class="svg-tooltip"
          :transform="ttGrpTranslate"
          v-show="!toolTipCoor.show"
        >
          <path
            fill="white"
            stroke="black"
            d="M-38.6640625,5H-5l5,-5l5,5H38.6640625v44h-77.328125z"
          />
          <text transform="translate(0, 0)">
            <tspan x="0" y="0em" style="font-weight: 500;">$99.16</tspan>
            <tspan x="0" y="1.1em">Oct 19, 2011</tspan>
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  select,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisLeft,
  transition,
  easeQuadInOut,
  max
} from 'd3'
// axisBottom, axisLeft
export default {
  name: 'Basic',
  props: {
    ds: {
      type: Array,
      default: () => []
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
      toolTipCoor: { xx: 0, yy: 0, show: false },
      uuid: null,
      mouseOffset: { x: 0, y: 0 },
      over: false,
      rects: [],
      baseTrans: transition()
        .duration(150)
        .ease(easeQuadInOut)
      // xAxis: axisBottom().tickSizeOuter(0),
      // yAxis: axisLeft()
    }
  },
  computed: {
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
    ttGrpTranslate() {
      const { x, y } = this.mouseOffset
      return `translate(${x}, ${y})`
    },
    xValue() {
      const { xAxisName } = this.opts
      return d => d[xAxisName]
    },
    xScale() {
      const { chartDim, ds, xValue } = this
      return scaleBand()
        .domain(ds.map(xValue))
        .range([0, chartDim.gw - 2])
        .padding(0.1)
    },
    xAxis() {
      return axisBottom()
        .tickSizeOuter(0)
        .scale(this.xScale)
    },
    yValue() {
      const { yAxisName } = this.opts
      return d => d[yAxisName]
    },
    yScale() {
      const { chartDim, ds, yValue } = this
      return scaleLinear()
        .domain([0, max(ds, yValue)])
        .nice()
        .range([chartDim.gh, 0])
    },
    yAxis() {
      return axisLeft().scale(this.yScale)
    },
    bars() {
      if (!this.dataLoaded) return []
      return this.ds.map((d, i) => {
        return {
          height: this.chartDim.gh - this.yScale(this.yValue(d)),
          width: this.xScale.bandwidth(),
          x: this.xScale(this.xValue(d)),
          y: this.yScale(this.yValue(d)),
          d: d
        }
      })
    }
  },
  methods: {
    chartDataHandler(val, oldVal) {
      if (oldVal && val && val[0] !== null) {
        this.dataLoaded = true
        this.startDraw = _.debounce(this.draw, 500)
        this.$nextTick(function() {
          console.log(this.$el)
          this.draw(val)
        })
      }
    },
    draw(data) {
      const svg = select(this.$el).select(`svg#${this.uuid}`)
      svg
        .select('g.svg-axis.x-axis.x-axis__g')
        .call(this.xAxis)
        .call(g =>
          g
            .attr('font-family', this.opts.xAxisFontFamily)
            .attr('font-size', this.opts.xAxisFontSize)
            .attr('text-anchor', this.opts.xAxisTextAnchor)
        )
      svg
        .select('g.svg-axis.y-axis.y-axis__g')
        .call(this.yAxis)
        .call(g =>
          g
            .attr('font-family', this.opts.yAxisFontFamily)
            .attr('font-size', this.opts.yAxisFontSize)
            .attr('text-anchor', this.opts.yAxisTextAnchor)
            .select('.domain')
            .remove()
        )
      // console.log('bbb', data, select)
    },
    startMove(evt, bar) {
      let x = 0
      let y = 0
      if (evt && bar) {
        x = evt.pageX + bar.x + 2
        y = evt.pageY + bar.y + 1
      }
      this.mouseOffset = { x, y }
      this.over = bar
    }
  },
  watch: {
    ds: {
      handler: 'chartDataHandler',
      // immediate: true,
      deep: true
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.uuid = this.$vuuid().slice(0, 8)
    })
  },
  created() {
    this.uuid = this.$vuuid().slice(0, 8)
  }
}
</script>

<style lang="scss" scoped>
.basic {
  position: relative;
  .ssvg-tooltip {
    position: absolute;
    display: block;
  }
}
.svg-trans {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
