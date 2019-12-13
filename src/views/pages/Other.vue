<template>
  <div class="other">
    <h1>I am Other page</h1>
    <Demo :ds="appData" />
  </div>
</template>

<script>
import Demo from '../../components/Demo'
export default {
  name: 'Other',
  components: {
    Demo
  },
  data() {
    return {
      appData: null
    }
  },
  mounted() {
    setTimeout(() => {
      this.appData = [
        { key: 'North', value: 10 },
        { key: 'East', value: 51 },
        { key: 'West', value: 33 },
        { key: 'South', value: 74 }
      ]
    }, 2000)
  }
}
</script>

<style lang="scss" scoped></style>
