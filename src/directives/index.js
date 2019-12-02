import Vue from 'vue'
import Resize from './resize'

Vue.directive(Resize.name, {
  inserted: Resize.inserted,
  unbind: Resize.unbind
})
