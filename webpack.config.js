const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    name: 'main',
    entry: {
      main: './src/main/main.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: 'main.js',
      clean: false
    },
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          },
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    node: {
      __dirname: false,
      __filename: false
    }
  },
  {
    name: 'preload',
    entry: {
      preload: './src/main/preload.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: 'preload.js',
      clean: false
    },
    target: 'electron-preload',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          },
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    node: {
      __dirname: false,
      __filename: false
    }
  },
  {
    name: 'renderer',
    entry: {
      renderer: './src/renderer/index.tsx'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]/[name].js',
      clean: false
    },
    target: 'electron-renderer',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          },
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
  }
];
