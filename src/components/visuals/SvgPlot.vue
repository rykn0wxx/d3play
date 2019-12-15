<template>
  <g class="svg-plot">
    <GSvgRect
      v-for="(r, i) in rects"
      :key="i"
      :h="r.height"
      :w="r.width"
      :x="r.x"
      :y="r.y"
      @mouseenter="handleMouseEnter($event, r)"
    />
  </g>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
export default {
  name: 'SvgPlot',
  props: {
    ds: {
      type: Array
    },
    svgOptions: {
      type: Object
    }
  },
  data() {
    return {
      isLoaded: false,
      actRec: null,
      xValue: d => d.key,
      yValue: d => d.value
    }
  },
  computed: {
    so() {
      return {
        ...this.$parent.svgOptions
      }
    },
    iH() {
      return this.so.oH - this.so.margin.t - this.so.margin.b
    },
    iW() {
      return this.so.oW - this.so.margin.l - this.so.margin.r
    },
    xScale() {
      const { iW, ds, xValue } = this
      return d3
        .scaleBand()
        .domain(ds.map(xValue))
        .range([0, iW - 2])
        .padding(0.1)
    },
    yScale() {
      const { iH, ds, yValue } = this
      return d3
        .scaleLinear()
        .domain([0, d3.max(ds, yValue)])
        .nice()
        .range([iH, 0])
    },
    rects() {
      return !this.isLoaded
        ? []
        : this.ds.map((d, i) => {
            return {
              height: this.iH - this.yScale(this.yValue(d)),
              width: this.xScale.bandwidth(),
              x: this.xScale(this.xValue(d)),
              y: this.yScale(this.yValue(d)),
              d: this.ds[i],
              i: i
            }
          })
    }
  },
  watch: {
    ds: {
      deep: true,
      handler: function(val, oldVal) {
        if (val !== null && val[0] !== null) {
          this.isLoaded = true
          // should have an update method
          // console.log(this, val, oldVal)
        }
      }
    }
  },
  methods: {
    handleMouseEnter(e, r) {
      console.log(r)
    }
  }
}
/* eslint-enable */
</script>

<style lang="scss" scoped></style>
