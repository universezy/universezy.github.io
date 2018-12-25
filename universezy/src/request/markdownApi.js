import {
  baseUrl
} from './urls'
import axios from 'axios'

export default {
  request (filePath) {
    return axios({
      method: 'get',
      baseURL: baseUrl.getUrl(),
      url: filePath,
      timeout: 5000,
      withCredentials: false
    })
  }
}
