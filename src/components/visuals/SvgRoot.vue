<template>
  <svg
    ref="svgRoot"
    class="svg-root"
    xml:space="preserve"
    :enable-background="eBackground"
    :id="id"
    :viewBox="vBox"
    :width="oW"
    :height="oH"
  >
    <g class="svg-wrap" :transform="`translate(${margin.l}, ${margin.t})`">
      <g class="svg-plot" fill="steelblue">
        <transition-group
          tag="g"
          v-bind:css="false"
          v-on:before-enter="beforeEnter"
          v-on:after-enter="afterEnter"
        >
          <rect
            v-for="(r, index) in rects"
            :key="r.i"
            :width="r.width"
            :x="r.x"
            :id="r.i"
            :index="index"
            fill="steelblue"
            opacity="0.8"
            class="svg-rect bar"
          />
        </transition-group>
      </g>
    </g>
  </svg>
</template>
<script>
import { scaleBand, scaleLinear, max } from 'd3'
import { TimelineMax } from 'gsap'

export default {
  name: 'SvgRoot',
  props: {
    margin: {
      type: Object,
      default: () => ({ l: 40, t: 20, r: 0, b: 30 })
    },
    oH: {
      type: [Number, String],
      default: 200,
      validator: function(val) {
        return val >= 0
      }
    },
    oW: {
      type: [Number, String],
      default: 300,
      validator: function(val) {
        return val >= 0
      }
    },
    ds: {
      type: Array
    }
  },
  data() {
    return {
      id: this.$vuuid().slice(0, 8),
      isLoaded: false,
      rects: null,
      xValue: d => d.key,
      yValue: d => d.value
    }
  },
  computed: {
    vBox() {
      return `0 0 ${this.oW} ${this.oH}`
    },
    eBackground() {
      return `new ${this.vBox}`
    },
    iH() {
      return this.oH - this.margin.t - this.margin.b
    },
    iW() {
      return this.oW - this.margin.l - this.margin.r
    },
    xScale() {
      const { iW, ds, xValue } = this
      return scaleBand()
        .domain(ds.map(xValue))
        .range([0, iW - 2])
        .padding(0.1)
    },
    yScale() {
      const { iH, ds, yValue } = this
      return scaleLinear()
        .domain([0, max(ds, yValue)])
        .nice()
        .range([iH, 0])
    }
  },
  watch: {
    ds: {
      deep: true,
      handler: function(val, oldVal) {
        if (val !== null && val[0] !== null) {
          this.isLoaded = true
          this.draw()
          // should have an update method
          // console.log(this, val, oldVal)
        }
      }
    }
  },
  methods: {
    draw() {
      this.rects = this.ds.map((d, i) => {
        return {
          height: this.iH - this.yScale(this.yValue(d)),
          y: this.yScale(this.yValue(d)),
          width: this.xScale.bandwidth(),
          x: this.xScale(this.xValue(d)),
          d: this.ds[i],
          i: Math.random()
            .toString(36)
            .slice(4)
        }
      })
    },
    beforeEnter(el) {
      el.hidden = true
    },
    afterEnter(el) {
      const rect = this.rects[el.attributes.index.value]
      const tlm = new TimelineMax({ defaults: { duration: 1, ease: 'back' } })
      tlm.fromTo(
        el,
        1,
        {
          opacity: 0,
          height: 0,
          y: this.iH
        },
        {
          opacity: 1,
          height: +rect.height,
          y: +rect.y,
          ease: 'back',
          delay: 0.25 * el.attributes.index.value
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
