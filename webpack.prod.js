const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const componentEnrtryPrefix = './src/js/components/';
const merge = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
function generateHtmlPlugins(templateDir, sub) {
	// Read files in template directory
	const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
	return templateFiles.map(item => {
		// Split names and extension
		const parts = item.split('.');
		const name = parts[0];
		const extension = parts[1];
		// Create new HTMLWebpackPlugin with options
		return new HtmlWebpackPlugin({
			filename: `${sub && `${sub}/`}/${name}.html`,
			hash: true,
			inject: true,
			chunks: [`${name}`],
			template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
			// scripts: ['../js/components/Header.js','../jscomponents/Footer.js'],
			title: `${name} template`,
			mobile: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		});
	});
}

const teacherHTML = generateHtmlPlugins('./src/teacher', 'teacher');
const accountHTML = generateHtmlPlugins('./src/account', 'account');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(scss|sass)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
						},
					},
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css?[hash]',
		}),
		// new HtmlWebpackTagsPlugin({ tags: ['../Header.js','../Footer.js','../ProfileSidebar.js'], append: true,  usePublicPath: false }),
		new CopyPlugin({
			patterns: [
				{ from: 'src/assets', to: 'assets' },
				{ from: 'src/lib', to: 'lib' },
				{ from: 'src/assets/fonts', to: 'css/fonts' },
			],
		}),
	]
		.concat(teacherHTML)
		.concat(accountHTML),
	// optimization: {
	//   minimizer: [new UglifyJsPlugin()],
	// },
});
