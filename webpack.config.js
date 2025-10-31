const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main/main.ts',
    renderer: './src/renderer/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].js',
    clean: true
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@game': path.resolve(__dirname, 'src/renderer/game'),
      '@editor': path.resolve(__dirname, 'src/renderer/editor'),
      '@ui': path.resolve(__dirname, 'src/renderer/ui'),
      '@store': path.resolve(__dirname, 'src/renderer/store'),
      '@shared': path.resolve(__dirname, 'src/shared')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
      chunks: ['renderer']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets', noErrorOnMissing: true }
      ]
    })
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  devServer: {
    port: 8080,
    hot: true
  }
};
