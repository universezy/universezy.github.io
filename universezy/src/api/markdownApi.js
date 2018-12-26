import axios from 'axios'

export default {
  fetch (url) {
    return axios({
      method: 'get',
      url: url,
      timeout: 5000,
      withCredentials: false
    })
  }
}
