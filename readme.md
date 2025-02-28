<h1 align="center">
vite-plugin-dev-proxy 
</h1>
<div align="center">

Configure reverse proxies on dev Server or preview Server

</div>
<div align="center">

![NPM Version](https://img.shields.io/npm/v/%40aplus-frontend%2Fvite-plugin-dev-proxy)
![NPM Downloads](https://img.shields.io/npm/dm/%40aplus-frontend%2Fvite-plugin-dev-proxy)
![NPM License](https://img.shields.io/npm/l/%40aplus-frontend%2Fvite-plugin-dev-proxy)


</div>
 

## 安装

```bash
pnpm add @aplus-frontend/vite-plugin-dev-proxy -w
``` 

## Vite.config.ts使用
### 基础使用

```ts
import { defineConfig } from 'vite';
import devProxy from 'vite-plugin-dev-proxy';

const proxyServerMap = [['http://localhost:3000', 'http://api.XXX.com']]
export default defineConfig({
   server: {
    host: '0.0.0.0'
  },
  plugins: [devProxy({
    printLog:true,
    proxyServerMap
  })]
});

