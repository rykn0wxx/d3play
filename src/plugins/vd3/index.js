// ;(() => {
//   const VD3 = {}
//   const D3 = typeof require === 'function' ? require('d3') : window.D3
//   if (!D3) throw new Error('[v-d3] cannot locate d3')

//   VD3.install = function(Vue) {
//     Vue.prototype.vd3 = D3
//   }
//   if (typeof exports === 'object') {
//     module.exports = VD3
//   } else if (typeof define === 'function' && define.amd) {
//     define([], function() {
//       return VD3
//     })
//   } else if (window.Vue) {
//     window.VD3 = VD3
//     Vue.use(VD3)
//   }
// })()

import * as d3 from 'd3'

const VD3 = {}

// function init() {
//   if (typeof window !== 'undefined' && window.Vue) {
//     console.log(window)
//   }
// }

VD3.install = function(Vue, options) {
  Vue.prototype.$vd3 = d3
  // init()
  if (typeof window !== 'undefined') {
    window.VD3 = VD3
    window.$D3 = d3
    if (window.Vue) {
      window.Vue.use(VD3)
    }
  }
}

export default VD3
