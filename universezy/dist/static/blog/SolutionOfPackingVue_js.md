## 一、 问题描述

用脚手架vue-cli编写的工程，使用"npm run build"打包出静态网页，不管是直接打开还是放在服务器里，都是空白一片，检查日志或者网络请求发现路径错误。

---
## 二、 问题原因

脚手架配置文件中路径需要修改。

---
## 三、 解决方案
### 1. 

找到"/config/index.js"文件，build部分，将"assetsPublicPath"值改为"./"，"/"是根目录绝对路径，"./"是当前目录相对路径。

```javascript
build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
```

### 2.

上一个办法可能解决部分问题，打开不是空白了，但是一些图片资源仍然无法加载，检查出错的url可能发现多了两级目录，那么打开"/build/utils.js"文件，"if (options.extract)"中，"ExtractTextPlugin.extract"参数列表增加"publicPath: '../../'"。
```javascript
if (options.extract) {
  return ExtractTextPlugin.extract({
    use: loaders,
    fallback: 'vue-style-loader',
    publicPath: '../../'
  })
} else {
  return ['vue-style-loader'].concat(loaders)
}
```

---
## 四、 备注说明

因为路径涉及的情况很多，例如网页中的url，css中的url，问题较复杂，因此这里提供的两种方案仅供参考，读者可以尝试，但并非一定符合读者出现的问题，所以可能无法解决问题。
