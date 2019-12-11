<template>
  <RouterView class="app tw-antialiased" v-cloak />
</template>

<script>
import { waitForReadyState } from './services/utils'

export default {
  name: 'App',
  metaInfo() {
    return {
      title: 'Frontend by mudhead'
    }
  },
  watch: {
    '$route.path'() {
      typeof window !== 'undefined' && window.scrollTo(0, 0)
    }
  },
  async mounted() {
    await this.$nextTick()
    await waitForReadyState()
  }
}
</script>

<style src="./assets/css/tailwind.css"></style>
