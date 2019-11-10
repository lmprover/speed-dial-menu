const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function prodPlugin(plugin, argv) {
  return argv.mode === 'production' ? plugin : () => {};
}

module.exports = (env, argv) => {
  return {
    devtool: argv.mode === 'production' ? 'none' : 'source-map',
    mode: argv.mode === 'production' ? 'production' : 'development',
    entry: {
      script: './sources/index.js',
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: './[name].js',
      library: 'SpeedDial',
      libraryExport: 'default',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            argv.mode === 'development'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
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
      prodPlugin(
        new CleanWebpackPlugin({
          verbose: true,
        }),
        argv
      ),
      prodPlugin(new CopyPlugin([]), argv),
      new MiniCssExtractPlugin({
        filename: './[name].css',
      }),
      new HtmlWebPackPlugin({
        filename: 'index.html',
        template: './sources/index.html',
        // inject: false
      }),
    ],
  };
};