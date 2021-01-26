import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import route from './modules/route'
import settings from './modules/settings'
import admin from './modules/admin'
import api from './modules/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    admin,
    api,
    route
  },
  getters
})

export default store
