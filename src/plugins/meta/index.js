/**
 * Vue Meta
 * @library
 */
// Lib imports
import Vue from 'vue'
import Meta from 'vue-meta'

Vue.use(Meta, {
  keyName: 'metaInfo',
  refreshOnceOnNavigation: true,
  tagIDKeyName: 'vmid'
})

export default {
  data() {
    return {
      meta: {},
      metaInfo: {}
    }
  }
}
