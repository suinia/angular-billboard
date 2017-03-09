var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //webpack插件，生成html
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin; // 压缩js
var CopyWebpackPlugin = require('copy-webpack-plugin'); //webpack插件复制文件
var CleanPlugin = require('clean-webpack-plugin'); //webpack插件，用于清除目录文件 
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin; //处理trunk

module.exports = {
    entry: {
		main: './src/main.js',
		vendor: ['angular', 'angular-ui-router', 'ocLazyLoad']
	},
    output: {
    		path: path.resolve(__dirname, 'build'),
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
        publicPath: '/'
    },
    externals: {
	    jquery: 'window.$'
	},
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
			loader: 'url-loader?limit=10000&name=images/[name].[hash:8].[ext]'
		}]
	},
	resolve: {
		modulesDirectories: [
			'node_modules',
			'src/vendor'
		]
	},
	plugins: [
		new CleanPlugin(['build']),
    		new CommonsChunkPlugin('vendor',  'js/vendor.[chunkhash:8].js'),
    		new UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            mangle: false
        }),
    		new HtmlWebpackPlugin({
    			template: './src/index.html'
    		}),
    		new CopyWebpackPlugin([{
		    from: __dirname + '/src/js',
		    to: __dirname + '/build/js',
		},
//		{
//		    from: __dirname + '/src/css',
//		    to: __dirname + '/build/css',
//		}
		]),
  	]
};