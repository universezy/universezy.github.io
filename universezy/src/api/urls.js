export const originUrl = 'https://universezy.github.io/'
const absoluteResUrl = 'https://raw.githubusercontent.com/universezy/universezy.github.io/master/universezy/dist/static/'
const relativeResUrl = './static/'
const basePageUrl = 'https://universezy.github.io/universezy/dist/index.html#/'
const baseQQShareUrl = 'http://connect.qq.com/widget/shareqq/index.html'
const baseQZoneShareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey'
const baseWeiboShareUrl = 'http://service.weibo.com/share/share.php'

export const markdownApi = {
  getBioUrl: () => {
    return relativeResUrl + 'bio/bio.md'
  },
  getBlogUrl: (id) => {
    return relativeResUrl + 'blog/' + id + '.md'
  }
}

export const blogApi = {
  getRedirectUrl: (id) => {
    return originUrl + '?blog$' + id
  },
  getPageUrl: (id) => {
    return id === null ? basePageUrl + 'blog' : basePageUrl + 'blog/display/' + id
  }
}

export const categoryApi = {
  getRedirectUrl: (category) => {
    return originUrl + '?category$' + category
  },
  getPageUrl: (id) => {
    return id === null ? basePageUrl + 'category' : basePageUrl + 'blog/category/' + id
  }
}

export const columnApi = {
  getRedirectUrl: (column) => {
    return originUrl + '?column$' + column
  },
  getPageUrl: (id) => {
    return id === null ? basePageUrl + 'column' : basePageUrl + 'blog/column/' + id
  }
}

export const imageApi = {
  getLogoUrl: () => {
    return absoluteResUrl + 'logo.png'
  },
  getBannerUrl: (name) => {
    return relativeResUrl + 'banner/' + name + '.jpg'
  },
  getCategoryUrl: (name) => {
    return relativeResUrl + 'category/' + name + '.png'
  },
  getFavorite: (name) => {
    return relativeResUrl + 'favorite/' + name + '.jpg'
  }
}

export const shareBlogApi = {
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
  },
  getWeiboUrl: (blog) => {
    var url = baseWeiboShareUrl +
      '?url=' + blogApi.getRedirectUrl(blog.id) +
      '&pic=' + imageApi.getLogoUrl() +
      '&title=' + blog.title +
      '&content=' + 'utf-8'
    return encodeURI(url)
  }
}

export const shareOtherApi = {
  getQQUrl: (shareBean) => {
    var shareUrl = baseQQShareUrl +
      '?url=' + shareBean.url +
      '&pics=' + shareBean.src +
      '&title=' + shareBean.title +
      '&summary=' + shareBean.desc
    return encodeURI(shareUrl)
  },
  getQZoneUrl: (shareBean) => {
    var shareUrl = baseQZoneShareUrl +
      '?url=' + shareBean.url +
      '&pics=' + shareBean.src +
      '&title=' + shareBean.title +
      '&summary=' + shareBean.desc
    return encodeURI(shareUrl)
  },
  getWeiboUrl: (shareBean) => {
    var shareUrl = baseWeiboShareUrl +
      '?url=' + shareBean.url +
      '&pic=' + shareBean.src +
      '&title=' + shareBean.title +
      '&content=' + 'utf-8'
    return encodeURI(shareUrl)
  }
}
