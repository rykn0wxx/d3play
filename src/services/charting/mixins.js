import * as d3 from 'd3'
import { debounce } from 'lodash'

const mixins = {
  data() {
    return {
      offsetTop: 10,
      offsetRight: 10,
      w: 500,
      h: 300,
      defaultOptions: {
        width: null,
        height: null,
        xAxis: false,
        yAxis: false,
        margin: { t: 60, r: 0, b: 30, l: 40 }
      }
    }
  },
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
    data: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    g_w: function() {
      return this.w - this.margin.l - this.margin.r - this.offsetRight
    },
    g_h: function() {
      return this.h - this.margin.t - this.margin.b - this.offsetTop
    }
  },
  methods: {
    ifExistsSvgThenRemove() {
      const svgSelection = d3.select(this.$el).select('svg')

      if (svgSelection.empty()) return

      svgSelection.remove()
    },
    getElWidthHeight() {
      return [this.$el.clientWidth, this.$el.clientHeight]
    },
    getSelectionWidthHeight(selection) {
      return [
        selection.node().getBBox().width,
        selection.node().getBBox().height
      ]
    },
    getSelectionOffset(selection) {
      return [selection.node().getBBox().x, selection.node().getBBox().y]
    }
  },
  watch: {
    width: {
      deep: false,
      handler(n) {
        this.$nextTick(() => {
          this.safeDraw()
        })
      }
    },
    height: {
      deep: false,
      handler(n) {
        this.$nextTick(() => {
          this.safeDraw()
        })
      }
    },
    margin: {
      deep: true,
      handler(n) {
        this.$nextTick(() => {
          this.safeDraw()
        })
      }
    },
    data: {
      deep: true,
      handler(n) {
        this.$nextTick(() => {
          this.safeDraw()
        })
      }
    },
    options: {
      deep: true,
      handler(n) {
        this.$nextTick(() => {
          this.safeDraw()
        })
      }
    }
  },
  activated() {
    const svgSelection = d3.select(this.$el).select('svg')

    if (svgSelection.empty()) {
      window.dispatchEvent(new Event('resize'))
    }
  },
  mounted() {
    setTimeout(this.safeDraw)

    this._handleResize = debounce(this.onResize, 500)

    window.addEventListener('resize', this._handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._handleResize)
  }
}

export default mixins
