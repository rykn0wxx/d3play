<template>
  <div class="home" v-resize="onResize">
    <h1>I am Home {{ windowSize }}</h1>
    <SingleScore />
  </div>
</template>

<script>
import SingleScore from '@/components/d3/SingelScore'

export default {
  name: 'Home',
  components: {
    SingleScore
  },
  data() {
    return {
      data: 12001,
      windowSize: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    }
  },
  mounted() {
    this.onResize()
  }
}
</script>

<style lang="scss" scoped></style>
