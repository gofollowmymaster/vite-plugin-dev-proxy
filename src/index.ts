import { type PluginOption } from 'vite';

import httpProxy, { createProxyServer } from 'http-proxy';
import { IncomingMessage, ServerResponse } from 'http';

const PLUGIN_NAME = 'vite-plugin-api-proxy';
export interface apiMockOption {
  mockServerMap: Map<string|RegExp, string>;
  printLog: boolean;
}

export async function requestMiddleware(proxy: httpProxy, opt: apiMockOption) {
  const { printLog = true, mockServerMap } = opt;
  const mockItem = Array.from(mockServerMap);
  mockItem.forEach((item) => {
    console.log(
      `已为您将${item[0]}前缀请求代理到mock服务器:${item[1]},请确保服务器能正常访问`
    );
  });

  const middleware = async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
  ) => {
    const matchRequest = mockItem.find(([prefix, target]) => {
      if(!(prefix instanceof RegExp)){
        prefix = new RegExp(`^${prefix}`)
      }
      return prefix.test(req.url);
    });

    if (matchRequest) {
      const prevUrl = matchRequest[0];
      const proxyUrl = req.url?.replace(new RegExp(`^${prevUrl}`), '');
      printLog &&
        console.log(`mock:[${req.url}] => `, matchRequest[1] + proxyUrl);
      req.url = proxyUrl;
      proxy.web(req, res, {
        target: matchRequest[1],
        changeOrigin: true // 为跨域请求修改origin
      });

      return;
    }
    next();
  };
  return middleware;
}

function createApiProxyPlugin(opt: apiMockOption): PluginOption {
  const proxy = createProxyServer();
  return {
    name: PLUGIN_NAME,
    apply: 'serve',
    enforce: 'pre',
    configureServer: async ({ middlewares }) => {
      const { mockServerMap } = opt;
      if (mockServerMap.size < 1) {
        return;
      }

      const middleware = await requestMiddleware(proxy, opt);
      middlewares.use(middleware);
    }
  };
}

export { createApiProxyPlugin };
