# webpack-vue-boilerplate

![license](https://img.shields.io/github/license/oliverfindl/webpack-vue-boilerplate.svg?style=flat)
[![paypal](https://img.shields.io/badge/donate-paypal-blue.svg?colorB=0070ba&style=flat)](https://paypal.me/oliverfindl)

Simple boilerplate for building [Vue](https://github.com/vuejs/vue) app with [Webpack](https://github.com/webpack/webpack).

---

## Install

```bash
# Clone repository from GitHub to <folder-name>
$ git clone https://github.com/oliverfindl/webpack-vue-boilerplate <folder-name>

# Switch to <folder-name>
$ cd <folder-name>

# Install all dependencies
$ npm install

# [optional] Update all dependencies
$ npm update
```

## Usage

```bash
# Start Webpack development server with Hot Module Replacement enabled
$ npm run dev

# Build and minify Vue app
$ npm run build
```

## App structure

```
.                       # root
├── dist                # folder for distributables 
├── src                 # folder for source code
│   ├── assets          # folder for assets (images, video, audio, fonts, etc.)
│   ├── App.vue         # main Vue component file
│   ├── index.html      # index file for Vue app
│   └── main.js         # main Vue app file
├── package.json        # configuration file for npm
└── webpack.config.js   # configuration file for Webpack
```

---

## License

[MIT](http://opensource.org/licenses/MIT)
