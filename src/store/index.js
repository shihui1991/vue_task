import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user2 from './modules/user2'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user2
  },
  getters
})

export default store
