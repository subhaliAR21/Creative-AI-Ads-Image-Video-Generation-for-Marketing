const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/api/generate-images', '/api/generate-video'],
    createProxyMiddleware({
      target: 'http://localhost:5000',
      secure: false, // Accept self-signed certs
      changeOrigin: true,
    })
  );
};
