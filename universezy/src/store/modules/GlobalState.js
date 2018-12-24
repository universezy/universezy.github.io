import * as types from '../mutation-types'

const state = {
  isCollapsed: false,
  noticeShow: true
}

const mutations = {
  [types.IS_COLLAPSED] (state, isCollapsed) {
    state.isCollapsed = isCollapsed
  },
  [types.NOTICE_SHOW] (state) {
    state.noticeShow = false
  }
}

const actions = {
  changeSider ({commit}, isCollapsed) {
    commit(types.IS_COLLAPSED, isCollapsed)
  },
  closeNotice ({commit}) {
    commit(types.NOTICE_SHOW)
  }
}

export default {
  state,
  mutations,
  actions
}
