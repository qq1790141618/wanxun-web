import { createApp } from 'vue'

import 'tdesign-vue-next/es/style/index.css'
import './style.css'
import App from './App.vue'

import router from './router'
import user from './user'
import i18n from './i18n'

import 'highlight.js/styles/github-dark.min.css'

createApp(App)
.provide('i18n', i18n)
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
            value: 'KCOR',
            logo: 'https://cdn.fixeam.com/tw/KCOR.png'
        },
        {
            label: 'NT 107756',
            value: 'NT',
            logo: 'https://cdn.fixeam.com/tw/NT.png'
        },
        {
            label: '兔皇 5649',
            value: '兔皇',
            logo: 'https://cdn.fixeam.com/tw/TW.png'
        },
        {
            label: 'DR 111862',
            value: 'DR',
            logo: 'https://cdn.fixeam.com/tw/DR.png'
        }
    ],
    counter: {
        'HZ13KCOR': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000053629&spm=a320s.12912863.0.0',
        'HZ13兔皇': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000065204&spm=a320s.12912863.0.0',
        'HZ13NT': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000055164&spm=a320s.12912863.0.0',
        'HZ20DR': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000064613&spm=a320s.12912863.0.0',
        '132KCOR': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000061335&spm=a320s.12912863.0.0',
        '132兔皇': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000061335&spm=a320s.12912863.0.0',
        '132NT': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000061604&spm=a320s.12912863.0.0'
    }
}))
.use(router)
.mount('#app')
