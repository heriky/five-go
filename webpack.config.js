var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin') ;

var APP_PATH = path.resolve(__dirname, './src') ;
var BUILD_PATH = path.resolve(__dirname, './res/dist') ;
var STATIC_RES = path.resolve(__dirname, './res/static') ;

var ExtractTextPlugin = require('extract-text-webpack-plugin') ;
var commonExtract = new ExtractTextPlugin('common.css', {chunck: true}) ;
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
	name: 'client',
	target: 'web',
	entry: [
		path.resolve(APP_PATH, './client'),
		'webpack-hot-middleware/client',,
		// 'webpack-dev-server/client?http://localhost:8080',
		// 'webpack/hot/only-dev-server'
	],
	output:{
		path: BUILD_PATH,
		filename: 'bundle.js',
		publicPath: '/static'
	},
	plugins:[
		new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    commonExtract,
    // new OpenBrowserPlugin({
    //   url: 'http://localhost:8080'
    // }),
		new HtmlwebpackPlugin({
			title:'React Component Test',
			template:path.resolve(__dirname,'./index.html'),
			filename:'index.html',
			// chunks 指定要引用entry文件中哪个几个入口个文件
			chunks:'app',
			// 表示script插入标签中
			inject:'body'
		})
   ],
	devServer:{
		// proxy: {
  //     '*': {             // 过滤对8080/api路由的请求到3001服务器上
  //     	target:'http://127.0.0.1:3000',
  //     	secure:false
  //     }
  //   }
	}
	,
	devtool: 'eval-source-map',
	resolve:{
		extensions: ['', '.js', '.jsx']
	},
	externals: {
		jquery: "jQuery" // 从全局（或者script标签）中引入到模块中来
	}
	,
	postcss: function () {
	    return [require('autoprefixer'), require('precss')];
	},
	module:{
		loaders:[{
			test: /\.(js|jsx)$/,
			loader: 'babel-loader',
			include: APP_PATH
		},{
			test: /\.(scss|css)$/,
			loader: commonExtract.extract('style',['css','postcss','sass']),
			// include: STATIC_RES+'/css'
		},{
			test: /\.(png|jpe?g|gif)$/,
			loader: 'url-loader?limit=50000&name=imgs/[name].[ext]'
		},{
			test: /\.(woff|svg|eot|ttf)\??.*$/,
			loader: 'url-loader?limit=50000&name=fonts/[name].[ext]'
		}]
	}
}