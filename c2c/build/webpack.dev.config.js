const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
module.exports = merge(base, {
  mode: 'development',

  /*入口*/
  entry: {
    app: [
      "react-hot-loader/patch",
      path.join(__dirname, '../src/index.js')
    ],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux']
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  },

  /*src目录下面的以.js结尾的文件，要使用babel解析*/
  /*cacheDirectory是用来缓存编译结果，下次编译加速*/
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]'
        }
    }, 'postcss-loader']
  }, {
    test: /\.less$/,
    use: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
          modules: true,
          localIdentName: "[local]"
        }
      },
      {
        loader: "less-loader"
      }
    ]
  }, {
    test: /\.(png|jpg|gif)$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 8192
      }
    }]
  }]
},
// webpack-dev-server
devServer: {
    proxy: { // 配置服务代理
      '/api': {
        target: 'http://cmsapi.zufangzi.com/v1/',
        pathRewrite: {
          '^/api': ''
        }, //可转换
        changeOrigin: true
      },
    },
    // contentBase: path.join(__dirname, '../dist'),
    compress: true, // gzip压缩
    host: '0.0.0.0', // 允许ip访问
    hot: true, // 热更新
    hotOnly: true,
    historyApiFallback: true, // 解决启动后刷新404
    port: 8000 // 端口
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      pages: path.join(__dirname, '../src/pages'),
      components: path.join(__dirname, '../src/components'),
      router: path.join(__dirname, '../src/router'),
      images: path.join(__dirname, '../src/images'),
      actions: path.join(__dirname, '../src/redux/actions'),
      reducers: path.join(__dirname, '../src/redux/reducers'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      favicon: path.join(__dirname, '../icon.ico'),
      template: path.join(__dirname, '../index.html')
    }),
    new MiniCssExtractPlugin({ // 压缩css
      exclude: path.join(__dirname, '../node_modelus'),
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css"
    }),
    // new webpack.HotModuleReplacementPlugin()
  ]
});