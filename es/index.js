import httpProxy from "http-proxy";
const { createProxyServer } = httpProxy;
const PLUGIN_NAME = "vite-plugin-api-proxy";
const proxy = createProxyServer();
async function requestMiddleware(opt) {
  const { printLog = true, proxyServerMap } = opt;
  proxyServerMap.forEach((item) => {
    console.log(
      `已为您将${item[0]}前缀请求代理到mock服务器:${item[1]},请确保服务器能正常访问`
    );
    if (!(item[0] instanceof RegExp)) {
      item[0] = new RegExp(`^${item[0]}`);
    }
  });
  const middleware = async (req, res, next) => {
    var _a;
    const matchRequest = proxyServerMap.find(([prefix, target]) => {
      return prefix.test(req.url);
    });
    if (matchRequest) {
      const prevUrl = matchRequest[0];
      const proxyUrl = (_a = req.url) == null ? void 0 : _a.replace(prevUrl, "");
      printLog && console.log(`mock:[${req.url}] => `, matchRequest[1] + proxyUrl);
      req.url = proxyUrl;
      proxy.web(req, res, {
        target: matchRequest[1],
        changeOrigin: true
        // 为跨域请求修改origin
      });
      return;
    }
    next();
  };
  return middleware;
}
function devProxy(opt) {
  return {
    name: PLUGIN_NAME,
    apply: "serve",
    enforce: "pre",
    configureServer: async ({ middlewares }) => {
      const { proxyServerMap } = opt;
      if (proxyServerMap.length < 1) {
        return;
      }
      const middleware = await requestMiddleware(opt);
      middlewares.use(middleware);
    }
  };
}
export {
  devProxy as default
};
