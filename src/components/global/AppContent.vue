<script>
export default {
  name: 'AppContent',
  props: {
    contentClass: {
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
      staticClass: `app-content layout-row flex ${this.contentClass}`,
      ref: 'content'
    }
    return h('div', data, this.$slots.default)
  }
}
</script>

<style lang="scss" scoped></style>
