import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'
import Home from '@/components/Home'
import Login from '@/components/Login'
import TagSetting from '@/components/TagSetting'

// vue-router reference
// https://router.vuejs.org/guide/essentials/named-routes.html

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: Home,
      meta: {
        title: 'AIoT: Main',
        auth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Login',
        auth: false
      }
    },
    {
      path: '/set_tag',
      name: 'set_tag',
      component: TagSetting,
      meta: {
        title: 'Set Tag',
        auth: false
      }
    }
    //   AuthRouter
  ]
})

// router.beforeEach(AuthFilter)
router.beforeEach((to, from, next) => {
  // Use the page's router title to name the page
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  // console.log('router: ', store.getters.isAuthenticated)

  // Redirect to the home page if not authenticated
  // for pages that have 'auth: true' set
  if (to.meta && to.meta.auth !== undefined) {
    /*
    if (to.meta.auth) { // if 'to' page needs authentication
      if (store.getters.isAuthenticated) { // and user has been authenticated
        next() // continue go to 'to' page
      } else {
        router.push({ name: 'signup' })
      }
    } else { // if the 'to' page does not need the authentication
      next()
    }
    */
    next()
  } else { // if 'to' page does not care about authorization
    next()
  }
})

export default router
