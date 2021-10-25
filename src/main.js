import Vue from 'vue'
import App from './App.vue'
import Root from './Root'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from './router'
import { store } from './store'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false

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
  } */
  ...Root
}).$mount('#app')
