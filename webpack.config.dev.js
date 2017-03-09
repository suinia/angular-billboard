var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		main: './src/main.js',
		vendor: ['angular', 'angular-ui-router', 'ocLazyLoad', 'ngStorage', 'moment']
	},
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    externals: {
	    jquery: 'window.$'
	},
    devtool: 'inline-source-map',
    module: {
		loaders: [{
			test: /\.html$/,
			loader: 'html'
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader!autoprefixer-loader'
		}, {
			test: /\.jpg$/,
			loader: 'file-loader'
		}, {
			test: /\.json/,
			loader: 'json-loader'
		}, { 
			test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
			loader: 'url-loader?limit=10000&name=[path][name].[ext]'
		}]
	},
	resolve: {
		modulesDirectories: [
			'node_modules',
			'src/vendor'
		]
	},
	plugins: [
    		new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js'),
	    new webpack.HotModuleReplacementPlugin(),
    		new HtmlWebpackPlugin({
    			template: './src/index.html'
    		})
  	],
	devServer: {
		contentBase: "src",
	    historyApiFallback: true,
	    hot: true,
	    inline: true,
	    progress: true,
	    watchOptions: {
		  	aggregateTimeout: 300,
    			poll: 1000
		},
		port: 9039,
		proxy: {
            '/ae': {
              target: 'http://t1307.airag.cn',
              changeOrigin: true
            }
     	}
	}
}