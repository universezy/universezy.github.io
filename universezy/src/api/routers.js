export const globalRouters = {
  getBlogTabRouter: (name) => {
    return '/blog/tab/' + name
  },
  getCategoryRouter: (name) => {
    return '/blog/category/' + name
  },
  getColumnRouter: (name) => {
    return '/blog/column/' + name
  },
  getTagRouter: (name) => {
    return '/blog/tag/' + encodeURI(name)
  },
  getDisplayRouter: (name) => {
    return '/blog/display/' + name
  }
}
