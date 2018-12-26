import * as types from '../mutation-types'

const state = {
  bio: null
}

const mutations = {
  [types.DATA_BIO] (state, bio) {
    state.bio = bio
  }
}

const actions = {
  saveBio ({commit}, bio) {
    commit(types.DATA_BIO, bio)
  }
}

export default {
  state,
  mutations,
  actions
}
