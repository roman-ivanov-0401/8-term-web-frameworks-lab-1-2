const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const SHARED_STYLES_PATH = path.resolve(__dirname, '../../packages/shared/src');

const sharedDependencies = {
  react: { singleton: true, requiredVersion: '^19.2.0' },
  'react-dom': { singleton: true, requiredVersion: '^19.2.0' },
  'react-router-dom': { singleton: true },
  zustand: { singleton: true },
  antd: { singleton: true },
  '@ant-design/icons': { singleton: true },
  axios: { singleton: true },
};

/**
 * @param {Object} options
 * @param {'development'|'production'} options.mode
 * @param {string} options.entry
 * @param {string} options.outputPath
 * @param {string} options.htmlTemplate
 * @param {number} [options.devServerPort]
 * @param {Array<object>} [options.devServerProxy]
 * @param {object|null} [options.federation]
 * @returns {import('webpack').Configuration}
 */
function createWebpackConfig({
  mode = 'development',
  entry,
  outputPath,
  htmlTemplate,
  devServerPort = 3000,
  devServerProxy = [],
  federation = null,
} = {}) {
  const isDev = mode === 'development';

  const plugins = [
    new HtmlWebpackPlugin({ template: htmlTemplate }),
  ];

  if (federation) {
    plugins.push(
      new webpack.container.ModuleFederationPlugin({
        ...federation,
        shared: {
          ...sharedDependencies,
          ...(federation.shared ?? {}),
        },
      }),
    );
  }

  return {
    mode,
    entry,
    output: {
      path: outputPath,
      filename: isDev ? '[name].js' : '[name].[contenthash].js',
      publicPath: 'auto',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        react: path.resolve(__dirname, '../../node_modules/react'),
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
        'react-router-dom': path.resolve(__dirname, '../../node_modules/react-router-dom'),
        zustand: path.resolve(__dirname, '../../node_modules/zustand'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-typescript'],
              ],
            },
          },
        },
        {
          test: /\.module\.(scss|sass|css)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: false,
                modules: {
                  localIdentName: isDev ? '[local]__[hash:base64:5]' : '[hash:base64:8]',
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  loadPaths: [SHARED_STYLES_PATH],
                },
              },
            },
          ],
        },
        {
          test: /\.(scss|sass|css)$/,
          exclude: /\.module\.(scss|sass|css)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  loadPaths: [SHARED_STYLES_PATH],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins,
    devServer: {
      port: devServerPort,
      historyApiFallback: true,
      hot: true,
      proxy: devServerProxy,
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
  };
}

module.exports = createWebpackConfig;
