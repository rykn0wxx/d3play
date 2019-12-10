/**
 * Vue
 * @library
 */
// Lib imports
import Vue from 'vue'

// Application plugins
// import Vuetify from 'vuetify'
import Vs from 'd3-vs'
import { sync } from 'vuex-router-sync'
import meta from '@/plugins/meta'
import VD3 from '@/plugins/vd3'
import '@/sass/app.scss'

// Application imports
import '@/directives'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/components/global'

// Application implementation
// const appVuetify = function() {
//   const myVuetify = new Vuetify({
//     theme: {
//       themes: {
//         light: {
//           primary: '#1867C0',
//           secondary: '#5CBBF6',
//           tertiary: '#E57373',
//           accent: '#005CAF'
//         }
//       }
//     }
//   })
//   return myVuetify
// }
// const ownVuetify = appVuetify()

// Vue.use(Vuetify, {})
// console.log(Vuetify)
sync(store, router)
Vue.use(Vs)
Vue.use(VD3)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  mixins: [meta],
  render: h => h(App)
}).$mount('#app')
