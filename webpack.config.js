"use strict";

const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const PUBLIC_PATH = "/";

module.exports = {
	mode: process.env.NODE_ENV,
	target: "web",
	entry: path.resolve(__dirname, "src/main.js"),
	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: PUBLIC_PATH,
		filename: "javascript/[name].[hash:8].js",
		chunkFilename: "javascript/[id].[chunkhash:8].js"
	},
	devServer: {
		historyApiFallback: true,
		overlay: {
			warnings: true,
			errors: true
		}
	},
	performance: {
		hints: false
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: "vue-loader"
		}, {
			test: /\.js$/,
			loader: "babel-loader",
			exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
			options: {
				presets: ["vue", "env", "minify", "stage-2"]
			}
		}, {
			test: /\.css$/,
			use: [
				"vue-style-loader",
				"css-loader"
			]
		}, {
			test: /\.scss$/,
			use: [
				"vue-style-loader",
				"css-loader",
				"sass-loader"
			]
		}, {
			test: /\.sass$/,
			use: [
				"vue-style-loader",
				"css-loader",
				"sass-loader?indentedSyntax"
			]
		}, {
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loader: "file-loader",
			options: {
				name: "images/[name].[hash:8].[ext]"
			}
		}, {
			test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
			loader: "file-loader",
			options: {
				name: "media/[name].[hash:8].[ext]"
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: "file-loader",
			options: {
				name:"fonts/[name].[hash:8].[ext]"
			}
		}]
	},
	plugins: [
		new VueLoaderPlugin(),
		new CleanWebpackPlugin(["dist"]),
		new CopyWebpackPlugin([{
			from: "src/.ht*",
			to: "[name].[ext]"
		}, {
			from: "src/manifest.json",
			to: "[name].[ext]"
		}, {
			from: "src/assets/manifest-icon-*.png",
			to: "images/[name].[ext]"
		}]),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "src/index.html",
			inject: true,
			favicon: "src/assets/favicon.ico",
			minify: {
				collapseInlineTagWhitespace: true,
				collapseWhitespace: true,
				html5: true,
				keepClosingSlash: true,
				removeComments: true
			},
			xhtml: true
		}),
		new SWPrecacheWebpackPlugin({
			cacheId: require(path.resolve(__dirname,"package.json")).name,
			filename: "service-worker.js",
			minify: true,
			navigateFallback: PUBLIC_PATH + "index.html",
			staticFileGlobs: [PUBLIC_PATH + "index.html", "dist/*.ico", "dist/**/*.{html,css,js,json,png,jpg,gif,svg,ico,eot,ttf,woff}"],
			staticFileGlobsIgnorePatterns: [/\.map$/],
			stripPrefix: "dist/"
		})
	],
	resolve: {
		extensions: [".js", ".vue", ".json"],
		alias: {
			"vue$": "vue/dist/vue.esm.js",
			"@": path.resolve(__dirname, "src")
		}
	}
};
