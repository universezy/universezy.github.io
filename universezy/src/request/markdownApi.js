import axios from 'axios'

export default {
  request (url) {
    return axios({
      method: 'get',
      url: url,
      timeout: 5000,
      withCredentials: false
    })
  }
}
