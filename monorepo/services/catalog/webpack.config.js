const path = require('path');
const createWebpackConfig = require('@app/build-config');

module.exports = (env, argv) => createWebpackConfig({
  mode: argv?.mode ?? 'development',
  entry: path.resolve(__dirname, 'src/entry.ts'),
  outputPath: path.resolve(__dirname, 'dist'),
  htmlTemplate: path.resolve(__dirname, 'public/index.html'),
  devServerPort: 3001,
  devServerProxy: [
    {
      context: ['/api/v1/auth'],
      target: 'http://localhost:3051',
      changeOrigin: true,
      pathRewrite: { '^/api/v1/auth': '/auth' },
    },
    {
      context: ['/api/v1'],
      target: 'http://localhost:3050',
      changeOrigin: true,
    },
    {
      context: ['/uploads'],
      target: 'http://localhost:3050',
      changeOrigin: true,
    },
  ],
  federation: {
    name: 'catalog',
    filename: 'remoteEntry.js',
    exposes: {
      './CatalogPage': './src/domains/catalog/views/CatalogPage/CatalogPage',
      './DrinkPage': './src/domains/catalog/domains/drink/views/DrinkPage/DrinkPage',
    },
  },
});
