"use strict";

const autoprefixer = require("autoprefixer");
const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
	syntax: "postcss-scss",
	plugins: [
		autoprefixer(),
		purgecss({
			content: ["src/index.html", "src/**/*.js", "src/**/*.vue"],
			keyframes: true,
			fontFace: true,
			variables: true
		})
	]
};
