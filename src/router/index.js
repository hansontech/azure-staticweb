import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import LoginCallback from '@/components/LoginCallback'
import LogoutCallback from '@/components/LogoutCallback'
import TagSetting from '@/components/TagSetting'
import ListDevices from '@/components/ListDevices'
import ListTags from '@/components/ListTags'
import ListSensorTags from '@/components/ListSensorTags'
import ListGoldfishGateways from '@/components/ListGoldfishGateways'
import store from '../store'
// vue-router reference
// https://router.vuejs.org/guide/essentials/named-routes.html

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'home',
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
      path: '/loggedin',
      name: 'loggedin',
      component: LoginCallback,
      meta: {
        title: 'Logged in',
        auth: false
      }
    },
    {
      path: '/loggedout',
      name: 'loggedout',
      component: LogoutCallback,
      meta: {
        title: 'Logged Out',
        auth: false
      }
    },
    {
      path: '/list_devices',
      name: 'list_devices',
      component: ListDevices,
      meta: {
        title: 'List Devices',
        auth: true
      }
    },
    {
      path: '/list_tags',
      name: 'list_tags',
      component: ListTags,
      meta: {
        title: 'List Tags',
        auth: true
      }
    },
    {
      path: '/list_sensortags',
      name: 'list_sensortags',
      component: ListSensorTags,
      meta: {
        title: 'List SensorTags',
        auth: true
      }
    },
    {
      path: '/list_goldfish_gateways',
      name: 'list_goldfish_gateways',
      component: ListGoldfishGateways,
      meta: {
        title: 'List Goldfish Gateways',
        auth: true
      }
    },
    {
      path: '/set_tag/:deviceId?',
      name: 'set_tag',
      component: TagSetting,
      props: true,
      meta: {
        title: 'Set Tag',
        auth: true
      }
    }
    //   AuthRouter
  ]
})

router.beforeEach((to, from, next) => {
  // Use the page's router title to name the page
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }

  // Redirect to the home page if not authenticated
  // for pages that have 'auth: true' set, and not in debug
  console.log('protocol: ', window.location.protocol)
  if (window.location.protocol !== 'http:' && to.meta && to.meta.auth !== undefined) {
    if (to.meta.auth) { // if 'to' page needs authentication
      if (store.getters.isAuthenticated) { // and user has been authenticated
        next() // continue go to 'to' page
      } else {
        // TODO hostUrl https
        // const hostUrl = window.location.protocol + '//' + window.location.host
        // router.replace('/.auth/login/aad?post_login_redirect_uri=' + to.path) // login to Active Directory
        window.location.href = '/.auth/login/aad?post_login_redirect_uri=/loggedin'
        // next()
      }
    } else { // if the 'to' page does not need the authentication
      next()
    }
  } else { // if 'to' page does not care about authorization
    next()
  }
})

export default router
