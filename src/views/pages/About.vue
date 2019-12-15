<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div id="chart-wrapper" class="chart"></div>
  </div>
</template>

<script>
import {
  select,
  scaleLinear,
  scaleBand,
  axisBottom,
  axisLeft,
  easeQuadInOut,
  max
} from 'd3'
export default {
  name: 'About',
  data() {
    return {
      vuid: this.$vuuid().slice(0, 8),
      o: {
        w: null,
        h: 300,
        fill: '#6eadc1',
        margin: { l: 40, t: 20, r: 0, b: 30 },
        tick: { size: 10, padding: 8 },
        axis: {
          font: {
            size: 12,
            weight: 400,
            opacity: 0.6,
            family: 'Roboto'
          },
          label: {
            x: null,
            y: null,
            font: {
              size: 14,
              weight: 500,
              opacity: 0.8,
              family: 'Roboto'
            },
            h: 0,
            w: 0
          },
          lane: { xHeight: 40, yWidth: 40 }
        },
        offset: { t: 10, r: 10 }
      },
      xValue: d => d.key,
      yValue: d => d.value,
      isLoaded: false,
      ds: [
        { key: 'North', value: 10 },
        { key: 'East', value: 51 },
        { key: 'West', value: 33 },
        { key: 'South', value: 74 }
      ]
    }
  },
  computed: {
    oH() {
      return this.o.h ? this.o.h : this.$el.clientHeight
    },
    oW() {
      return this.o.w ? this.o.h : this.$el.clientWidth - 2
    },
    iH() {
      const { margin, axis, offset } = this.o
      return (
        this.oH -
        margin.t -
        margin.b -
        axis.lane.xHeight -
        axis.label.h -
        offset.t
      )
    },
    iW() {
      const { margin, axis, offset } = this.o
      console.log(this.oW - margin.l - margin.r)
      return (
        this.oW -
        margin.l -
        margin.r -
        axis.lane.yWidth -
        axis.label.w -
        offset.r
      )
    },
    yScale() {
      return scaleLinear()
        .range([this.iH, 0])
        .domain([0, max(this.ds, d => this.yValue(d))])
        .nice()
    },
    xScale() {
      return scaleBand()
        .range([0, this.iW])
        .paddingInner(0.3)
        .paddingOuter(0.1)
        .domain(this.ds.map(this.xValue))
    },
    xAxis() {
      const { size, padding } = this.o.tick
      return axisBottom()
        .tickSize(size)
        .tickPadding(padding)
        .tickSizeOuter(0)
        .scale(this.xScale)
    },
    yAxis() {
      const { size, padding } = this.o.tick
      return axisLeft()
        .tickSize(size)
        .tickPadding(padding)
        .scale(this.yScale)
    }
  },
  mounted() {
    this.$nextTick().then(this.draw)
  },
  methods: {
    draw() {
      console.log(this)
      const {
        oH,
        oW,
        iH,
        iW,
        vuid,
        xAxis,
        xScale,
        xValue,
        yAxis,
        yScale,
        yValue,
        ds
      } = this
      const { margin, axis, offset, fill } = this.o
      const clipId = this.$vuuid().slice(0, 8)
      const canva = select('#chart-wrapper')
      const svgRoot = canva.selectAll('svg').data([null])
      const svg = svgRoot
        .enter()
        .append('svg')
        .attr('xml:space', 'preserve')
        .attr('id', vuid)
        .classed('svg-root', true)
        .merge(svgRoot)
        .attr('width', oW)
        .attr('height', oH)
        .attr('viewBox', `0 0 ${oW} ${oH}`)
        .attr('enable-background', `new 0 0 ${oW} ${oH}`)
      svg
        .append('defs')
        .append('clipPath')
        .attr('id', clipId)
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', iW)
        .attr('height', iH)
      const axisXLane = svg
        .append('g')
        .classed('axis-x-lane', true)
        .attr(
          'transform',
          `translate(${margin.l + axis.label.w + axis.lane.yWidth}, ${margin.t +
            iH +
            offset.t})`
        )
        .append('g')
        .attr('class', 'axis axis-x-group')
        .call(xAxis)
      const axisYLane = svg
        .append('g')
        .classed('axis-y-lane', true)
        .attr(
          'transform',
          `translate(${margin.l + axis.label.w}, ${margin.t + offset.t})`
        )
        .append('g')
        .attr('class', 'axis axis-y-group')
        .attr('transform', `translate(${axis.lane.yWidth}, 0)`)
        .call(yAxis)

      axisXLane
        .attr('font-size', axis.font.size)
        .attr('font-weight', axis.font.weight)
        .attr('opacity', axis.font.opacity)
        .attr('font-family', axis.font.family)
        .attr('text-anchor', 'middle')
      axisYLane
        .attr('font-size', axis.font.size)
        .attr('font-weight', axis.font.weight)
        .attr('opacity', axis.font.opacity)
        .attr('font-family', axis.font.family)
        .attr('text-anchor', 'end')
        .select('.domain')
        .remove()

      // axisXLabelLane
      svg
        .append('g')
        .classed('axis-x-label-line', true)
        .attr(
          'transform',
          `translate(${margin.l + axis.label.w + axis.lane.yWidth}, ${margin.t +
            iH +
            axis.lane.xHeight +
            offset.t})`
        )
        .append('text')
        .classed('axis x-axis-label', true)
        .attr('text-anchor', 'middle')
        .attr('x', iW / 2)
        .attr('y', axis.label.h / 2)
        .attr('dy', '0.32em')
        .attr('fill', 'currentColor')
        .attr('fill-opacity', axis.label.font.opacity)
        .text(axis.label.x || 'x-axis')
        .attr('font-size', axis.label.font.size)
        .attr('font-weight', axis.label.font.weight)
        .attr('font-family', axis.label.font.family)
      // axisYLabelLane
      svg
        .append('g')
        .classed('axis-y-label-line', true)
        .attr('transform', `translate(${margin.l}, ${margin.t + offset.t})`)
        .append('text')
        .classed('axis y-axis-label', true)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('y', axis.label.w / 2)
        .attr('x', -iH / 2)
        .attr('fill', 'currentColor')
        .attr('fill-opacity', axis.label.font.opacity)
        .text(axis.label.y || 'y-axis')
        .attr('font-size', axis.label.font.size)
        .attr('font-weight', axis.label.font.weight)
        .attr('font-family', axis.label.font.family)

      const rectGrp = svg
        .append('g')
        .classed('chart-area', true)
        .attr(
          'transform',
          `translate(${margin.l + axis.label.w + axis.lane.yWidth}, ${margin.t +
            offset.t})`
        )
      const rectData = rectGrp.selectAll('rect').data(ds)
      const rectEnter = rectData.enter()
      const rects = rectEnter
        .append('rect')
        .attr('clip-path', `url(#${clipId})`)
        .attr('y', iH)
        .attr('height', 0)
        .attr('fill', fill)
        .merge(rectData)
        .attr('x', d => xScale(xValue(d)))
        .attr('width', xScale.bandwidth())
      let lastI = 0
      rects
        .transition()
        .duration(500)
        .ease(easeQuadInOut)
        .delay(d => {
          return yValue(d) !== 0 ? lastI++ * 50 : 0
        })
        .attr('y', d => yScale(yValue(d)))
        .attr('height', d => iH - yScale(yValue(d)))
    }
  }
}
</script>

<style lang="scss" scoped>
.forchart {
  height: 100%;
}
text {
  font-family: Roboto, Ubuntu, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  user-select: none;
}
</style>
