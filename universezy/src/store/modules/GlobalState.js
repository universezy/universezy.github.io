import * as types from '../mutation-types'

const state = {
  isCollapsed: false
}

const mutations = {
  [types.IS_COLLAPSED] (state, isCollapsed) {
    state.isCollapsed = isCollapsed
  }
}

const actions = {
  changeState ({commit}, isCollapsed) {
    commit(types.IS_COLLAPSED, isCollapsed)
  }
}

export default {
  state,
  mutations,
  actions
}
