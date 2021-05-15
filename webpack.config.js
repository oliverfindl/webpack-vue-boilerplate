"use strict";

const { resolve } = require("path");
const { DefinePlugin, HotModuleReplacementPlugin } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const { GenerateSW: WorkboxWebpackPlugin } = require("workbox-webpack-plugin");

const PACKAGE_PATH = resolve(__dirname, "./package.json");
const { name: PACKAGE_NAME } = require(PACKAGE_PATH);

const PUBLIC_PATH = "/";

const BABEL_PLUGINS = [ "@babel/plugin-syntax-dynamic-import" ];
const BABEL_PRESETS = [ [ "@babel/preset-env", {
	// debug: true,
	useBuiltIns: "usage",
	corejs: 3
} ] ];

module.exports = (env = {}) => ({
	entry: resolve(__dirname, "./src/main.js"),
	mode: env.prod ? "production" : "development",
	output: {
		filename: "scripts/[name].[contenthash:8].js",
		chunkFilename: "scripts/[name].[contenthash:8].js",
		path: resolve(__dirname, "./dist"),
		publicPath: PUBLIC_PATH
	},
	module: {
		rules: [ {
			test: /\.vue$/i,
			loader: "vue-loader"
		}, {
			test: /\.m?js$/i,
			loader: "babel-loader",
			exclude: /node_modules/,
			options: {
				comments: false,
				minified: true,
				plugins: BABEL_PLUGINS,
				presets: env.prod ? BABEL_PRESETS : []
			}
		}, {
			test: /\.css$/i,
			use: [
				env.prod ? MiniCssExtractPlugin.loader : "style-loader",
				{
					loader: "css-loader",
					options: {
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
				env.prod ? MiniCssExtractPlugin.loader : "style-loader",
				{
					loader: "css-loader",
					options: {
						importLoaders: 2
						// 0 => no loaders (default);
						// 1 => postcss-loader;
						// 2 => postcss-loader, sass-loader;
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
				env.prod ? MiniCssExtractPlugin.loader : "style-loader",
				{
					loader: "css-loader",
					options: {
						importLoaders: 2
						// 0 => no loaders (default);
						// 1 => postcss-loader;
						// 2 => postcss-loader, sass-loader;
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
			use: [
				{
					loader: "file-loader",
					options: {
						name: "images/[name].[contenthash:8].[ext]",
						esModule: false
					}
				},
				"svgo-loader"
			]
		}, {
			test: /\.(png|jpe?g|webp|gif|ico)(\?.*)?$/i,
			loader: "file-loader",
			options: {
				name: "images/[name].[contenthash:8].[ext]",
				esModule: false
			}
		}, {
			test: /\.(mp4|webm|ogg|mp3|aac|wav|flac)(\?.*)?$/i,
			loader: "file-loader",
			options: {
				name: "media/[name].[contenthash:8].[ext]",
				esModule: false
			}
		}, {
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
			loader: "file-loader",
			options: {
				name: "fonts/[name].[contenthash:8].[ext]",
				esModule: false
			}
		} ]
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src")
		},
		extensions: [ ".vue", ".js", ".mjs", ".json" ]
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false
			})
		]
	},
	plugins: [
		...(!env.prod ? [ new HotModuleReplacementPlugin() ] : []),
		new DefinePlugin({
			__VUE_OPTIONS_API__: JSON.stringify(false),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
			PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
			PRODUCTION_BUILD: JSON.stringify(env.prod)
		}),
		new VueLoaderPlugin(),
		...(env.prod ? [ new MiniCssExtractPlugin({
			filename: "styles/[name].[contenthash:8].css",
			chunkFilename: "styles/[name].[contenthash:8].css"
		}) ] : []),
		new ESLintPlugin({
			files: [ "src/**/*.{vue,js,mjs}" ]
		}),
		new StylelintPlugin({
			files: [ "src/**/*.{vue,scss}" ]
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [ {
				from: "src/.ht*",
				to: "[name][ext]"
			}, {
				from: "src/manifest.json",
				to: "[name][ext]"
			}, {
				from: "src/assets/manifest-icon-*.png",
				to: "images/[name][ext]"
			} ]
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
		...(env.prod ? [
			new PreloadWebpackPlugin(),
			new WorkboxWebpackPlugin({
				cacheId: PACKAGE_NAME,
				cleanupOutdatedCaches: true,
				exclude: [ /^\.ht.+$/, /\.map$/ ],
				maximumFileSizeToCacheInBytes: (env.prod ? 1 : 10) * 1e6,
				navigateFallback: `${PUBLIC_PATH}index.html`,
				offlineGoogleAnalytics: true,
				sourcemap: env.prod
			}),
			new BundleAnalyzerPlugin()
		 ] : [])
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
	devtool: env.prod ? "source-map" : "eval-cheap-module-source-map",
	target: env.prod ? "browserslist" : "web"
});
