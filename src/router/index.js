/**
 * Vue Router
 * @library
 */
// Lib imports
import Vue from 'vue'
import Router from 'vue-router'
// Helpers
import scrollBehavior from './scroll-behavior'
import routerPaths from './router-paths'
import routeGenerator from './route-generator'

const appRoutes = routerPaths
  .map(path => routeGenerator(path))
  .concat([{ path: '*', redirect: '/home' }])

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: appRoutes,
  scrollBehavior,
  linkActiveClass: 'app__router--link--active'
})

export default router
