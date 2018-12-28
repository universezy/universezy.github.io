const baseUrl = 'https://raw.githubusercontent.com/universezy/universezy.github.io/master/universezy/dist/static/'

export const markdownApi = {
  getBioUrl: function () {
    return baseUrl + 'bio/bio.md'
  },
  getBlogUrl: function (id) {
    return baseUrl + 'blog/' + id + '.md'
  }
}
