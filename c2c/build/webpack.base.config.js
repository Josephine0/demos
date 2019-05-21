const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        // include告诉webpack只对src下的
        // js、jsx文件进行babel转译
        // 加快webpack的打包速度
        include: path.resolve(__dirname, '../src'),
      }
    ]
  }
};
