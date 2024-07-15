import { defineConfig } from 'vite'
import { buildPlugin } from 'vite-plugin-build';
 
export default defineConfig({
    base: './',
    plugins:[buildPlugin({
        fileBuild: {
          emitDeclaration: true,
          ignoreInputs: [
            '**/*.spec.*',
            '**/*.d.ts',
            'vite.config.ts'
          ]
        }
      })]
})