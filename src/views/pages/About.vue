<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <table>
        <thead>
          <tr>
            <td>Index</td>
            <td>Key</td>
            <td>Value</td>
          </tr>
        </thead>
        <tbody v-if="isLoaded">
          <tr v-for="(d, i) in chartData" :key="i">
            <td>{{ i }}</td>
            <td><input type="text" v-model="d.key" /></td>
            <td><input type="text" v-model="d.value" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="forchart">
      <Basic :ds="chartData" />
    </div>
  </div>
</template>

<script>
import Basic from '../../components/charts/Basic'
export default {
  name: 'About',
  components: {
    Basic
  },
  data() {
    return {
      isLoaded: false,
      chart: {
        data: [
          { key: '2019-May-01', value: 104 },
          { key: '2019-Jun-01', value: 52 },
          { key: '2019-Jul-01', value: 103 },
          { key: '2019-Aug-01', value: 30 },
          { key: '2019-Sep-01', value: 56 },
          { key: '2019-Oct-01', value: 47 },
          { key: '2019-Nov-01', value: 172 },
          { key: '2019-Dec-01', value: 118 }
        ]
      },
      chartData: [null]
    }
  },
  methods: {
    loadData() {
      setTimeout(() => {
        this.chartData = [
          { key: 'North', value: 10 },
          { key: 'East', value: 51 },
          { key: 'West', value: 33 },
          { key: 'South', value: 74 }
        ]
        this.isLoaded = true
      }, 2000)
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.loadData()
      console.log(this.$vuuid())
    })
  }
}
</script>

<style lang="scss" scoped>
.forchart {
  height: 100%;
}
</style>
