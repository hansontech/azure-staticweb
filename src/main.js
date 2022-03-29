import Vue from 'vue'
import App from './App.vue'
import Root from './Root'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from './router'
// import { store } from './store'
import store from './store/index.js'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar)


const hostUrl = window.location.protocol + '//' + window.location.host
console.log('host url: ', hostUrl)

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Vue.use(Vuex)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.config.devtools = false

Vue.component('App', App)

new Vue({
  // el: '#app', // mount to the element with the id is app #app
  // template: '<Root/>',
  // render: h => h(App),
  router,
  store,
  /*
  components: {
    Root
  }
  */
  ...Root
}).$mount('#app')
