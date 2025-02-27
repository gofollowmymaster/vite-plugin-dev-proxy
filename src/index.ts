import { type PluginOption } from "vite";

import httpProxy from "http-proxy";
import { IncomingMessage, ServerResponse } from "http";
const { createProxyServer } = httpProxy;
const PLUGIN_NAME = "vite-plugin-api-proxy";
const proxy: httpProxy = createProxyServer();

export interface apiMockOption {
  proxyServerMap: [string | RegExp, string][];
  printLog: boolean;
}
async function requestMiddleware(opt: apiMockOption) {
  const { printLog = true, proxyServerMap } = opt;
   
  proxyServerMap.forEach((item) => {
    console.log(
      `已为您将${item[0]}前缀请求代理到服务器:${item[1]},请确保服务器能正常访问`
    );
    if (!(item[0] instanceof RegExp)) {
      item[0] = new RegExp(`^${item[0]}`);
    }
  });

  const middleware = async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ) => {
    const matchRequest = proxyServerMap.find(([prefix , target]) => {
      return (prefix as RegExp).test(req.url);
    });

    if (matchRequest) {
      const prevUrl = matchRequest[0];
      const proxyUrl = req.url?.replace(prevUrl, '');

      printLog &&
        console.log(`proxy:[${req.url}] => `, matchRequest[1] + proxyUrl);
      req.url = proxyUrl;
      proxy.web(req, res, {
        target: matchRequest[1],
        changeOrigin: true, // 为跨域请求修改origin
      });

      return;
    }
    next();
  };
  return middleware;
}

function devProxy(opt: apiMockOption): PluginOption {
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
    },
    configurePreviewServer: async ({ middlewares }) => {
      const { proxyServerMap } = opt;
      if (proxyServerMap.length < 1) {
        return;
      }

      const middleware = await requestMiddleware(opt);
      middlewares.use(middleware);
    },
  };
}

export default devProxy;
