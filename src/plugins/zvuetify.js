/**
 * Vuetify
 * @library
 */
// Lib imports
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const baseColors = {
  pri: '#113dab',
  sec: '#5127c4',
  acc: '#00b294',
  error: '#FF5630',
  info: '#6554C0',
  success: '#36B37E',
  warning: '#FFAB00',
  background: '#18191c',
  onlight: '#ECF0F1',
  ondark: '#050709',
  surface: '#303033',
  dp01: '#242528',
  dp02: '#28292c',
  dp03: '#2a2b2e',
  dp04: '#2d2e30',
  dp06: '#313235',
  dp08: '#343538',
  dp12: '#39393c',
  dp16: '#3a3b3e',
  dp24: '#3d3e40'
}

export default new Vuetify({
  options: {
    customProperties: false
  },
  theme: {
    themes: {
      light: {
        primary: '#9aa7e0',
        secondary: '#b79de9',
        accent: '#53f2e2',
        ...baseColors
      },
      dark: {
        primary: '#264fc1',
        secondary: '#6b34d3',
        accent: '#00d4b7',
        ...baseColors
      }
    }
  },
  icons: {
    iconfont: 'md'
  }
})
