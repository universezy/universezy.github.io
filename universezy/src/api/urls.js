const baseResourceUrl = 'https://raw.githubusercontent.com/universezy/universezy.github.io/master/universezy/dist/static/'
const basePageUrl = 'https://universezy.github.io/universezy/dist/index.html#/'
const baseQQShareUrl = 'http://connect.qq.com/widget/shareqq/index.html?'
const baseQZoneShareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'

export const markdownApi = {
  getBioUrl: () => {
    return baseResourceUrl + 'bio/bio.md'
  },
  getBlogUrl: (id) => {
    return baseResourceUrl + 'blog/' + id + '.md'
  }
}

export const blogApi = {
  getPageUrl: (id) => {
    return id === null ? basePageUrl + 'blog' : basePageUrl + 'blog/display?id=' + id
  }
}

export const imageApi = {
  getLogoUrl: () => {
    return baseResourceUrl + 'logo.png'
  }
}

export const shareApi = {
  getQQUrl: (blog) => {
    var url = baseQQShareUrl +
      'url=' + blogApi.getPageUrl(blog.id) +
      '&pics=' + imageApi.getLogoUrl() +
      '&title=' + blog.title +
      '&summary=' + blog.abstract
    return encodeURI(url)
  },
  getQZoneUrl: (blog) => {
    var url = baseQZoneShareUrl +
      'url=' + blogApi.getPageUrl(blog.id) +
      '&pics=' + imageApi.getLogoUrl() +
      '&title=' + blog.title +
      '&summary=' + blog.abstract
    return encodeURI(url)
  }
}
