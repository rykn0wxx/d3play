/**
 * Vue
 * @library
 */
// Lib imports
import Vue from 'vue'

// Application plugins
import vuuid from './plugins/vuuid'
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
import { createVuetify } from './plugins/vuetify'

// Application implementation
sync(store, router)
const vuetify = createVuetify({
  theme: { dark: true }
})
Vue.use(vuuid)
Vue.use(Vs)
Vue.use(VD3)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  mixins: [meta],
  vuetify,
  render: h => h(App)
}).$mount('#app')
