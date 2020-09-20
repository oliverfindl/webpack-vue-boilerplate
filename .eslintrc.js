"use strict";

module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/essential"
	],
	"globals": {
		"PUBLIC_PATH": "readonly",
		"PRODUCTION_BUILD": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 12,
		"parser": "babel-eslint",
		"sourceType": "module"
	},
	"plugins": [
		"vue"
	],
	"rules": {
		"no-console": process.env.WEBPACK_DEV_SERVER ? "off" : "error",
		"no-debugger": process.env.WEBPACK_DEV_SERVER ? "off" : "error",
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
