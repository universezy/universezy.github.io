const baseResourceUrl = 'https://raw.githubusercontent.com/universezy/universezy.github.io/master/universezy/dist/static/'
const basePageUrl = 'https://universezy.github.io/universezy/dist/index.html#/'

export const markdownApi = {
  getBioUrl: function () {
    return baseResourceUrl + 'bio/bio.md'
  },
  getBlogUrl: function (id) {
    return baseResourceUrl + 'blog/' + id + '.md'
  }
}

export const blogApi = {
  getPageUrl: function (id) {
    return basePageUrl + 'blog/display?id=' + id
  }
}
