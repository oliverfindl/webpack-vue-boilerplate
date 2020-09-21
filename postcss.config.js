"use strict";

const autoprefixer = require("autoprefixer");
const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
	syntax: "postcss-scss",
	plugins: [
		autoprefixer(),
		purgecss({
			content: [ "src/index.html", "src/**/*.js", "src/**/*.vue" ],
			defaultExtractor(content) {
				const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, "");
				return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
			},
			safelist: [ /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/ ],
			keyframes: true,
			fontFace: true,
			variables: true
		})
	]
};
