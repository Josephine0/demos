const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');

module.exports = merge(base, {
  mode: 'production',

  /*入口*/
  entry: {
    app: [
      "@babel/polyfill",
      path.join(__dirname, '../src/index.js')
    ],
    vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux']
  },

  output: {
    path: path.join(__dirname, '../dist'),
    // 这里添加contentHash
    // 由于我们的entry中没有配置入口的名称
    // webpack会默认取名为main
    // 因此这里的配置会生成'main.xxxxxx.js'
    filename: '[name].[contentHash].js',
    // 通过splitChunks抽离的js文件名格式
    chunkFilename: '[name].[contentHash].chunk.js',
    publicPath: '/'
  },

  // output: {
  //   path: path.join(__dirname, '../dist'),
  //   filename: '[name].[hash].js',
  //   chunkFilename: '[name].[chunkhash].js',
  //   publicPath: '/'
  // },

  /*src目录下面的以.js结尾的文件，要使用babel解析*/
  /*cacheDirectory是用来缓存编译结果，下次编译加速*/
  module: {
    rules: [{
        test: /\.(scss|sass|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(less)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'images/',
            publicPath: '/images'
          }
        }]
      }
    ]
  },
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
  optimization: {
    // 抽离webpack runtime到单文件
    runtimeChunk: 'single',
    minimize: true,
    // 压缩器
    minimizer: [
      // 压缩css
      new OptimizeCssAssetsPlugin(),
      // 压缩js，记得将sourceMap设为true
      // 否则会无法生成source map
      new TerserWebpackPlugin({
        sourceMap: true,
        // cache: true,
        // terserOptions: {
        //   warnings: false,
        //   compress: {
        //     warnings: false,
        //     drop_debugger: true,
        //     drop_console: true
        //   },
        // }
      }),
      // 该插件还能压缩html
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../index.html'),
        favicon: path.join(__dirname, '../icon.ico'),
        minify: {
          // 折叠空白符
          collapseWhitespace: true,
          // 移除注释
          removeComments: true,
          // 移除属性多余的引号
          removeAttributeQuotes: true
        }
      })
    ],
    splitChunks: {
      chunks: 'async', //不包含入口文件
      automaticNameDelimiter: '~',
      name: true,
      // 最大初始请求数
      maxInitialRequests: Infinity,
      // 80kb以上的chunk抽离为单独的js文件
      // 配合上面的 maxInitialRequests: Infinity
      // 小于80kb的所有chunk会被打包一起
      // 这样可以减少初始请求数
      // 大家可以根据自己的情况设置
      minSize: 80 * 1024,
      // 抽离多入口引用次数1以上的chunk
      minChunks: 1,
      cacheGroups: {
        // 抽离node_modules内的第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          // 根据路径获得第三方库的名称
          // 并将抽离的chunk以'vendor_thirdPartyLibrary'格式命名
          name: function (module, chunks, chacheGroupKey) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `vendor_${packageName.replace('@', '')}`;
          }
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      template: path.join(__dirname, '../index.html'),
      favicon: path.join(__dirname, '../icon.ico')
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash:8].css',
      allChunks: true,
    }),
    // new MiniCssExtractPlugin({ // 压缩css
    //   exclude: path.join(__dirname, '../node_modelus'),
    //   filename: '[name].[contanthash].css',
    //   chunkFilename: '[id].[contanthash].css'
    // }),
    new OptimizeCssAssetsPlugin(),
    new CleanWebpackPlugin(),
  ]
});