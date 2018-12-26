import * as types from '../mutation-types'

const state = {
  bio: null
}

const mutations = {
  [types.SAVE_BIO] (state, bio) {
    state.bio = bio
  }
}

const actions = {
  saveBio ({commit}, bio) {
    commit(types.SAVE_BIO, bio)
  }
}

export default {
  state,
  mutations,
  actions
}
