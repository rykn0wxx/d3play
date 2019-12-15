<script>
import * as d3 from 'd3'

export default {
  name: 'SvgRect',
  props: {
    h: {
      type: Number,
      default: 0
    },
    w: {
      type: Number,
      default: 0
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    fill: {
      type: String,
      default: 'steelblue'
    }
  },
  data() {
    return {
      actRect: null,
      trans: d3
        .transition()
        .duration(250)
        .ease(d3.easeQuadInOut)
    }
  },
  methods: {
    handleMouseEnter(e) {
      e.preventDefault()
      this.actRect = 'active'
    },
    handleMouseLeave(e) {
      e.preventDefault()
      this.actRect = null
    },
    handleMouseMove(e) {
      this.$emit('mouseMove', { x: e.x, y: e.y })
    }
  },
  render(h) {
    const data = {
      staticClass: 'svg-rect bar',
      class: this.actRect,
      attrs: {
        height: this.h,
        width: this.w,
        x: this.x,
        y: this.y,
        fill: this.fill,
        opacity: 0.8
      },
      on: {
        mouseenter: this.handleMouseEnter,
        mousemove: this.handleMouseMove,
        mouseleave: this.handleMouseLeave
      }
    }
    return h('rect', data)
  }
}
</script>

<style lang="scss" scoped>
.svg-rect.bar {
  opacity: 0.8;
  transition: opacity 0.15s ease-in-out;
  &.active {
    opacity: 1;
  }
}
</style>
