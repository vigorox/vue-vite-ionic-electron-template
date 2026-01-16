import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import vueDevTools from 'vite-plugin-vue-devtools';
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';

export default defineConfig({
  plugins: [
    vue({}),
    vueDevTools(),
    electron({
      main: {
        entry: 'electron/electron-main.ts',
      },
      preload: {
        input: 'electron/electron-preload.ts',
      },
      renderer: {},
    }),
    VueI18nPlugin({
      runtimeOnly: false,
    }),
    vitePluginBundleObfuscator({
      autoExcludeNodeModules: true,
      threadPool: true,
      options: {
        compact: true,
        stringArray: true,
        splitStrings: true,
        controlFlowFlattening: false,
        debugProtection: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
