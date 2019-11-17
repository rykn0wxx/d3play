<script>
export default {
  name: 'AppContent',
  props: {
    tag: {
      type: String,
      default: 'main'
    },
    contentClass: {
      type: String,
      default: ''
    },
    wrapClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    // styles () {
    //   const { bar, top, right, footer, insetFooter, bottom, left } = this.$vuetify.application
    //   return {
    //     paddingTop: `${top + bar}px`,
    //     paddingRight: `${right}px`,
    //     paddingBottom: `${footer + insetFooter + bottom}px`,
    //     paddingLeft: `${left}px`
    //   }
    // }
  },
  render(h) {
    const data = {
      // style: this.styles,
      staticClass: `v-content app-content ${this.contentClass}`,
      ref: 'content'
    }
    return h(this.tag, data, [
      h(
        'div',
        {
          staticClass: `v-content__wrap app-content__wrap tw-relative ${this.wrapClass}`
        },
        this.$slots.default
      )
    ])
  }
}
</script>

<style lang="scss" scoped></style>
