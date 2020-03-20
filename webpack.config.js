const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'dist');

module.exports = [{
  mode: 'development',
  entry: path.join(src, 'scripts', 'main.ts'),
  output: {
    path: dst,
    filename: path.join('scripts', 'bundle.js')
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: path.join(src, 'index.html'),
      to: path.join(dst, 'index.html')
    }, {
      from: path.join(src, 'manifest.json'),
      to: path.join(dst, 'manifest.json')
    }, {
      from: path.join(src, 'sw.js'),
      to: path.join(dst, 'sw.js')
    }])
  ]
}, {
  mode: 'development',
  entry: path.join(src, 'styles', 'style.scss'),
  output: {
    path: dst,
    filename: path.join('scripts', 'style-bundle.js')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: path.join('styles', 'bundle.css')
            }
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                includePaths: ['./node_modules']
              }
            }
          }
        ]
      }
    ]
  }
}];