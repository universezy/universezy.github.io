import * as types from '../mutation-types'

const state = {
  isCollapsed: false,
  isNoticeShow: true,
  bio: null
}

const mutations = {
  [types.SET_COLLAPSED] (state, isCollapsed) {
    state.isCollapsed = isCollapsed
  },
  [types.CLOSE_NOTICE] (state) {
    state.isNoticeShow = false
  }
}

const actions = {
  changeSider ({commit}, isCollapsed) {
    commit(types.SET_COLLAPSED, isCollapsed)
  },
  closeNotice ({commit}) {
    commit(types.CLOSE_NOTICE)
  }
}

export default {
  state,
  mutations,
  actions
}
