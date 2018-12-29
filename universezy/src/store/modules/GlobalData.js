import * as types from '../mutation-types'

const state = {
  bio: null,
  title: '进击的小宇宙'
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
