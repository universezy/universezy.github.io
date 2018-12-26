import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'
import GlobalState from './modules/GlobalState'
import GlobalData from './modules/GlobalData'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  mutations,
  getters,
  modules: {
    GlobalState,
    GlobalData
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
