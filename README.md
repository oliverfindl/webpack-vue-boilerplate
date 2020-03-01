# webpack-vue-boilerplate

[![license](https://img.shields.io/github/license/oliverfindl/webpack-vue-boilerplate.svg?style=flat)][mit]
[![paypal](https://img.shields.io/badge/donate-paypal-blue.svg?colorB=0070ba&style=flat)](https://paypal.me/oliverfindl)

Simple boilerplate for building [Vue](https://github.com/vuejs/vue) app with [Webpack](https://github.com/webpack/webpack).

---

## Install

```bash
# Clone repository from GitHub to <directory>
$ git clone https://github.com/oliverfindl/webpack-vue-boilerplate <directory>

# Switch to <directory>
$ cd <directory>

# Install all dependencies
$ npm install

# [optional] Check and update all dependencies
$ npm outdated
$ npm update
```

## Usage

```bash
# Launch Webpack development server with Vue app loaded
$ npm run dev

# Build Vue app
$ npm run build
```

## App structure

```bash
.                       # root
├── dist                # directory for distributables
├── src                 # directory for source code
│   ├── assets          # directory for assets (images, video, audio, fonts, etc.)
│   ├── App.vue         # main Vue component file
│   ├── index.html      # index file for Vue app
│   └── main.js         # main Vue app file
├── package.json        # npm configuration file
├── postcss.config.js   # postcss configuration file
└── webpack.config.js   # Webpack configuration file
```

---

## License

[MIT][mit]

[mit]: https://opensource.org/licenses/MIT
