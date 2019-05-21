'use strict';
/*
   生产环境输出编译后文件
*/

const webpack = require('webpack');
const ora = require('ora');
const chalk = require('chalk');
const webpackConfig = require('./webpack.prod.config');

// loading
const spinner = ora('编译生产环境...');
spinner.start();

webpack(webpackConfig, function (err, stats) {
  spinner.stop();
  if (err) {
    throw err;
  }
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n'
  );

  if (stats.hasErrors()) {
    console.log(chalk.red('  编译失败.\n'));
    process.exit(1);
  }

  console.log(chalk.cyan('  编译成功.\n'));
  console.log(chalk.yellow('  注意: 编译后的文件需要放到web服务器中.\n' + '  直接打开index.html无效.\n'));
});