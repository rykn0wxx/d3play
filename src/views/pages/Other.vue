<template>
  <div class="other-page flex tw-p-6">
    <div class="tw-w-full">
      <div class="flex layout-wrap tw-mb-6 layout-row">
        <div class="tw-w-full flex-20 tw-px-2 tw-mb-5">
          <label for="inpHeight" class="tw-block tw-mb-2 tw-tracking-wide">
            Height
          </label>
          <input
            v-model="height"
            id="inpHeight"
            type="number"
            class="tw-block tw-w-full tw-rounded tw-py-3 tw-px-4 tw-bg-light tw-text-dark"
          />
        </div>
        <div class="tw-w-full flex-20 tw-px-2">
          <label
            for="inpWidth"
            class="tw-block tw-mb-2 tw-tracking-wide tw-font-semibold"
          >
            width
          </label>
          <input
            v-model="width"
            id="inpWidth"
            type="number"
            class="tw-block tw-w-full tw-rounded tw-py-3 tw-px-4 tw-bg-light tw-text-dark"
          />
        </div>
      </div>
    </div>
    <div>
      <svg
        xml:space="preserve"
        enable-background="new 0 0 650 300"
        id="svgRoot"
        viewBox="0 0 650 300"
        width="650"
        height="300"
        class="svg-root"
      ></svg>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Other',
  data() {
    return {
      vuid: this.$vuuid().slice(0, 8),
      appData: null,
      height: 300,
      width: 650,
      margin: { l: 40, t: 20, r: 0, b: 30 },
      offset: {
        t: 10,
        r: 10
      },
      axisXLaneHeight: 60,
      axisYLaneWidth: 35,
      xValue: d => d.key,
      yValue: d => d.value
    }
  },
  mounted() {
    const _this = this
    setTimeout(() => {
      _this.appData = [
        { key: 'North', value: 10 },
        { key: 'East', value: 51 },
        { key: 'West', value: 33 },
        { key: 'South', value: 74 }
      ]
      _this.draw()
    }, 2000)
  },
  computed: {
    ds() {
      return this.appData
    },
    iH() {
      return this.height - this.margin.t - this.margin.b
    },
    iW() {
      return this.width - this.margin.l - this.margin.r
    },
    xScale() {
      const { iW, ds, xValue } = this
      return d3
        .scaleBand()
        .domain(ds.map(xValue))
        .range([0, iW])
        .padding(0.1)
    },
    yScale() {
      const { iH, ds, yValue } = this
      return d3
        .scaleLinear()
        .domain([0, d3.max(ds, yValue)])
        .nice()
        .range([iH, 0])
    }
  },
  methods: {
    draw() {
      const { xScale, yScale, iH } = this
      const svgRoot = d3.selectAll('#svgRoot').data([null])
      const svg = svgRoot
        .enter()
        .append('svg')
        .merge(svgRoot)
      svg
        .append('defs')
        .append('clipPath')
        .attr('id', this.vuid)
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', this.iW)
        .attr('height', this.iH)
        .attr('fill', 'steelblue')
      const wrap = svg
        .append('g')
        .attr('transform', `translate(40, 20)`)
        .classed('svg-wrap', true)

      const xAxis = d3
        .axisBottom()
        .tickSizeOuter(0)
        .scale(xScale)
      const axisXLane = wrap
        .append('g')
        .classed('x-axis-lane', true)
        .attr('transform', `translate(0, ${iH})`)
        .call(xAxis)
      axisXLane
        .attr('font-size', 12)
        .attr('font-weight', 500)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0.8)
        .attr('font-family', 'Roboto')

      const yAxis = d3
        .axisLeft()
        .scale(yScale)
        .tickSize(8)
        .tickPadding(10)
      const axisYLane = wrap
        .append('g')
        .classed('y-axis-lane', true)
        .attr('transform', `translate(0, 0)`)
        .call(yAxis)
      axisYLane
        .attr('font-size', 12)
        .attr('font-weight', 500)
        .attr('text-anchor', 'end')
        .attr('opacity', 0.8)
        .attr('font-family', 'Roboto')
        .select('.domain')
        .remove()
      // const barsGrp = wrap.append('g').classed('bars-group', true)
      // const bars = barsGrp.selectAll('rect').data(this.ds)
      // const barsEnter = bars.enter()
      // const bar = barsEnter
      //   .append('rect')
      //   .attr('clip-path', `url(#${this.vuid})`)
      //   .merge(bars)
      //   .attr('x', d => xScale(xValue(d)))
      //   .attr('y', iH)
      //   .attr('height', 0)
      //   .attr('width', xScale.bandwidth())
      //   .attr('fill', 'steelblue')
      //   .attr('fill-opacity', 0.8)
      //   .transition()
      //   .duration(200)
      //   .ease(d3.easeQuadInOut)
      //   .delay((d, i) => i * 20)
      //   .attr('y', d => yScale(yValue(d)))
      //   .attr('height', d => iH - yScale(yValue(d)))
    }
  }
}
</script>

<style lang="scss" scoped></style>
