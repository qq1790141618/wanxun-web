import { createApp } from 'vue'

import './style.css'
import 'tdesign-vue-next/es/style/index.css'
import App from './App.vue'

import router from './router'
import user from './user'

createApp(App)
.provide('local', reactive({
    name: 'en',
    options: [
        {
            content: '简体中文',
            value: 'zh'
        },
        {
            content: 'English',
            value: 'en'
        },
        {
            content: '한국어',
            value: 'kor'
        },
        {
            content: '日本語',
            value: 'jp'
        },
        {
            content: 'ภาษาไทย',
            value: 'th'
        }
    ]
}))
.provide('serve', 'https://work-serve.fixeam.com/api')
.provide('user', user)
.provide('shop', reactive({
    store: 'HZ13',
    storeOptions: [
        {
            label: '杭州文化广场',
            value: 'HZ13'
        },
        {
            label: '杭州滨江银泰',
            value: 'HZ20'
        },
        {
            label: '海宁银泰城',
            value: '132'
        }
    ],
    brand: '兔皇',
    brandOptions: [
        {
            label: 'KCOR 107241',
            value: 'KCOR'
        },
        {
            label: 'NT 107756',
            value: 'NT'
        },
        {
            label: '兔皇 5649',
            value: '兔皇'
        },
        {
            label: 'DR 111862',
            value: 'DR'
        }
    ]
}))
.use(router)
.mount('#app')
