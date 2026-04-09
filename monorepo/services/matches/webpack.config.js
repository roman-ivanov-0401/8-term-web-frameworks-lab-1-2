const path = require('path');
const createWebpackConfig = require('@app/build-config');

module.exports = (env, argv) => createWebpackConfig({
  mode: argv?.mode ?? 'development',
  entry: path.resolve(__dirname, 'src/entry.ts'),
  outputPath: path.resolve(__dirname, 'dist'),
  htmlTemplate: path.resolve(__dirname, 'public/index.html'),
  devServerPort: 3002,
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
  ],
  federation: {
    name: 'matches',
    filename: 'remoteEntry.js',
    exposes: {
      './MatchesPage': './src/domains/matches/views/MatchesPage/MatchesPage',
    },
  },
});
