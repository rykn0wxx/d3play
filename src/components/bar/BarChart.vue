<template>
  <div class="bar-chart" ref="barChart">
    <svg
      ref="svgRoot"
      class="svg-root"
      :width="dims.w"
      :height="options.dimensions.h"
      :viewBox="viewBox"
    >
      <g class="svg-wrap" :transform="wrapTranslate">
        <BarPlot :chartData="barChartData" :chartDimensions="dims" />
      </g>
    </svg>
  </div>
</template>

<script>
import ResizeObserver from '../../services/utils/resize-observer'
import barMixins from './barMixins'
import BarPlot from './BarPlot'

export default {
  name: 'BarChart',
  mixins: [barMixins],
  components: {
    BarPlot
  },
  props: {
    barData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dims: {
        w: 300,
        h: 300
      },
      barChartData: []
    }
  },
  computed: {
    viewBox() {
      const { w, h } = this.dims
      return `0 0 ${w} ${h}`
    },
    wrapTranslate() {
      const { l, t } = this.options.margin
      return `translate(${l}, ${t})`
    }
  },
  watch: {
    barData: {
      handler: 'setDataOptions',
      immediate: true
    }
  },
  methods: {
    setDataOptions(newVal, oldVal) {
      if (oldVal !== undefined && newVal) {
        this.barChartData = newVal
      }
    },
    setWidth() {
      this.dims = {
        w: this.$refs.barChart.offsetWidth - 2,
        h: this.options.dimensions.h
      }
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

<style lang="scss" scoped>
.bar-chart {
  border: 1px solid rgba(0, 0, 0, 0.87);
}
</style>
