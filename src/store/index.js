import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

// Modules
import auth from './auth.js'

Vue.use(Vuex)
const vuexLocalStorage = new VuexPersist({
  key: "vuex"
})

export const store = new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],

  modules: {
    auth
  }
})

// export default store
