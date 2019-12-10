import { axisBottom, scaleLinear, scaleBand, axisLeft, max } from 'd3'

const barMixins = {
  data() {
    return {
      windowResizeObserver: null,
      options: {
        dimensions: {
          h: 300,
          w: 960
        },
        margin: { l: 40, t: 20, r: 0, b: 30 },
        fill: '#137B80',
        font: {
          family: 'Segoe UI',
          size: 12,
          weight: 400
        },
        classes: {
          root: 'svg-root',
          wrap: 'svg-wrap',
          plot: 'svg-plot',
          xAxis: 'x-axis',
          yAxis: 'y-axis'
        },
        chartDims: {}
      }
    }
  },
  methods: {
    xValue() {
      return d => d.key
    },
    xScale() {
      const { data, chartDims } = this.options
      return scaleBand()
        .domain(data.map(this.xValue()))
        .range([0, chartDims.w - 2])
        .padding(0.1)
    },
    xAxis() {
      const { chartDims } = this.options
      return g =>
        g
          .attr('transform', `translate(0, ${chartDims.h})`)
          .classed('x-axis__g', true)
          .call(axisBottom(this.xScale()).tickSizeOuter(0))
    },
    yValue() {
      return d => d.value
    },
    yScale() {
      const { data, chartDims } = this.options
      return scaleLinear()
        .domain([0, max(data, this.yValue())])
        .nice()
        .range([chartDims.h, 0])
    },
    yAxis() {
      return g =>
        g
          .attr('transform', `translate(0, 0)`)
          .classed('y-axis__g', true)
          .call(axisLeft(this.yScale()))
    }
  }
}

export default barMixins
