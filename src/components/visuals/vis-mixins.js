import * as d3 from 'd3'

const VisMixins = {
  props: {
  },
  computed: {
    iH() {
      return this.oH - this.margin.t - this.margin.b
    },
    iW() {
      return this.oW - this.margin.l - this.margin.r
    },
    xValue() {
      return d => d.key
    },
    xScale() {
      const { iW, ds, xValue } = this
      return d3
        .scaleBand()
        .domain(ds.map(xValue))
        .range([0, iW - 2])
        .padding(0.1)
    },
    xAxis() {
      return d3
        .axisBottom()
        .tickSizeOuter(0)
        .scale(this.xScale)
    },
    yValue() {
      return d => d.value
    },
    yScale() {
      const { iH, ds, yValue } = this
      return d3
        .scaleLinear()
        .domain([0, d3.max(ds, yValue)])
        .nice()
        .range([iH, 0])
    },
    yAxis() {
      return d3.axisLeft().scale(this.yScale)
    }
  }
}

export default VisMixins
