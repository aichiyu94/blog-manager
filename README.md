
# Blog Admin system based on Vue Material Admin


[![CircleCI](https://circleci.com/gh/tookit/vue-material-admin/tree/dev.svg?style=svg)](https://circleci.com/gh/tookit/vue-material-admin/tree/dev)

English | [简体中文](./README.zh-CN.md) 

About vuetify deveopment, please check my blog [http://isocked.com], (A vuepress theme made with vuetify)

## Plan and features
* add i18n support
* refactor media page
* reffactor mail page
* build a rest api for integration [vma-api](https://github.com/tookit/vma-api)
* build a websocket server for integrating chat app

## Introduction
Vue Material Admin Template is a [Vue](https://vuejs.org/index.html/) Based Material Design Admin Template.
And use [Vuetifyjs](https://vuetifyjs.com/) as base framework.
Vuetify is Awesome.

## Live (needs account, contacts me by email aichiyu94@gmail.com)
[https://manager.aichiyu.club]

## Project Structure
``` bash
├── build
├── config (Webpack)
├── src
│   ├── api
│   ├── components
│   ├── mixins
│   ├── views (or views)
│   ├── router
│   ├── store
│   ├── util
│   ├── theme
│   │   ├── default.sass
│   └── App.vue
│   └── event.js
│   └── main.js
├── dist
├── release
├── static (or asset)
├── mock (or script to build mock data)
├── node_modules
├── test
├── README.md
├── package.json
├── index.html
└── .gitignore
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Reference

* [Vuetifyjs](https://vuetifyjs.com/)
* [Vue](https://vuejs.org/index.html/)
* [ICON](https://materialdesignicons.com/)
* [ECharts](http://echarts.baidu.com/option.html)
* [SASS](http://sass-lang.com/)

### Donate
If you find this project useful, you can buy author a glass of juice :tropical_drink:

<a href="https://www.buymeacoffee.com/aichiyu" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

## License

[MIT](https://github.com/tookit/vue-material-admin/blob/master/LICENSE)
