const defaultOptions = {
  options: {
    fill: '#6eadc1',
    stroke: '#6eadc1',
    fillOpacity: 0.6,
    strokeOpacity: 1,
    barTitle: d => `${d.value}`,
    tickSize: 10,
    tickPadding: 8,
    axisFontSize: 12,
    axisFontWeight: 400,
    axisFontOpacity: 0.5,
    axisYLabel: null,
    axisXLabel: null,
    axisLabelFontSize: 14,
    axisLabelFontWeight: 600,
    axisLabelFontOpacity: 1,
    axisXLaneHeight: 60,
    axisYLaneWidth: 35,
    axisXInterval: null,
    isAxisPathShow: true,
    isAxisTickShow: true,
    animationDuration: 1000,
    delay: 50,
    axisYTickFormat: '.2s',
    negative: false,
    nice: true,
    yAxisRuler: true,
    paddingOuter: 0.1,
    paddingInner: 0.1
  },
  offset: {
    top: 10,
    right: 10
  },
  margin: { l: 0, r: 0, t: 0, b: 0 },
  classes: {
    root: 'svg-root',
    wrap: 'svg-wrap',
    plot: 'svg-plot',
    xAxis: 'axis x-axis',
    yAxis: 'axis y-axis'
  }
}

export { defaultOptions }
