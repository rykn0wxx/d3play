import Vue from 'vue'
import { upperFirst, camelCase } from 'lodash'

const requireComponent = require.context('@/components/visuals', true, /\.vue$/)

requireComponent.keys().forEach(fileName => {
  if (fileName === './index.js') {
    return
  }
  const componentConfig = requireComponent(fileName)
  const camelize = camelCase(
    fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  )
  const upperize = upperFirst(camelize)
  const componentName = `G${upperize}`
  Vue.component(componentName, componentConfig.default || componentConfig)
})
