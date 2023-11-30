import { createApp } from 'vue'

import 'tdesign-vue-next/es/style/index.css'
import './style.css'
import App from './App.vue'

import router from './router'
import user from './user'

createApp(App)
.provide('local', reactive({
    name: 'en',
    options: [
        {
            content: '简体中文',
            value: 'zh',
            disabled: false
        },
        {
            content: 'English',
            value: 'en',
            disabled: false
        },
        {
            content: '한국어',
            value: 'kor',
            disabled: false
        },
        {
            content: '日本語',
            value: 'jp',
            disabled: false
        },
        {
            content: 'ภาษาไทย',
            value: 'th',
            disabled: false
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
