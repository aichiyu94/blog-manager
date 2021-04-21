const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  outputDir: 'dist',
  configureWebpack: {},

  chainWebpack: (config) => {
    config.resolve.alias.set('~$', resolve('./')).set('@$', resolve('src'))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('autoprefixer')()],
      },
    },
  },

  devServer: {
    proxy: {
      'img': {
        target: process.env.VUE_APP_IMG_API,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/img/': '/img/',
        },
      },
    },
  },

  assetsDir: 'static',
  runtimeCompiler: true,
}
