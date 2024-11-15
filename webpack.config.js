// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
	const isDev = argv.mode === 'development';

	console.log(`Mode: ${argv.mode}`); // Проверка режима при запуске

	return {
		entry: './src/index.js',
		output: {
			filename: isDev ? 'bundle.js' : 'bundle.[contenthash].js', // Без хэша в dev для удобства
			path: path.resolve(__dirname, 'dist'),
			assetModuleFilename: 'assets/[hash][ext][query]', // Путь для ассетов (по умолчанию)
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
			},
		},
		module: {
			rules: [
				{
					test: /\.pug$/,
					loader: 'pug-loader',
					options: { pretty: true },
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
						'css-loader',
						'sass-loader',
					],
				},
				{
					test: /\.(png|jpe?g|gif|svg)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'assets/images/[name][ext]', // Путь для изображений
					},
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i, // Обрабатываем шрифты
					type: 'asset/resource',
					generator: {
						filename: 'assets/fonts/[name][ext]', // Путь для шрифтов
					},
				},
			],
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				template: './src/views/index.pug',
			}),
			new webpack.HotModuleReplacementPlugin(),
			...(isDev
				? []
				: [new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' })]),
		],
		devServer: {
			static: path.resolve(__dirname, 'dist'),
			compress: true,
			port: 9000,
			hot: true,
			open: true,
		},
		mode: isDev ? 'development' : 'production',
	};
};
