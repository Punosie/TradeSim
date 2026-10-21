// Logs every request served by `docusaurus start`, and loads a client module
// that logs route changes, page-load timings and fetched resources in the browser.

function logRequest(req, res, next) {
  const start = performance.now();
  res.on('finish', () => {
    const ms = (performance.now() - start).toFixed(1);
    const size = res.getHeader('content-length') ?? '-';
    console.log(`${new Date().toISOString()} [docs] ${req.method} ${req.url} -> ${res.statusCode} ${size}B ${ms}ms`);
  });
  next();
}

module.exports = function requestLoggerPlugin() {
  return {
    name: 'request-logger',

    configureWebpack(config, isServer) {
      if (isServer || process.env.DOCS_SERVER_LOG === 'false') return {};
      return {
        devServer: {
          // Docusaurus merges this with its own setupMiddlewares by calling both
          // on the SAME array and concatenating the results, so mutate in place
          // and return [] to avoid registering every middleware twice.
          setupMiddlewares(middlewares) {
            middlewares.unshift({ name: 'request-logger', middleware: logRequest });
            return [];
          },
        },
      };
    },

    getClientModules() {
      return [require.resolve('../src/clientModules/requestLogger.js')];
    },
  };
};
