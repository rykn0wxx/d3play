/**
 * Vue
 * @library
 */
// Lib imports
import Vue from 'vue'

// Application plugins
import Vs from 'd3-vs'
import { sync } from 'vuex-router-sync'
import meta from '@/plugins/meta'
import '@/sass/app.scss'

// Application imports
import '@/directives'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/components/global'

// Application implementation
sync(store, router)
Vue.use(Vs)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  mixins: [meta],
  render: h => h(App)
}).$mount('#app')
