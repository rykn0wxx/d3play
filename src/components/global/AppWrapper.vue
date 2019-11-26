<script>
export default {
  name: 'AppWrapper',
  props: {
    contentClass: {
      type: String,
      default: ''
    }
  },
  render(h) {
    const data = {
      staticClass: `app-wrapper layout-column ${this.contentClass}`,
      ref: 'wrapper'
    }
    return h('div', data, this.$slots.default)
  }
}
</script>

<style lang="scss" scoped></style>
