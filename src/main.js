import { createApp } from 'vue'

import 'tdesign-vue-next/es/style/index.css'
import './style.css'
import App from './App.vue'

import router from './router'
import user from './user'
import i18n from './i18n'
import shop from './hooks/shop'

import 'highlight.js/styles/github-dark.min.css'

createApp(App)
.provide('i18n', i18n)
.provide('serve', 'https://work-serve.fixeam.com/api')
.provide('user', user)
.provide('shop', shop)
.use(router)
.mount('#app')
