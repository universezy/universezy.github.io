const originUrl = 'https://universezy.github.io/'
// const baseResourceUrl = 'https://raw.githubusercontent.com/universezy/universezy.github.io/master/universezy/dist/static/'
const baseResourceUrl = './static/'
const basePageUrl = 'https://universezy.github.io/universezy/dist/index.html#/'
const baseQQShareUrl = 'http://connect.qq.com/widget/shareqq/index.html'
const baseQZoneShareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey'

export const markdownApi = {
  getBioUrl: () => {
    return baseResourceUrl + 'bio/bio.md'
  },
  getBlogUrl: (id) => {
    return baseResourceUrl + 'blog/' + id + '.md'
  }
}

export const blogApi = {
  getRedirectUrl: (id) => {
    return originUrl + '?blogId=' + id
  },
  getPageUrl: (id) => {
    return id === null ? basePageUrl + 'blog' : basePageUrl + 'blog/display/' + id
  }
}

export const imageApi = {
  getLogoUrl: () => {
    return baseResourceUrl + 'logo.png'
  },
  getBannerUrl: (name) => {
    return baseResourceUrl + 'banner/' + name + '.jpg'
  },
  getCategoryUrl: (name) => {
    return baseResourceUrl + 'category/' + name + '.png'
  },
  getFavorite: (name) => {
    return baseResourceUrl + 'favorite/' + name + '.jpg'
  }
}

export const shareApi = {
  getQQUrl: (blog) => {
    var url = baseQQShareUrl +
      '?url=' + blogApi.getRedirectUrl(blog.id) +
      '&pics=' + imageApi.getLogoUrl() +
      '&title=' + blog.title +
      '&summary=' + blog.abstract
    return encodeURI(url)
  },
  getQZoneUrl: (blog) => {
    var url = baseQZoneShareUrl +
      '?url=' + blogApi.getRedirectUrl(blog.id) +
      '&pics=' + imageApi.getLogoUrl() +
      '&title=' + blog.title +
      '&summary=' + blog.abstract
    return encodeURI(url)
  }
}
