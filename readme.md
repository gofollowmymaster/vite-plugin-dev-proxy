<h1 align="center">
vite-plugin-dev-proxy 
</h1>
<div align="center">

Configure reverse proxies on dev Server

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
需要自定义开发服务端口,主题色,less变量,打印日志时可传入相关配置
```ts
import { defineConfig } from 'vite';
import devProxy from 'vite-plugin-dev-proxy';


export default defineConfig({
   server: {
    host: '0.0.0.0'
  },
  plugins: [devProxy({
    printLog:true,
    mock
  })]
});

```
| 属性             | 描述                             | 类型         | 默认值   | 环境变量   |
| ------------     | ----------------------------    |  ----------- | ------- | ------- |
| printLog         | 是否打印调试信息                  | `boolean`   | `false`  |    无    |
| lessVarPath      | 注入全局less变量的文件目录         | `string`    | `''`     |    无    |
| primaryColor     | 主色                            |  `string`   | `''`     |    无    |
| autoImportComp   | 是否自动导入 AntDesignVue         | `boolean`   | `false`  |    无    |
| port             | 开发服务端口                     | `number`    | 4000      |    无    |
| publicPath       | 开发或生产环境服务的公共基础路径     | `sting`     | `/`       | VITE_PUBLIC_PATH |
| buildCompress    | 打包构建时压缩方式                 | `gzip\|brotli\|none`|  `gzip` | VITE_BUILD_COMPRESS |
| enableAnalyze    | 是否启用构建产物分析               | `boolean`    | `false`  | VITE_ENABLE_ANALYZE |
| qiankunSubAppName| qiankun子应用名,为空不会使用qiankun插件 | `string` | ``     | VITE_GLOB_SUBAPP_TITLE |
| useMock          | 是否启用apiFox Mock代理          | `boolean`    | `false`  | USE_MOCK |
| apiUrlPrefix     | 开发环境url请求前缀               | `string`     | `/api`  | VITE_GLOB_API_URL_PREFIX |
| apiServer        | 开发环境后端服务                  | `string`     | ``       | VITE_DEV_SERVER |
| proxyServerMap    | mock服务模块服务映射表             | `[string\|Regex,string][]`    | ``       | VITE_MOCK_MODULE |

> 属性若有设置相应环境不变量,环境变量优先生效

> 注意: 由于项目原因 aplus端 设置primaryColor 会报错

### 进阶使用

可以配置覆盖选项,格式与Vite原生配置相同,vite-config 将自动递归合并配置
```ts
import { defineApplicationConfig } from '@aplus-frontend/vite-plugin-dev-proxy';

export default defineApplicationConfig(
  // { primaryColor: '#34B77C'},
  {base:'/subapp'}
);

```
如果需要根据command或mode动态配置可传入一个方法,返回覆盖配置

```ts
import { defineApplicationConfig } from '@aplus-frontend/vite-plugin-dev-proxy';

export default defineApplicationConfig({},(command,mode)=>{
  let base = ''
  if(mode=='dev'){
    base = '/sub/'
  }
  return {
    base,
  }
});

```

## Usage

- 本地开发:
   `pnpm dev`
- 本地开发+mock: 
  `pnpm dev:mock`

