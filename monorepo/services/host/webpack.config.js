const path = require('path');
const createWebpackConfig = require('@app/build-config');

const CATALOG_URL = process.env.CATALOG_URL ?? 'http://localhost:3001';
const MATCHES_URL = process.env.MATCHES_URL ?? 'http://localhost:3002';

module.exports = (env, argv) => createWebpackConfig({
  mode: argv?.mode ?? 'development',
  entry: path.resolve(__dirname, 'src/entry.ts'),
  outputPath: path.resolve(__dirname, 'dist'),
  htmlTemplate: path.resolve(__dirname, 'public/index.html'),
  devServerPort: 3000,
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
    name: 'host',
    remotes: {
      catalog: `catalog@${CATALOG_URL}/remoteEntry.js`,
      matches: `matches@${MATCHES_URL}/remoteEntry.js`,
    },
  },
});
