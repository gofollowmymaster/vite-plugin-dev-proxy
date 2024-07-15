import { type PluginOption } from "vite";
export interface apiMockOption {
    mockServerMap: [string | RegExp, string][];
    printLog: boolean;
}
declare function devProxy(opt: apiMockOption): PluginOption;
export default devProxy;
