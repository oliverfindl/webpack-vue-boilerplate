"use strict";

const { resolve } = require("path");
const { DefinePlugin } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const { name: PACKAGE_NAME } = require(resolve(__dirname, "./package.json"));

const PUBLIC_PATH = "/";

const BABEL_PLUGINS = [ "@babel/plugin-syntax-dynamic-import" ];
const BABEL_PRESETS = [ [ "@babel/preset-env", {
	useBuiltIns: "usage",
	corejs: 3
} ] ];

module.exports = (env = {}) => ({
	entry: resolve(__dirname, "./src/main.js"),
	mode: env.prod ? "production" : "development",
	output: {
		filename: "javascript/[name].[hash:8].js",
		chunkFilename: "javascript/[id].[chunkhash:8].js",
		path: resolve(__dirname, "./dist"),
		publicPath: PUBLIC_PATH
	},
	module: {
		rules: [{
			enforce: "pre",
			test: /\.(vue|m?js)$/i,
			loader: "eslint-loader",
			exclude: /(node_modules|bower_components)/,
			options: {
				emitError: true,
				emitWarning: true,
				failOnError: true,
				failOnWarning: true
			}
		}, {
			test: /\.vue$/i,
			loader: "vue-loader"
		}, {
			test: /\.m?js$/i,
			loader: "babel-loader",
			exclude: /(node_modules|bower_components)/,
			options: {
				comments: false,
				minified: true,
				plugins: BABEL_PLUGINS,
				presets: BABEL_PRESETS
			}
		}, {
			test: /\.css$/i,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						hmr: !env.prod
					}
				},
				{
					loader: "css-loader",
					options: {
						esModule: false,
						importLoaders: 1
						// 0 => no loaders (default);
						// 1 => postcss-loader;
					}
				},
				"postcss-loader"
			]
		}, {
			test: /\.scss$/i,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						hmr: !env.prod
					}
				},
				{
					loader: "css-loader",
					options: {
						esModule: false,
						importLoaders: 2
						// 0 => no loaders (default);
						// 1 => postcss-loader;
						// 2 => postcss-loader, sass-loader
					}
				},
				"postcss-loader",
				{
					loader: "sass-loader",
					options: {
						sassOptions: {
							outputStyle: "compressed"
						}
					}
				}
			]
		}, {
			test: /\.sass$/i,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						hmr: !env.prod
					}
				},
				{
					loader: "css-loader",
					options: {
						esModule: false,
						importLoaders: 2
						// 0 => no loaders (default);
						// 1 => postcss-loader;
						// 2 => postcss-loader, sass-loader
					}
				},
				"postcss-loader",
				{
					loader: "sass-loader",
					options: {
						sassOptions: {
							indentedSyntax: true,
							outputStyle: "compressed"
						}
					}
				}
			]
		}, {
			test: /\.svg(\?.*)?$/i,
			use: [{
				loader: "file-loader",
				options: {
					name: "images/[name].[hash:8].[ext]",
					esModule: false
				}
			}, {
				loader: "svgo-loader",
				options: {
					plugins: [{
						removeViewBox: false
					}]
				}
			}]
		}, {
			test: /\.(png|jpe?g|webp|gif|ico)(\?.*)?$/i,
			loader: "file-loader",
			options: {
				name: "images/[name].[hash:8].[ext]",
				esModule: false
			}
		}, {
			test: /\.(mp4|webm|ogg|mp3|aac|wav|flac)(\?.*)?$/i,
			loader: "file-loader",
			options: {
				name: "media/[name].[hash:8].[ext]",
				esModule: false
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
			loader: "file-loader",
			options: {
				name: "fonts/[name].[hash:8].[ext]",
				esModule: false
			}
		}]
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src")
		},
		extensions: [ ".vue", ".js", ".mjs", ".json" ]
	},
	plugins: [
		new DefinePlugin({
			__VUE_OPTIONS_API__: JSON.stringify(false),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
			PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
			PRODUCTION_BUILD: JSON.stringify(env.prod)
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: "styles/[name].[hash:8].css"
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [{
				from: "src/.ht*",
				to: "[name].[ext]"
			}, {
				from: "src/manifest.json",
				to: "[name].[ext]"
			}, {
				from: "src/assets/manifest-icon-*.png",
				to: "images/[name].[ext]"
			}]
		}),
		new HtmlWebpackPlugin({
			title: PACKAGE_NAME,
			filename: "index.html",
			template: resolve(__dirname, "./src/index.html"),
			inject: true,
			favicon: resolve(__dirname, "./src/assets/favicon.ico"),
			base: PUBLIC_PATH,
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
			cacheId: PACKAGE_NAME,
			filename: "service-worker.js",
			minify: true,
			navigateFallback: `${PUBLIC_PATH}index.html`,
			staticFileGlobs: [ "./dist/**/*.{html,xml,css,js,mjs,json,pdf,svg,png,jpg,jpeg,gif,ico,mp4,webm,ogg,mp3,aac,wav,flac,woff,woff2,eot,ttf,otf}" ],
			staticFileGlobsIgnorePatterns: [ /\.map$/ ],
			stripPrefix: "./dist/"
		}),
		...(env.prod ? [ new BundleAnalyzerPlugin() ] : [])
	],
	devServer: {
		contentBase: __dirname,
		historyApiFallback: true,
		hot: true,
		inline: true,
		open: true,
		overlay: {
			errors: true,
			warnings: true
		},
		stats: "minimal"
	},
	devtool: env.prod ? "source-map" : "eval-cheap-module-source-map"
});
