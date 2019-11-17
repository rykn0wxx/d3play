/**
 * Vuex
 * @library
 */
// Lib imports
import Vue from 'vue'
import Vuex from 'vuex'

// Store functionality
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import modules from './modules'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  strict: true,
  actions,
  getters,
  mutations,
  state,
  modules
})

if (module.hot) {
  module.hot.accept(['./actions', './getters', './mutations'], () => {
    store.hotUpdate({
      getters: require('./getters'),
      actions: require('./actions'),
      mutations: require('./mutations')
    })
  })
}

export default store
