export const globalRouters = {
  getCategoryRouter: (name) => {
    return '/blog/category/' + name
  },
  getColumnRouter: (name) => {
    return '/blog/column/' + name
  },
  getDisplayRouter: (name) => {
    return '/blog/display/' + name
  }
}
