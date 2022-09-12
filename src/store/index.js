import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist'
import persist from 'vuex-localstorage'

// Modules
import auth from './auth.js'
import devices from './devices.js'
import koi from './koi.js'

Vue.use(Vuex)
/*
const vuexLocalStorage = new VuexPersist({
  key: "vuex"
})
*/

export const store = new Vuex.Store({
  // plugins: [vuexLocalStorage.plugin],
  plugins: [persist({
    namespace: 'cooltrax-aad',
    initialState: {},
    expires: 7 * 24 * 60 * 60 * 1e3 // 1 week
  })],
  modules: {
   auth,
   devices,
   koi
  }
})

export default store
