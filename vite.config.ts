import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver({
                importStyle: 'sass'
            })],
        }),
        Components({
            resolvers: [ElementPlusResolver({
                importStyle: 'sass'
            })],
        }),
    ],
    resolve: {
        // src文件夹配置别名
        alias: {
            "@": path.resolve(__dirname, 'src')
        }
    },
    server: {
        proxy: {
            '/admin-api': {
                target: 'http://localhost:48080',
                changeOrigin: true,
            },
        }
    }
})
