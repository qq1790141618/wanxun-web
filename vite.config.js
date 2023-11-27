import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
    plugins: [
        splitVendorChunkPlugin(),
        vue(),
        AutoImport({
            resolvers: [
                TDesignResolver({
                    library: 'vue-next'
                })
            ],
            imports: [
                'vue',
                'vue-router'
            ]
        }),
        Components({
            resolvers: [
                TDesignResolver({
                    library: 'vue-next'
                })
            ]
        }),
    ],
    server:{
        host:'0.0.0.0'
    },
    build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {
                manualChunks(id){
                    if(id.includes('node_modules')){
                        return id.toString().split('node_modules/')[1].split('/')[0].toString()
                    }
                }
            }
        }
    }
})
