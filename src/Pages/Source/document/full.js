export default [
    {
        '<template>': `<t-config-provider :global-config="globalConfig">
<router-view v-if="frameLessPage.indexOf($route.name) >= 0"/>
<div v-if="frameLessPage.indexOf($route.name) < 0">
    <header-component />
    <t-breadcrumb max-item-width="150" style="margin: 10px 0 0 20px;">
        <t-breadcrumbItem
        v-if="homeRoute"
        :to="homeRoute.path"
        >
            <template #icon>
                <t-icon :name="homeRoute.meta.icon" />
            </template>
            {{ i18n[homeRoute.meta.title][i18n.language] }}
        </t-breadcrumbItem>
        <t-breadcrumbItem
        v-for="item in $route.matched"
        :key="item.meta.key"
        :to="item.path"
        >
            <template #icon>
                <t-icon :name="item.meta.icon" />
            </template>
            {{ i18n[item.meta.title][i18n.language] }}
        </t-breadcrumbItem>
    </t-breadcrumb>
    <router-view v-slot="{ Component }" >
        <keep-alive>
            <component :is="Component" :key="$route.meta.key" v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <component :is="Component" :key="$route.meta.key" v-if="!$route.meta.keepAlive"/>
    </router-view>
</div>
</t-config-provider>`,
        '<script>': `import { verifyUser } from './hooks'
import headerComponent from './components/header.vue'
import merge from 'lodash/merge'
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN'
import chtConfig from 'tdesign-vue-next/es/locale/zh_TW'
import enConfig from 'tdesign-vue-next/es/locale/en_US'
import korConfig from 'tdesign-vue-next/es/locale/ko_KR'
import jpConfig from 'tdesign-vue-next/es/locale/ja_JP'

export default {
    components: {
        headerComponent
    },
    setup(){
        const i18n = inject('i18n')
        const serve = inject('serve')
        const user = inject('user')
        const shop = inject('shop')
        const router = useRouter()
        const homeRoute = ref(false)
        for (let i = 0; i < router.getRoutes().length; i++) {
            if(router.getRoutes()[i].path === '/'){
                homeRoute.value = router.getRoutes()[i]
            }
        }

        const initSet = () => {
            if(localStorage.getItem('lang')){
                i18n.language = localStorage.getItem('lang')
                document.documentElement.lang = i18n.languages
            }
            if(localStorage.getItem('language')){
                i18n.language = localStorage.getItem('language')
                document.documentElement.lang = i18n.language
            }
            initLangConfig(i18n.language)
            if(localStorage.getItem('user')){
                user.inform = JSON.stringify(localStorage.getItem('user'))
            }
            if(localStorage.getItem('store')){
                shop.store = localStorage.getItem('store')
            }
            if(localStorage.getItem('brand')){
                shop.brand = localStorage.getItem('brand')
            }
        }
        const loginVerify = () => {
            user.status = 'verify'
            
            verifyUser(serve)
            .then(res => {
                user.inform = res.user
                user.status = 'loged'
                localStorage.setItem('user', JSON.stringify(res.user))
                MessagePlugin.success(i18n.welcomeBack[i18n.language] + '！' + res.user.nickname)
            })
            .catch(() => {
                MessagePlugin.info(i18n.loginFailure[i18n.language])
                user.status = 'unlog'
                router.replace('/login')
            })
        }

        const route = useRoute()
        const historyRecord = () => {
            if(route.path == '/login' || route.path == '/' || route.path == '/data/analysis-view'){
                return
            }
            let history = JSON.parse(localStorage.getItem('history')) || {
                menus: [],
                goods: []
            }

            for (let i = 0; i < history.menus.length; i++) {
                if(history.menus[i].path == route.path){
                    history.menus.splice(i, 1)
                    history.menus.unshift(route)
                    localStorage.setItem('history', JSON.stringify(history))
                    return
                }
            }

            history.menus.unshift(route)
            localStorage.setItem('history', JSON.stringify(history))
        }
        watch(() => route.name, () => {
            historyRecord()
        })

        let globalConfig = merge(zhConfig)
        const initLangConfig = (lang) => {
            switch (lang) {
                case 'zh':
                    globalConfig = merge(zhConfig)
                    break

                case 'cht':
                    globalConfig = merge(chtConfig)
                    break

                case 'en':
                    globalConfig = merge(enConfig)
                    break

                case 'fra':
                    globalConfig = merge(enConfig)
                    break

                case 'jp':
                    globalConfig = merge(jpConfig)
                    break

                case 'kor':
                    globalConfig = merge(korConfig)
                    break

                case 'th':
                    globalConfig = merge(enConfig)
                    break
            
                default:
                    globalConfig = merge(zhConfig)
                    break
            }
        }
        watch(() => i18n.language, (newValue) => {
            initLangConfig(newValue)
        })
        initSet()

        const frameLessPage = ['login', 'datas-analysis-view']

        onMounted(() => {
            i18n.checkEmpty()
            loginVerify()
            setTimeout(() => {
                historyRecord()
            }, 1000)
        })

        return {
            i18n,
            globalConfig,
            frameLessPage,
            homeRoute
        }
    }
}`
    },
    {
        js: `import { createApp } from 'vue'

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
`
    },
    {
        css: `/* 英文字体 */
@font-face {
    font-family: 'DIN Medium';
    src: url('https://cdn.fixeam.com/font/DIN.ttf') format('truetype');
}
@font-face {
    font-family: 'Quicksand';
    src: url('https://cdn.fixeam.com/font/Quicksand/Quicksand-Regular.eot');
    src: url('https://cdn.fixeam.com/font/Quicksand/Quicksand-Regular.eot?#iefix') format('embedded-opentype'), url('https://cdn.fixeam.com/font/Quicksand/Quicksand-Regular.woff2') format('woff2'), url('https://cdn.fixeam.com/font/Quicksand/Quicksand-Regular.woff') format('woff'), url('https://cdn.fixeam.com/font/Quicksand/Quicksand-Regular.ttf') format('truetype'), url('https://cdn.fixeam.com/font/Quicksand/Quicksand-Regular.svg') format('svg');
}
@font-face {
    font-family: 'Josefin sans';
    src: url('https://cdn.fixeam.com/font/Josefin sans/JosefinSans-Regular-7.eot');
    src: url('https://cdn.fixeam.com/font/Josefin sans/JosefinSans-Regular-7.eot?#iefix') format('embedded-opentype'), url('https://cdn.fixeam.com/font/Josefin sans/JosefinSans-Regular-7.woff2') format('woff2'), url('https://cdn.fixeam.com/font/Josefin sans/JosefinSans-Regular-7.woff') format('woff'), url('https://cdn.fixeam.com/font/Josefin sans/JosefinSans-Regular-7.ttf') format('truetype'), url('https://cdn.fixeam.com/font/Josefin sans/JosefinSans-Regular-7.svg') format('svg');
}
@font-face {
    font-family: 'Noto sans';
    src: url('https://cdn.fixeam.com/font/Noto sans/NotoSans-Regular-2.eot');
    src: url('https://cdn.fixeam.com/font/Noto sans/NotoSans-Regular-2.eot?#iefix') format('embedded-opentype'), url('https://cdn.fixeam.com/font/Noto sans/NotoSans-Regular-2.woff2') format('woff2'), url('https://cdn.fixeam.com/font/Noto sans/NotoSans-Regular-2.woff') format('woff'), url('https://cdn.fixeam.com/font/Noto sans/NotoSans-Regular-2.ttf') format('truetype'), url('https://cdn.fixeam.com/font/Noto sans/NotoSans-Regular-2.svg') format('svg');
}

@font-face {
    font-family: 'Raleway';
    src: url('https://cdn.fixeam.com/font/Raleway/Raleway-Regular-2.eot');
    src: url('https://cdn.fixeam.com/font/Raleway/Raleway-Regular-2.eot?#iefix') format('embedded-opentype'), url('https://cdn.fixeam.com/font/Raleway/Raleway-Regular-2.woff') format('woff'), url('https://cdn.fixeam.com/font/Raleway/Raleway-Regular-2.ttf') format('truetype'), url('https://cdn.fixeam.com/font/Raleway/Raleway-Regular-2.svg') format('svg');
}
@font-face {
    font-family: 'Rubik';
    src: url('https://cdn.fixeam.com/font/Rubik/Rubik-Regular.eot');
    src: url('https://cdn.fixeam.com/font/Rubik/Rubik-Regular.eot?#iefix') format('embedded-opentype'), url('https://cdn.fixeam.com/font/Rubik/Rubik-Regular.woff') format('woff'), url('https://cdn.fixeam.com/font/Rubik/Rubik-Regular.ttf') format('truetype'), url('https://cdn.fixeam.com/font/Rubik/Rubik-Regular.svg') format('svg');
}
/* 中文字体 */
@font-face {
    font-family: 'Pingfang SC Medium';
    src: url('https://cdn.fixeam.com/font/Pingfang%20SC%20Medium.ttf') format('truetype');
}
@font-face {
    font-family: 'Pingfang SC Regular';
    src: url('https://cdn.fixeam.com/font/Pingfang SC Regular/PingFang Regular.eot');
    src: url('https://cdn.fixeam.com/font/Pingfang SC Regular/PingFang Regular.eot?#iefix') format('embedded-opentype'), url('https://cdn.fixeam.com/font/Pingfang SC Regular/PingFang Regular.woff2') format('woff2'), url('https://cdn.fixeam.com/font/Pingfang SC Regular/PingFang Regular.woff') format('woff'), url('https://cdn.fixeam.com/font/Pingfang SC Regular/PingFang Regular.ttf') format('truetype'), url('https://cdn.fixeam.com/font/Pingfang SC Regular/PingFang Regular.svg') format('svg');
}
@font-face {
    font-family: 'HYWenHei-45W';
    src: url('https://cdn.fixeam.com/font/hanyiwenhei/HYWenHei-45W-5.ttf') format('truetype');
}
@font-face {
    font-family: 'HYWenHei-55W';
    src: url('https://cdn.fixeam.com/font/hanyiwenhei/HYWenHei-55W-4.ttf') format('truetype');
}
* {
    box-sizing: border-box;
}
header {
    display: block;
}
:root {
    --td-font-family: 'Noto sans', 'HYWenHei-45W', 'Pingfang SC Medium', Microsoft YaHei, Arial Regular;
    --td-font-size-body-medium: 13px;
}
body {
    color: var(--td-text-color-secondary);
    font: var(--td-font-body-medium);
    font-family: -apple-system, BlinkMacSystemFont, var(--td-font-family);
    -webkit-font-smoothing: antialiased;
    padding: 0;
    margin: 0;
    background: transparent url('./assets/img1.wallspic.com-jian_yue-shou_shi-qi_ti-yuan_quan-dian_lan_se_de-7680x4320.jpg') no-repeat fixed center;
    background-size: cover;
    overflow-x: hidden;
}
img, div, span{
    vertical-align: middle;
}
[class^='clamp']{
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
}
.clamp-1{
    -webkit-line-clamp:1;
}
.clamp-2{
    -webkit-line-clamp:2;
}
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    width: 6px;
    background: rgba(#101F1C, 0.1);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(144,147,153,.5);
    background-clip: padding-box;
    min-height: 28px;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
    transition: background-color .3s;
    cursor: pointer;
}
::-webkit-scrollbar-thumb:hover {
    background-color: rgba(144,147,153,.3);
}
.description-title{
    color: #666;
    font-size: 12px;
    margin-top: 12px;
}
/* header */
.header{
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw;
    padding: 0 var(--td-comp-paddingLR-xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    color: var(--td-text-color-primary);
    height: var(--td-comp-size-xxxl);
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: var(--td-border-level-2-color);
    box-sizing: border-box;
}
.logo{
    margin: 0 10px;
    height: 100%;
    line-height: 56px;
    min-width: 230px;
    flex-shrink: 0;
}
.logo-image{
    margin: 4px;
    height: 40px;
}
.logo-text{
    font-size: 16px;
}
.operations-container{
    padding: 0 var(--td-comp-paddingLR-xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    color: var(--td-text-color-primary);
    height: var(--td-comp-size-xxxl);
}
.t-autocomplete-option-list .t-select-option {
    height: 50px;
}
.t-autocomplete-option-list .custom-option {
    display: flex;
    align-items: center;
}
.t-autocomplete-option-list .custom-option > img {
    max-height: 36px;
    border-radius: 5px;
}
.t-autocomplete-option-list .custom-option__main {
    margin-left: 8px;
}
.t-autocomplete-option-list .custom-option .description {
    color: var(--td-gray-color-9);
}
.search-box .t-input{
    background-color: transparent;
}
.cl-button{
    position: relative;
    top: -1px;
}
/* table */
.t-table,
.t-table .t-table__header tr,
.t-table .t-table__footer tr
{
    border-radius: 5px;
}
.t-table th:first-child,
.t-table__footer td:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
.t-table th:last-child,
.t-table__footer td:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}
.t-table__body tr:last-child td,
.t-table .t-table__header th,
.t-table .t-table__footer td {
    border-bottom-width: 0;
}
.t-table .t-table__header th{
    color: #333;
}`
    },
    {
        js: `{
    "name": "wanxun-web",
    "private": true,
    "version": "5.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "@highlightjs/vue-plugin": "^2.1.0",
        "dayjs": "^1.11.10",
        "echarts": "^5.4.3",
        "fetch-jsonp": "^1.3.0",
        "highlight.js": "^11.9.0",
        "md5": "^2.3.0",
        "tdesign-vue-next": "^1.7.0",
        "unplugin-auto-import": "^0.17.1",
        "unplugin-vue-components": "^0.25.2",
        "vue": "^3.3.8",
        "vue-clipboard3": "^2.0.0",
        "vue-picture-cropper": "^0.7.0",
        "vue-router": "^4.2.5"
    },
    "devDependencies": {
        "@vitejs/plugin-vue": "^4.5.0",
        "vite": "^5.0.0"
    }
}`
    },
    {
        js: `{
    "name": "wanxun-web",
    "version": "5.0.0",
    "lockfileVersion": 3,
    "requires": true,
    "packages": {
        "": {
        "name": "wanxun-web",
        "version": "5.0.0",
        "dependencies": {
            "@highlightjs/vue-plugin": "^2.1.0",
            "dayjs": "^1.11.10",
            "echarts": "^5.4.3",
            "fetch-jsonp": "^1.3.0",
            "highlight.js": "^11.9.0",
            "md5": "^2.3.0",
            "tdesign-vue-next": "^1.7.0",
            "unplugin-auto-import": "^0.17.1",
            "unplugin-vue-components": "^0.25.2",
            "vue": "^3.3.8",
            "vue-clipboard3": "^2.0.0",
            "vue-picture-cropper": "^0.7.0",
            "vue-router": "^4.2.5"
        },
        "devDependencies": {
            "@vitejs/plugin-vue": "^4.5.0",
            "vite": "^5.0.0"
        }
        },
        "node_modules/@antfu/utils": {
        "version": "0.7.6",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@antfu/utils/-/utils-0.7.6.tgz",
        "integrity": "sha512-pvFiLP2BeOKA/ZOS6jxx4XhKzdVLHDhGlFEaZ2flWWYf2xOqVniqpk38I04DFRyz+L0ASggl7SkItTc+ZLju4w==",
        "funding": {
            "url": "https://github.com/sponsors/antfu"
        }
        },
        "node_modules/@babel/parser": {
        "version": "7.23.5",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@babel/parser/-/parser-7.23.5.tgz",
        "integrity": "sha512-hOOqoiNXrmGdFbhgCzu6GiURxUgM27Xwd/aPuu8RfHEZPBzL1Z54okAHAQjXfcQNwvrlkAmAp4SlRTZ45vlthQ==",
        "bin": {
            "parser": "bin/babel-parser.js"
        },
        "engines": {
            "node": ">=6.0.0"
        }
        },
        "node_modules/@babel/runtime": {
        "version": "7.23.5",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@babel/runtime/-/runtime-7.23.5.tgz",
        "integrity": "sha512-NdUTHcPe4C99WxPub+K9l9tK5/lV4UXIoaHSYgzco9BCyjKAAwzdBI+wWtYqHt7LJdbo74ZjRPJgzVweq1sz0w==",
        "dependencies": {
            "regenerator-runtime": "^0.14.0"
        },
        "engines": {
            "node": ">=6.9.0"
        }
        },
        "node_modules/@bassist/utils": {
        "version": "0.4.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@bassist/utils/-/utils-0.4.0.tgz",
        "integrity": "sha512-aoFTl0jUjm8/tDZodP41wnEkvB+C5O9NFCuYN/ztL6jSUSsuBkXq90/1ifBm1XhV/zySHgLYlU1+tgo3XtQ+nA==",
        "dependencies": {
            "@withtypes/mime": "^0.1.2"
        }
        },
        "node_modules/@esbuild/android-arm": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/android-arm/-/android-arm-0.19.8.tgz",
        "integrity": "sha512-31E2lxlGM1KEfivQl8Yf5aYU/mflz9g06H6S15ITUFQueMFtFjESRMoDSkvMo8thYvLBax+VKTPlpnx+sPicOA==",
        "cpu": [
            "arm"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "android"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/android-arm64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/android-arm64/-/android-arm64-0.19.8.tgz",
        "integrity": "sha512-B8JbS61bEunhfx8kasogFENgQfr/dIp+ggYXwTqdbMAgGDhRa3AaPpQMuQU0rNxDLECj6FhDzk1cF9WHMVwrtA==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "android"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/android-x64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/android-x64/-/android-x64-0.19.8.tgz",
        "integrity": "sha512-rdqqYfRIn4jWOp+lzQttYMa2Xar3OK9Yt2fhOhzFXqg0rVWEfSclJvZq5fZslnz6ypHvVf3CT7qyf0A5pM682A==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "android"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/darwin-arm64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/darwin-arm64/-/darwin-arm64-0.19.8.tgz",
        "integrity": "sha512-RQw9DemMbIq35Bprbboyf8SmOr4UXsRVxJ97LgB55VKKeJOOdvsIPy0nFyF2l8U+h4PtBx/1kRf0BelOYCiQcw==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "darwin"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/darwin-x64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/darwin-x64/-/darwin-x64-0.19.8.tgz",
        "integrity": "sha512-3sur80OT9YdeZwIVgERAysAbwncom7b4bCI2XKLjMfPymTud7e/oY4y+ci1XVp5TfQp/bppn7xLw1n/oSQY3/Q==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "darwin"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/freebsd-arm64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/freebsd-arm64/-/freebsd-arm64-0.19.8.tgz",
        "integrity": "sha512-WAnPJSDattvS/XtPCTj1tPoTxERjcTpH6HsMr6ujTT+X6rylVe8ggxk8pVxzf5U1wh5sPODpawNicF5ta/9Tmw==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "freebsd"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/freebsd-x64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/freebsd-x64/-/freebsd-x64-0.19.8.tgz",
        "integrity": "sha512-ICvZyOplIjmmhjd6mxi+zxSdpPTKFfyPPQMQTK/w+8eNK6WV01AjIztJALDtwNNfFhfZLux0tZLC+U9nSyA5Zg==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "freebsd"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-arm": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-arm/-/linux-arm-0.19.8.tgz",
        "integrity": "sha512-H4vmI5PYqSvosPaTJuEppU9oz1dq2A7Mr2vyg5TF9Ga+3+MGgBdGzcyBP7qK9MrwFQZlvNyJrvz6GuCaj3OukQ==",
        "cpu": [
            "arm"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-arm64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-arm64/-/linux-arm64-0.19.8.tgz",
        "integrity": "sha512-z1zMZivxDLHWnyGOctT9JP70h0beY54xDDDJt4VpTX+iwA77IFsE1vCXWmprajJGa+ZYSqkSbRQ4eyLCpCmiCQ==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-ia32": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-ia32/-/linux-ia32-0.19.8.tgz",
        "integrity": "sha512-1a8suQiFJmZz1khm/rDglOc8lavtzEMRo0v6WhPgxkrjcU0LkHj+TwBrALwoz/OtMExvsqbbMI0ChyelKabSvQ==",
        "cpu": [
            "ia32"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-loong64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-loong64/-/linux-loong64-0.19.8.tgz",
        "integrity": "sha512-fHZWS2JJxnXt1uYJsDv9+b60WCc2RlvVAy1F76qOLtXRO+H4mjt3Tr6MJ5l7Q78X8KgCFudnTuiQRBhULUyBKQ==",
        "cpu": [
            "loong64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-mips64el": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-mips64el/-/linux-mips64el-0.19.8.tgz",
        "integrity": "sha512-Wy/z0EL5qZYLX66dVnEg9riiwls5IYnziwuju2oUiuxVc+/edvqXa04qNtbrs0Ukatg5HEzqT94Zs7J207dN5Q==",
        "cpu": [
            "mips64el"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-ppc64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-ppc64/-/linux-ppc64-0.19.8.tgz",
        "integrity": "sha512-ETaW6245wK23YIEufhMQ3HSeHO7NgsLx8gygBVldRHKhOlD1oNeNy/P67mIh1zPn2Hr2HLieQrt6tWrVwuqrxg==",
        "cpu": [
            "ppc64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-riscv64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-riscv64/-/linux-riscv64-0.19.8.tgz",
        "integrity": "sha512-T2DRQk55SgoleTP+DtPlMrxi/5r9AeFgkhkZ/B0ap99zmxtxdOixOMI570VjdRCs9pE4Wdkz7JYrsPvsl7eESg==",
        "cpu": [
            "riscv64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-s390x": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-s390x/-/linux-s390x-0.19.8.tgz",
        "integrity": "sha512-NPxbdmmo3Bk7mbNeHmcCd7R7fptJaczPYBaELk6NcXxy7HLNyWwCyDJ/Xx+/YcNH7Im5dHdx9gZ5xIwyliQCbg==",
        "cpu": [
            "s390x"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/linux-x64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/linux-x64/-/linux-x64-0.19.8.tgz",
        "integrity": "sha512-lytMAVOM3b1gPypL2TRmZ5rnXl7+6IIk8uB3eLsV1JwcizuolblXRrc5ShPrO9ls/b+RTp+E6gbsuLWHWi2zGg==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/netbsd-x64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/netbsd-x64/-/netbsd-x64-0.19.8.tgz",
        "integrity": "sha512-hvWVo2VsXz/8NVt1UhLzxwAfo5sioj92uo0bCfLibB0xlOmimU/DeAEsQILlBQvkhrGjamP0/el5HU76HAitGw==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "netbsd"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/openbsd-x64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/openbsd-x64/-/openbsd-x64-0.19.8.tgz",
        "integrity": "sha512-/7Y7u77rdvmGTxR83PgaSvSBJCC2L3Kb1M/+dmSIvRvQPXXCuC97QAwMugBNG0yGcbEGfFBH7ojPzAOxfGNkwQ==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "openbsd"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/sunos-x64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/sunos-x64/-/sunos-x64-0.19.8.tgz",
        "integrity": "sha512-9Lc4s7Oi98GqFA4HzA/W2JHIYfnXbUYgekUP/Sm4BG9sfLjyv6GKKHKKVs83SMicBF2JwAX6A1PuOLMqpD001w==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "sunos"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/win32-arm64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/win32-arm64/-/win32-arm64-0.19.8.tgz",
        "integrity": "sha512-rq6WzBGjSzihI9deW3fC2Gqiak68+b7qo5/3kmB6Gvbh/NYPA0sJhrnp7wgV4bNwjqM+R2AApXGxMO7ZoGhIJg==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "win32"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/win32-ia32": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/win32-ia32/-/win32-ia32-0.19.8.tgz",
        "integrity": "sha512-AIAbverbg5jMvJznYiGhrd3sumfwWs8572mIJL5NQjJa06P8KfCPWZQ0NwZbPQnbQi9OWSZhFVSUWjjIrn4hSw==",
        "cpu": [
            "ia32"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "win32"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@esbuild/win32-x64": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@esbuild/win32-x64/-/win32-x64-0.19.8.tgz",
        "integrity": "sha512-bfZ0cQ1uZs2PqpulNL5j/3w+GDhP36k1K5c38QdQg+Swy51jFZWWeIkteNsufkQxp986wnqRRsb/bHbY1WQ7TA==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "win32"
        ],
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/@highlightjs/vue-plugin": {
        "version": "2.1.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@highlightjs/vue-plugin/-/vue-plugin-2.1.0.tgz",
        "integrity": "sha512-E+bmk4ncca+hBEYRV2a+1aIzIV0VSY/e5ArjpuSN9IO7wBJrzUE2u4ESCwrbQD7sAy+jWQjkV5qCCWgc+pu7CQ==",
        "peerDependencies": {
            "highlight.js": "^11.0.1",
            "vue": "^3"
        }
        },
        "node_modules/@jridgewell/sourcemap-codec": {
        "version": "1.4.15",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.4.15.tgz",
        "integrity": "sha512-eF2rxCRulEKXHTRiDrDy6erMYWqNw4LPdQ8UQA4huuxaQsVeRPFl2oM8oDGxMFhJUWZf9McpLtJasDDZb/Bpeg=="
        },
        "node_modules/@nodelib/fs.scandir": {
        "version": "2.1.5",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
        "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
        "dependencies": {
            "@nodelib/fs.stat": "2.0.5",
            "run-parallel": "^1.1.9"
        },
        "engines": {
            "node": ">= 8"
        }
        },
        "node_modules/@nodelib/fs.stat": {
        "version": "2.0.5",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
        "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
        "engines": {
            "node": ">= 8"
        }
        },
        "node_modules/@nodelib/fs.walk": {
        "version": "1.2.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
        "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
        "dependencies": {
            "@nodelib/fs.scandir": "2.1.5",
            "fastq": "^1.6.0"
        },
        "engines": {
            "node": ">= 8"
        }
        },
        "node_modules/@popperjs/core": {
        "version": "2.11.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@popperjs/core/-/core-2.11.8.tgz",
        "integrity": "sha512-P1st0aksCrn9sGZhp8GMYwBnQsbvAWsZAX44oXNNvLHGqAOcoVxmjZiohstwQ7SqKnbR47akdNi+uleWD8+g6A==",
        "funding": {
            "type": "opencollective",
            "url": "https://opencollective.com/popperjs"
        }
        },
        "node_modules/@rollup/pluginutils": {
        "version": "5.1.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/pluginutils/-/pluginutils-5.1.0.tgz",
        "integrity": "sha512-XTIWOPPcpvyKI6L1NHo0lFlCyznUEyPmPY1mc3KpPVDYulHSTvyeLNVW00QTLIAFNhR3kYnJTQHeGqU4M3n09g==",
        "dependencies": {
            "@types/estree": "^1.0.0",
            "estree-walker": "^2.0.2",
            "picomatch": "^2.3.1"
        },
        "engines": {
            "node": ">=14.0.0"
        },
        "peerDependencies": {
            "rollup": "^1.20.0||^2.0.0||^3.0.0||^4.0.0"
        },
        "peerDependenciesMeta": {
            "rollup": {
            "optional": true
            }
        }
        },
        "node_modules/@rollup/rollup-android-arm-eabi": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.6.1.tgz",
        "integrity": "sha512-0WQ0ouLejaUCRsL93GD4uft3rOmB8qoQMU05Kb8CmMtMBe7XUDLAltxVZI1q6byNqEtU7N1ZX1Vw5lIpgulLQA==",
        "cpu": [
            "arm"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "android"
        ]
        },
        "node_modules/@rollup/rollup-android-arm64": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.6.1.tgz",
        "integrity": "sha512-1TKm25Rn20vr5aTGGZqo6E4mzPicCUD79k17EgTLAsXc1zysyi4xXKACfUbwyANEPAEIxkzwue6JZ+stYzWUTA==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "android"
        ]
        },
        "node_modules/@rollup/rollup-darwin-arm64": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.6.1.tgz",
        "integrity": "sha512-cEXJQY/ZqMACb+nxzDeX9IPLAg7S94xouJJCNVE5BJM8JUEP4HeTF+ti3cmxWeSJo+5D+o8Tc0UAWUkfENdeyw==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "darwin"
        ]
        },
        "node_modules/@rollup/rollup-darwin-x64": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.6.1.tgz",
        "integrity": "sha512-LoSU9Xu56isrkV2jLldcKspJ7sSXmZWkAxg7sW/RfF7GS4F5/v4EiqKSMCFbZtDu2Nc1gxxFdQdKwkKS4rwxNg==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "darwin"
        ]
        },
        "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.6.1.tgz",
        "integrity": "sha512-EfI3hzYAy5vFNDqpXsNxXcgRDcFHUWSx5nnRSCKwXuQlI5J9dD84g2Usw81n3FLBNsGCegKGwwTVsSKK9cooSQ==",
        "cpu": [
            "arm"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ]
        },
        "node_modules/@rollup/rollup-linux-arm64-gnu": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.6.1.tgz",
        "integrity": "sha512-9lhc4UZstsegbNLhH0Zu6TqvDfmhGzuCWtcTFXY10VjLLUe4Mr0Ye2L3rrtHaDd/J5+tFMEuo5LTCSCMXWfUKw==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ]
        },
        "node_modules/@rollup/rollup-linux-arm64-musl": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.6.1.tgz",
        "integrity": "sha512-FfoOK1yP5ksX3wwZ4Zk1NgyGHZyuRhf99j64I5oEmirV8EFT7+OhUZEnP+x17lcP/QHJNWGsoJwrz4PJ9fBEXw==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ]
        },
        "node_modules/@rollup/rollup-linux-x64-gnu": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.6.1.tgz",
        "integrity": "sha512-DNGZvZDO5YF7jN5fX8ZqmGLjZEXIJRdJEdTFMhiyXqyXubBa0WVLDWSNlQ5JR2PNgDbEV1VQowhVRUh+74D+RA==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ]
        },
        "node_modules/@rollup/rollup-linux-x64-musl": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.6.1.tgz",
        "integrity": "sha512-RkJVNVRM+piYy87HrKmhbexCHg3A6Z6MU0W9GHnJwBQNBeyhCJG9KDce4SAMdicQnpURggSvtbGo9xAWOfSvIQ==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "linux"
        ]
        },
        "node_modules/@rollup/rollup-win32-arm64-msvc": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.6.1.tgz",
        "integrity": "sha512-v2FVT6xfnnmTe3W9bJXl6r5KwJglMK/iRlkKiIFfO6ysKs0rDgz7Cwwf3tjldxQUrHL9INT/1r4VA0n9L/F1vQ==",
        "cpu": [
            "arm64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "win32"
        ]
        },
        "node_modules/@rollup/rollup-win32-ia32-msvc": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.6.1.tgz",
        "integrity": "sha512-YEeOjxRyEjqcWphH9dyLbzgkF8wZSKAKUkldRY6dgNR5oKs2LZazqGB41cWJ4Iqqcy9/zqYgmzBkRoVz3Q9MLw==",
        "cpu": [
            "ia32"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "win32"
        ]
        },
        "node_modules/@rollup/rollup-win32-x64-msvc": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.6.1.tgz",
        "integrity": "sha512-0zfTlFAIhgz8V2G8STq8toAjsYYA6eci1hnXuyOTUFnymrtJwnS6uGKiv3v5UrPZkBlamLvrLV2iiaeqCKzb0A==",
        "cpu": [
            "x64"
        ],
        "dev": true,
        "optional": true,
        "os": [
            "win32"
        ]
        },
        "node_modules/@types/estree": {
        "version": "1.0.5",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@types/estree/-/estree-1.0.5.tgz",
        "integrity": "sha512-/kYRxGDLWzHOB7q+wtSUQlFrtcdUccpfy+X+9iMBpHK8QLLhx2wIPYuS5DYtR9Wa/YlZAbIovy7qVdB1Aq6Lyw=="
        },
        "node_modules/@types/lodash": {
        "version": "4.14.182",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@types/lodash/-/lodash-4.14.182.tgz",
        "integrity": "sha512-/THyiqyQAP9AfARo4pF+aCGcyiQ94tX/Is2I7HofNRqoYLgN1PBoOWu2/zTA5zMxzP5EFutMtWtGAFRKUe961Q=="
        },
        "node_modules/@types/sortablejs": {
        "version": "1.15.7",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@types/sortablejs/-/sortablejs-1.15.7.tgz",
        "integrity": "sha512-PvgWCx1Lbgm88FdQ6S7OGvLIjWS66mudKPlfdrWil0TjsO5zmoZmzoKiiwRShs1dwPgrlkr0N4ewuy0/+QUXYQ=="
        },
        "node_modules/@types/tinycolor2": {
        "version": "1.4.6",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@types/tinycolor2/-/tinycolor2-1.4.6.tgz",
        "integrity": "sha512-iEN8J0BoMnsWBqjVbWH/c0G0Hh7O21lpR2/+PrvAVgWdzL7eexIFm4JN/Wn10PTcmNdtS6U67r499mlWMXOxNw=="
        },
        "node_modules/@types/validator": {
        "version": "13.11.7",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@types/validator/-/validator-13.11.7.tgz",
        "integrity": "sha512-q0JomTsJ2I5Mv7dhHhQLGjMvX0JJm5dyZ1DXQySIUzU1UlwzB8bt+R6+LODUbz0UDIOvEzGc28tk27gBJw2N8Q=="
        },
        "node_modules/@vitejs/plugin-vue": {
        "version": "4.5.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vitejs/plugin-vue/-/plugin-vue-4.5.2.tgz",
        "integrity": "sha512-UGR3DlzLi/SaVBPX0cnSyE37vqxU3O6chn8l0HJNzQzDia6/Au2A4xKv+iIJW8w2daf80G7TYHhi1pAUjdZ0bQ==",
        "dev": true,
        "engines": {
            "node": "^14.18.0 || >=16.0.0"
        },
        "peerDependencies": {
            "vite": "^4.0.0 || ^5.0.0",
            "vue": "^3.2.25"
        }
        },
        "node_modules/@vue/compiler-core": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/compiler-core/-/compiler-core-3.3.10.tgz",
        "integrity": "sha512-doe0hODR1+i1menPkRzJ5MNR6G+9uiZHIknK3Zn5OcIztu6GGw7u0XUzf3AgB8h/dfsZC9eouzoLo3c3+N/cVA==",
        "dependencies": {
            "@babel/parser": "^7.23.5",
            "@vue/shared": "3.3.10",
            "estree-walker": "^2.0.2",
            "source-map-js": "^1.0.2"
        }
        },
        "node_modules/@vue/compiler-dom": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/compiler-dom/-/compiler-dom-3.3.10.tgz",
        "integrity": "sha512-NCrqF5fm10GXZIK0GrEAauBqdy+F2LZRt3yNHzrYjpYBuRssQbuPLtSnSNjyR9luHKkWSH8we5LMB3g+4z2HvA==",
        "dependencies": {
            "@vue/compiler-core": "3.3.10",
            "@vue/shared": "3.3.10"
        }
        },
        "node_modules/@vue/compiler-sfc": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/compiler-sfc/-/compiler-sfc-3.3.10.tgz",
        "integrity": "sha512-xpcTe7Rw7QefOTRFFTlcfzozccvjM40dT45JtrE3onGm/jBLZ0JhpKu3jkV7rbDFLeeagR/5RlJ2Y9SvyS0lAg==",
        "dependencies": {
            "@babel/parser": "^7.23.5",
            "@vue/compiler-core": "3.3.10",
            "@vue/compiler-dom": "3.3.10",
            "@vue/compiler-ssr": "3.3.10",
            "@vue/reactivity-transform": "3.3.10",
            "@vue/shared": "3.3.10",
            "estree-walker": "^2.0.2",
            "magic-string": "^0.30.5",
            "postcss": "^8.4.32",
            "source-map-js": "^1.0.2"
        }
        },
        "node_modules/@vue/compiler-ssr": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/compiler-ssr/-/compiler-ssr-3.3.10.tgz",
        "integrity": "sha512-12iM4jA4GEbskwXMmPcskK5wImc2ohKm408+o9iox3tfN9qua8xL0THIZtoe9OJHnXP4eOWZpgCAAThEveNlqQ==",
        "dependencies": {
            "@vue/compiler-dom": "3.3.10",
            "@vue/shared": "3.3.10"
        }
        },
        "node_modules/@vue/devtools-api": {
        "version": "6.5.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/devtools-api/-/devtools-api-6.5.1.tgz",
        "integrity": "sha512-+KpckaAQyfbvshdDW5xQylLni1asvNSGme1JFs8I1+/H5pHEhqUKMEQD/qn3Nx5+/nycBq11qAEi8lk+LXI2dA=="
        },
        "node_modules/@vue/reactivity": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/reactivity/-/reactivity-3.3.10.tgz",
        "integrity": "sha512-H5Z7rOY/JLO+e5a6/FEXaQ1TMuOvY4LDVgT+/+HKubEAgs9qeeZ+NhADSeEtrNQeiKLDuzeKc8v0CUFpB6Pqgw==",
        "dependencies": {
            "@vue/shared": "3.3.10"
        }
        },
        "node_modules/@vue/reactivity-transform": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/reactivity-transform/-/reactivity-transform-3.3.10.tgz",
        "integrity": "sha512-0xBdk+CKHWT+Gev8oZ63Tc0qFfj935YZx+UAynlutnrDZ4diFCVFMWixn65HzjE3S1iJppWOo6Tt1OzASH7VEg==",
        "dependencies": {
            "@babel/parser": "^7.23.5",
            "@vue/compiler-core": "3.3.10",
            "@vue/shared": "3.3.10",
            "estree-walker": "^2.0.2",
            "magic-string": "^0.30.5"
        }
        },
        "node_modules/@vue/runtime-core": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/runtime-core/-/runtime-core-3.3.10.tgz",
        "integrity": "sha512-DZ0v31oTN4YHX9JEU5VW1LoIVgFovWgIVb30bWn9DG9a7oA415idcwsRNNajqTx8HQJyOaWfRKoyuP2P2TYIag==",
        "dependencies": {
            "@vue/reactivity": "3.3.10",
            "@vue/shared": "3.3.10"
        }
        },
        "node_modules/@vue/runtime-dom": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/runtime-dom/-/runtime-dom-3.3.10.tgz",
        "integrity": "sha512-c/jKb3ny05KJcYk0j1m7Wbhrxq7mZYr06GhKykDMNRRR9S+/dGT8KpHuNQjv3/8U4JshfkAk6TpecPD3B21Ijw==",
        "dependencies": {
            "@vue/runtime-core": "3.3.10",
            "@vue/shared": "3.3.10",
            "csstype": "^3.1.2"
        }
        },
        "node_modules/@vue/server-renderer": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/server-renderer/-/server-renderer-3.3.10.tgz",
        "integrity": "sha512-0i6ww3sBV3SKlF3YTjSVqKQ74xialMbjVYGy7cOTi7Imd8ediE7t72SK3qnvhrTAhOvlQhq6Bk6nFPdXxe0sAg==",
        "dependencies": {
            "@vue/compiler-ssr": "3.3.10",
            "@vue/shared": "3.3.10"
        },
        "peerDependencies": {
            "vue": "3.3.10"
        }
        },
        "node_modules/@vue/shared": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@vue/shared/-/shared-3.3.10.tgz",
        "integrity": "sha512-2y3Y2J1a3RhFa0WisHvACJR2ncvWiVHcP8t0Inxo+NKz+8RKO4ZV8eZgCxRgQoA6ITfV12L4E6POOL9HOU5nqw=="
        },
        "node_modules/@withtypes/mime": {
        "version": "0.1.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/@withtypes/mime/-/mime-0.1.2.tgz",
        "integrity": "sha512-PB9BfZGzwblUONJY0LiOwsHCA6uV3DIPj/w9ReekdHxPOl0VdUFgI5s4avKycuuq9Gf5Nz2ZPA2O36GAUzlMPA==",
        "dependencies": {
            "mime": "^3.0.0"
        }
        },
        "node_modules/acorn": {
        "version": "8.11.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/acorn/-/acorn-8.11.2.tgz",
        "integrity": "sha512-nc0Axzp/0FILLEVsm4fNwLCwMttvhEI263QtVPQcbpfZZ3ts0hLsZGOpE6czNlid7CJ9MlyH8reXkpsf3YUY4w==",
        "bin": {
            "acorn": "bin/acorn"
        },
        "engines": {
            "node": ">=0.4.0"
        }
        },
        "node_modules/anymatch": {
        "version": "3.1.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/anymatch/-/anymatch-3.1.3.tgz",
        "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
        "dependencies": {
            "normalize-path": "^3.0.0",
            "picomatch": "^2.0.4"
        },
        "engines": {
            "node": ">= 8"
        }
        },
        "node_modules/balanced-match": {
        "version": "1.0.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/balanced-match/-/balanced-match-1.0.2.tgz",
        "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw=="
        },
        "node_modules/binary-extensions": {
        "version": "2.2.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/binary-extensions/-/binary-extensions-2.2.0.tgz",
        "integrity": "sha512-jDctJ/IVQbZoJykoeHbhXpOlNBqGNcwXJKJog42E5HDPUwQTSdjCHdihjj0DlnheQ7blbT6dHOafNAiS8ooQKA==",
        "engines": {
            "node": ">=8"
        }
        },
        "node_modules/brace-expansion": {
        "version": "2.0.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/brace-expansion/-/brace-expansion-2.0.1.tgz",
        "integrity": "sha512-XnAIvQ8eM+kC6aULx6wuQiwVsnzsi9d3WxzV3FpWTGA19F621kwdbsAcFKXgKUHZWsy+mY6iL1sHTxWEFCytDA==",
        "dependencies": {
            "balanced-match": "^1.0.0"
        }
        },
        "node_modules/braces": {
        "version": "3.0.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/braces/-/braces-3.0.2.tgz",
        "integrity": "sha512-b8um+L1RzM3WDSzvhm6gIz1yfTbBt6YTlcEKAvsmqCZZFw46z626lVj9j1yEPW33H5H+lBQpZMP1k8l+78Ha0A==",
        "dependencies": {
            "fill-range": "^7.0.1"
        },
        "engines": {
            "node": ">=8"
        }
        },
        "node_modules/charenc": {
        "version": "0.0.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/charenc/-/charenc-0.0.2.tgz",
        "integrity": "sha1-wKHS86cJLgN3S/qD8UwPxXkKhmc=",
        "engines": {
            "node": "*"
        }
        },
        "node_modules/chokidar": {
        "version": "3.5.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/chokidar/-/chokidar-3.5.3.tgz",
        "integrity": "sha512-Dr3sfKRP6oTcjf2JmUmFJfeVMvXBdegxB0iVQ5eb2V10uFJUCAS8OByZdVAyVb8xXNz3GjjTgj9kLWsZTqE6kw==",
        "funding": [
            {
            "type": "individual",
            "url": "https://paulmillr.com/funding/"
            }
        ],
        "dependencies": {
            "anymatch": "~3.1.2",
            "braces": "~3.0.2",
            "glob-parent": "~5.1.2",
            "is-binary-path": "~2.1.0",
            "is-glob": "~4.0.1",
            "normalize-path": "~3.0.0",
            "readdirp": "~3.6.0"
        },
        "engines": {
            "node": ">= 8.10.0"
        },
        "optionalDependencies": {
            "fsevents": "~2.3.2"
        }
        },
        "node_modules/clipboard": {
        "version": "2.0.11",
        "resolved": "https://mirrors.cloud.tencent.com/npm/clipboard/-/clipboard-2.0.11.tgz",
        "integrity": "sha512-C+0bbOqkezLIsmWSvlsXS0Q0bmkugu7jcfMIACB+RDEntIzQIkdr148we28AfSloQLRdZlYL/QYyrq05j/3Faw==",
        "dependencies": {
            "good-listener": "^1.2.2",
            "select": "^1.1.2",
            "tiny-emitter": "^2.0.0"
        }
        },
        "node_modules/cropperjs": {
        "version": "1.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/cropperjs/-/cropperjs-1.6.1.tgz",
        "integrity": "sha512-F4wsi+XkDHCOMrHMYjrTEE4QBOrsHHN5/2VsVAaRq8P7E5z7xQpT75S+f/9WikmBEailas3+yo+6zPIomW+NOA=="
        },
        "node_modules/crypt": {
        "version": "0.0.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/crypt/-/crypt-0.0.2.tgz",
        "integrity": "sha1-iNf/fsDfuG9xPch7u0LQRNPmxBs=",
        "engines": {
            "node": "*"
        }
        },
        "node_modules/csstype": {
        "version": "3.1.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/csstype/-/csstype-3.1.3.tgz",
        "integrity": "sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw=="
        },
        "node_modules/dayjs": {
        "version": "1.11.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/dayjs/-/dayjs-1.11.10.tgz",
        "integrity": "sha512-vjAczensTgRcqDERK0SR2XMwsF/tSvnvlv6VcF2GIhg6Sx4yOIt/irsr1RDJsKiIyBzJDpCoXiWWq28MqH2cnQ=="
        },
        "node_modules/debug": {
        "version": "4.3.4",
        "resolved": "https://mirrors.cloud.tencent.com/npm/debug/-/debug-4.3.4.tgz",
        "integrity": "sha512-PRWFHuSU3eDtQJPvnNY7Jcket1j0t5OuOsFzPPzsekD52Zl8qUfFIPEiswXqIvHWGVHOgX+7G/vCNNhehwxfkQ==",
        "dependencies": {
            "ms": "2.1.2"
        },
        "engines": {
            "node": ">=6.0"
        },
        "peerDependenciesMeta": {
            "supports-color": {
            "optional": true
            }
        }
        },
        "node_modules/delegate": {
        "version": "3.2.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/delegate/-/delegate-3.2.0.tgz",
        "integrity": "sha512-IofjkYBZaZivn0V8nnsMJGBr4jVLxHDheKSW88PyxS5QC4Vo9ZbZVvhzlSxY87fVq3STR6r+4cGepyHkcWOQSw=="
        },
        "node_modules/echarts": {
        "version": "5.4.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/echarts/-/echarts-5.4.3.tgz",
        "integrity": "sha512-mYKxLxhzy6zyTi/FaEbJMOZU1ULGEQHaeIeuMR5L+JnJTpz+YR03mnnpBhbR4+UYJAgiXgpyTVLffPAjOTLkZA==",
        "dependencies": {
            "tslib": "2.3.0",
            "zrender": "5.4.4"
        }
        },
        "node_modules/esbuild": {
        "version": "0.19.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/esbuild/-/esbuild-0.19.8.tgz",
        "integrity": "sha512-l7iffQpT2OrZfH2rXIp7/FkmaeZM0vxbxN9KfiCwGYuZqzMg/JdvX26R31Zxn/Pxvsrg3Y9N6XTcnknqDyyv4w==",
        "dev": true,
        "hasInstallScript": true,
        "bin": {
            "esbuild": "bin/esbuild"
        },
        "engines": {
            "node": ">=12"
        },
        "optionalDependencies": {
            "@esbuild/android-arm": "0.19.8",
            "@esbuild/android-arm64": "0.19.8",
            "@esbuild/android-x64": "0.19.8",
            "@esbuild/darwin-arm64": "0.19.8",
            "@esbuild/darwin-x64": "0.19.8",
            "@esbuild/freebsd-arm64": "0.19.8",
            "@esbuild/freebsd-x64": "0.19.8",
            "@esbuild/linux-arm": "0.19.8",
            "@esbuild/linux-arm64": "0.19.8",
            "@esbuild/linux-ia32": "0.19.8",
            "@esbuild/linux-loong64": "0.19.8",
            "@esbuild/linux-mips64el": "0.19.8",
            "@esbuild/linux-ppc64": "0.19.8",
            "@esbuild/linux-riscv64": "0.19.8",
            "@esbuild/linux-s390x": "0.19.8",
            "@esbuild/linux-x64": "0.19.8",
            "@esbuild/netbsd-x64": "0.19.8",
            "@esbuild/openbsd-x64": "0.19.8",
            "@esbuild/sunos-x64": "0.19.8",
            "@esbuild/win32-arm64": "0.19.8",
            "@esbuild/win32-ia32": "0.19.8",
            "@esbuild/win32-x64": "0.19.8"
        }
        },
        "node_modules/escape-string-regexp": {
        "version": "5.0.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/escape-string-regexp/-/escape-string-regexp-5.0.0.tgz",
        "integrity": "sha512-/veY75JbMK4j1yjvuUxuVsiS/hr/4iHs9FTT6cgTexxdE0Ly/glccBAkloH/DofkjRbZU3bnoj38mOmhkZ0lHw==",
        "engines": {
            "node": ">=12"
        },
        "funding": {
            "url": "https://github.com/sponsors/sindresorhus"
        }
        },
        "node_modules/estree-walker": {
        "version": "2.0.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/estree-walker/-/estree-walker-2.0.2.tgz",
        "integrity": "sha512-Rfkk/Mp/DL7JVje3u18FxFujQlTNR2q6QfMSMB7AvCBx91NGj/ba3kCfza0f6dVDbw7YlRf/nDrn7pQrCCyQ/w=="
        },
        "node_modules/fast-glob": {
        "version": "3.3.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/fast-glob/-/fast-glob-3.3.2.tgz",
        "integrity": "sha512-oX2ruAFQwf/Orj8m737Y5adxDQO0LAB7/S5MnxCdTNDd4p6BsyIVsv9JQsATbTSq8KHRpLwIHbVlUNatxd+1Ow==",
        "dependencies": {
            "@nodelib/fs.stat": "^2.0.2",
            "@nodelib/fs.walk": "^1.2.3",
            "glob-parent": "^5.1.2",
            "merge2": "^1.3.0",
            "micromatch": "^4.0.4"
        },
        "engines": {
            "node": ">=8.6.0"
        }
        },
        "node_modules/fastq": {
        "version": "1.15.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/fastq/-/fastq-1.15.0.tgz",
        "integrity": "sha512-wBrocU2LCXXa+lWBt8RoIRD89Fi8OdABODa/kEnyeyjS5aZO5/GNvI5sEINADqP/h8M29UHTHUb53sUu5Ihqdw==",
        "dependencies": {
            "reusify": "^1.0.4"
        }
        },
        "node_modules/fetch-jsonp": {
        "version": "1.3.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/fetch-jsonp/-/fetch-jsonp-1.3.0.tgz",
        "integrity": "sha512-hxCYGvmANEmpkHpeWY8Kawfa5Z1t2csTpIClIDG/0S92eALWHRU1RnGaj86Tf5Cc0QF+afSa4SQ4pFB2rFM5QA=="
        },
        "node_modules/fill-range": {
        "version": "7.0.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/fill-range/-/fill-range-7.0.1.tgz",
        "integrity": "sha512-qOo9F+dMUmC2Lcb4BbVvnKJxTPjCm+RRpe4gDuGrzkL7mEVl/djYSu2OdQ2Pa302N4oqkSg9ir6jaLWJ2USVpQ==",
        "dependencies": {
            "to-regex-range": "^5.0.1"
        },
        "engines": {
            "node": ">=8"
        }
        },
        "node_modules/fsevents": {
        "version": "2.3.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/fsevents/-/fsevents-2.3.3.tgz",
        "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
        "hasInstallScript": true,
        "optional": true,
        "os": [
            "darwin"
        ],
        "engines": {
            "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
        }
        },
        "node_modules/function-bind": {
        "version": "1.1.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/function-bind/-/function-bind-1.1.2.tgz",
        "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
        "funding": {
            "url": "https://github.com/sponsors/ljharb"
        }
        },
        "node_modules/glob-parent": {
        "version": "5.1.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/glob-parent/-/glob-parent-5.1.2.tgz",
        "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
        "dependencies": {
            "is-glob": "^4.0.1"
        },
        "engines": {
            "node": ">= 6"
        }
        },
        "node_modules/good-listener": {
        "version": "1.2.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/good-listener/-/good-listener-1.2.2.tgz",
        "integrity": "sha1-1TswzfkxPf+33JoNR3CWqm0UXFA=",
        "dependencies": {
            "delegate": "^3.1.2"
        }
        },
        "node_modules/hasown": {
        "version": "2.0.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/hasown/-/hasown-2.0.0.tgz",
        "integrity": "sha512-vUptKVTpIJhcczKBbgnS+RtcuYMB8+oNzPK2/Hp3hanz8JmpATdmmgLgSaadVREkDm+e2giHwY3ZRkyjSIDDFA==",
        "dependencies": {
            "function-bind": "^1.1.2"
        },
        "engines": {
            "node": ">= 0.4"
        }
        },
        "node_modules/highlight.js": {
        "version": "11.9.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/highlight.js/-/highlight.js-11.9.0.tgz",
        "integrity": "sha512-fJ7cW7fQGCYAkgv4CPfwFHrfd/cLS4Hau96JuJ+ZTOWhjnhoeN1ub1tFmALm/+lW5z4WCAuAV9bm05AP0mS6Gw==",
        "engines": {
            "node": ">=12.0.0"
        }
        },
        "node_modules/is-binary-path": {
        "version": "2.1.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/is-binary-path/-/is-binary-path-2.1.0.tgz",
        "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
        "dependencies": {
            "binary-extensions": "^2.0.0"
        },
        "engines": {
            "node": ">=8"
        }
        },
        "node_modules/is-buffer": {
        "version": "1.1.6",
        "resolved": "https://mirrors.cloud.tencent.com/npm/is-buffer/-/is-buffer-1.1.6.tgz",
        "integrity": "sha512-NcdALwpXkTm5Zvvbk7owOUSvVvBKDgKP5/ewfXEznmQFfs4ZRmanOeKBTjRVjka3QFoN6XJ+9F3USqfHqTaU5w=="
        },
        "node_modules/is-core-module": {
        "version": "2.13.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/is-core-module/-/is-core-module-2.13.1.tgz",
        "integrity": "sha512-hHrIjvZsftOsvKSn2TRYl63zvxsgE0K+0mYMoH6gD4omR5IWB2KynivBQczo3+wF1cCkjzvptnI9Q0sPU66ilw==",
        "dependencies": {
            "hasown": "^2.0.0"
        },
        "funding": {
            "url": "https://github.com/sponsors/ljharb"
        }
        },
        "node_modules/is-extglob": {
        "version": "2.1.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/is-extglob/-/is-extglob-2.1.1.tgz",
        "integrity": "sha1-qIwCU1eR8C7TfHahueqXc8gz+MI=",
        "engines": {
            "node": ">=0.10.0"
        }
        },
        "node_modules/is-glob": {
        "version": "4.0.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/is-glob/-/is-glob-4.0.3.tgz",
        "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
        "dependencies": {
            "is-extglob": "^2.1.1"
        },
        "engines": {
            "node": ">=0.10.0"
        }
        },
        "node_modules/is-number": {
        "version": "7.0.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/is-number/-/is-number-7.0.0.tgz",
        "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
        "engines": {
            "node": ">=0.12.0"
        }
        },
        "node_modules/jsonc-parser": {
        "version": "3.2.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/jsonc-parser/-/jsonc-parser-3.2.0.tgz",
        "integrity": "sha512-gfFQZrcTc8CnKXp6Y4/CBT3fTc0OVuDofpre4aEeEpSBPV5X5v4+Vmx+8snU7RLPrNHPKSgLxGo9YuQzz20o+w=="
        },
        "node_modules/local-pkg": {
        "version": "0.5.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/local-pkg/-/local-pkg-0.5.0.tgz",
        "integrity": "sha512-ok6z3qlYyCDS4ZEU27HaU6x/xZa9Whf8jD4ptH5UZTQYZVYeb9bnZ3ojVhiJNLiXK1Hfc0GNbLXcmZ5plLDDBg==",
        "dependencies": {
            "mlly": "^1.4.2",
            "pkg-types": "^1.0.3"
        },
        "engines": {
            "node": ">=14"
        },
        "funding": {
            "url": "https://github.com/sponsors/antfu"
        }
        },
        "node_modules/lodash": {
        "version": "4.17.21",
        "resolved": "https://mirrors.cloud.tencent.com/npm/lodash/-/lodash-4.17.21.tgz",
        "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg=="
        },
        "node_modules/magic-string": {
        "version": "0.30.5",
        "resolved": "https://mirrors.cloud.tencent.com/npm/magic-string/-/magic-string-0.30.5.tgz",
        "integrity": "sha512-7xlpfBaQaP/T6Vh8MO/EqXSW5En6INHEvEXQiuff7Gku0PWjU3uf6w/j9o7O+SpB5fOAkrI5HeoNgwjEO0pFsA==",
        "dependencies": {
            "@jridgewell/sourcemap-codec": "^1.4.15"
        },
        "engines": {
            "node": ">=12"
        }
        },
        "node_modules/md5": {
        "version": "2.3.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/md5/-/md5-2.3.0.tgz",
        "integrity": "sha512-T1GITYmFaKuO91vxyoQMFETst+O71VUPEU3ze5GNzDm0OWdP8v1ziTaAEPUr/3kLsY3Sftgz242A1SetQiDL7g==",
        "dependencies": {
            "charenc": "0.0.2",
            "crypt": "0.0.2",
            "is-buffer": "~1.1.6"
        }
        },
        "node_modules/merge2": {
        "version": "1.4.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/merge2/-/merge2-1.4.1.tgz",
        "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
        "engines": {
            "node": ">= 8"
        }
        },
        "node_modules/micromatch": {
        "version": "4.0.5",
        "resolved": "https://mirrors.cloud.tencent.com/npm/micromatch/-/micromatch-4.0.5.tgz",
        "integrity": "sha512-DMy+ERcEW2q8Z2Po+WNXuw3c5YaUSFjAO5GsJqfEl7UjvtIuFKO6ZrKvcItdy98dwFI2N1tg3zNIdKaQT+aNdA==",
        "dependencies": {
            "braces": "^3.0.2",
            "picomatch": "^2.3.1"
        },
        "engines": {
            "node": ">=8.6"
        }
        },
        "node_modules/mime": {
        "version": "3.0.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/mime/-/mime-3.0.0.tgz",
        "integrity": "sha512-jSCU7/VB1loIWBZe14aEYHU/+1UMEHoaO7qxCOVJOw9GgH72VAWppxNcjU+x9a2k3GSIBXNKxXQFqRvvZ7vr3A==",
        "bin": {
            "mime": "cli.js"
        },
        "engines": {
            "node": ">=10.0.0"
        }
        },
        "node_modules/minimatch": {
        "version": "9.0.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/minimatch/-/minimatch-9.0.3.tgz",
        "integrity": "sha512-RHiac9mvaRw0x3AYRgDC1CxAP7HTcNrrECeA8YYJeWnpo+2Q5CegtZjaotWTWxDG3UeGA1coE05iH1mPjT/2mg==",
        "dependencies": {
            "brace-expansion": "^2.0.1"
        },
        "engines": {
            "node": ">=16 || 14 >=14.17"
        },
        "funding": {
            "url": "https://github.com/sponsors/isaacs"
        }
        },
        "node_modules/mitt": {
        "version": "3.0.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/mitt/-/mitt-3.0.1.tgz",
        "integrity": "sha512-vKivATfr97l2/QBCYAkXYDbrIWPM2IIKEl7YPhjCvKlG3kE2gm+uBo6nEXK3M5/Ffh/FLpKExzOQ3JJoJGFKBw=="
        },
        "node_modules/mlly": {
        "version": "1.4.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/mlly/-/mlly-1.4.2.tgz",
        "integrity": "sha512-i/Ykufi2t1EZ6NaPLdfnZk2AX8cs0d+mTzVKuPfqPKPatxLApaBoxJQ9x1/uckXtrS/U5oisPMDkNs0yQTaBRg==",
        "dependencies": {
            "acorn": "^8.10.0",
            "pathe": "^1.1.1",
            "pkg-types": "^1.0.3",
            "ufo": "^1.3.0"
        }
        },
        "node_modules/ms": {
        "version": "2.1.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/ms/-/ms-2.1.2.tgz",
        "integrity": "sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w=="
        },
        "node_modules/nanoid": {
        "version": "3.3.7",
        "resolved": "https://mirrors.cloud.tencent.com/npm/nanoid/-/nanoid-3.3.7.tgz",
        "integrity": "sha512-eSRppjcPIatRIMC1U6UngP8XFcz8MQWGQdt1MTBQ7NaAmvXDfvNxbvWV3x2y6CdEUciCSsDHDQZbhYaB8QEo2g==",
        "funding": [
            {
            "type": "github",
            "url": "https://github.com/sponsors/ai"
            }
        ],
        "bin": {
            "nanoid": "bin/nanoid.cjs"
        },
        "engines": {
            "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
        }
        },
        "node_modules/normalize-path": {
        "version": "3.0.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/normalize-path/-/normalize-path-3.0.0.tgz",
        "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
        "engines": {
            "node": ">=0.10.0"
        }
        },
        "node_modules/path-parse": {
        "version": "1.0.7",
        "resolved": "https://mirrors.cloud.tencent.com/npm/path-parse/-/path-parse-1.0.7.tgz",
        "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw=="
        },
        "node_modules/pathe": {
        "version": "1.1.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/pathe/-/pathe-1.1.1.tgz",
        "integrity": "sha512-d+RQGp0MAYTIaDBIMmOfMwz3E+LOZnxx1HZd5R18mmCZY0QBlK0LDZfPc8FW8Ed2DlvsuE6PRjroDY+wg4+j/Q=="
        },
        "node_modules/picocolors": {
        "version": "1.0.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/picocolors/-/picocolors-1.0.0.tgz",
        "integrity": "sha512-1fygroTLlHu66zi26VoTDv8yRgm0Fccecssto+MhsZ0D/DGW2sm8E8AjW7NU5VVTRt5GxbeZ5qBuJr+HyLYkjQ=="
        },
        "node_modules/picomatch": {
        "version": "2.3.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/picomatch/-/picomatch-2.3.1.tgz",
        "integrity": "sha512-JU3teHTNjmE2VCGFzuY8EXzCDVwEqB2a8fsIvwaStHhAWJEeVd1o1QD80CU6+ZdEXXSLbSsuLwJjkCBWqRQUVA==",
        "engines": {
            "node": ">=8.6"
        },
        "funding": {
            "url": "https://github.com/sponsors/jonschlinkert"
        }
        },
        "node_modules/pkg-types": {
        "version": "1.0.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/pkg-types/-/pkg-types-1.0.3.tgz",
        "integrity": "sha512-nN7pYi0AQqJnoLPC9eHFQ8AcyaixBUOwvqc5TDnIKCMEE6I0y8P7OKA7fPexsXGCGxQDl/cmrLAp26LhcwxZ4A==",
        "dependencies": {
            "jsonc-parser": "^3.2.0",
            "mlly": "^1.2.0",
            "pathe": "^1.1.0"
        }
        },
        "node_modules/postcss": {
        "version": "8.4.32",
        "resolved": "https://mirrors.cloud.tencent.com/npm/postcss/-/postcss-8.4.32.tgz",
        "integrity": "sha512-D/kj5JNu6oo2EIy+XL/26JEDTlIbB8hw85G8StOE6L74RQAVVP5rej6wxCNqyMbR4RkPfqvezVbPw81Ngd6Kcw==",
        "funding": [
            {
            "type": "opencollective",
            "url": "https://opencollective.com/postcss/"
            },
            {
            "type": "tidelift",
            "url": "https://tidelift.com/funding/github/npm/postcss"
            },
            {
            "type": "github",
            "url": "https://github.com/sponsors/ai"
            }
        ],
        "dependencies": {
            "nanoid": "^3.3.7",
            "picocolors": "^1.0.0",
            "source-map-js": "^1.0.2"
        },
        "engines": {
            "node": "^10 || ^12 || >=14"
        }
        },
        "node_modules/queue-microtask": {
        "version": "1.2.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/queue-microtask/-/queue-microtask-1.2.3.tgz",
        "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
        "funding": [
            {
            "type": "github",
            "url": "https://github.com/sponsors/feross"
            },
            {
            "type": "patreon",
            "url": "https://www.patreon.com/feross"
            },
            {
            "type": "consulting",
            "url": "https://feross.org/support"
            }
        ]
        },
        "node_modules/readdirp": {
        "version": "3.6.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/readdirp/-/readdirp-3.6.0.tgz",
        "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
        "dependencies": {
            "picomatch": "^2.2.1"
        },
        "engines": {
            "node": ">=8.10.0"
        }
        },
        "node_modules/regenerator-runtime": {
        "version": "0.14.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/regenerator-runtime/-/regenerator-runtime-0.14.0.tgz",
        "integrity": "sha512-srw17NI0TUWHuGa5CFGGmhfNIeja30WMBfbslPNhf6JrqQlLN5gcrvig1oqPxiVaXb0oW0XRKtH6Nngs5lKCIA=="
        },
        "node_modules/resolve": {
        "version": "1.22.8",
        "resolved": "https://mirrors.cloud.tencent.com/npm/resolve/-/resolve-1.22.8.tgz",
        "integrity": "sha512-oKWePCxqpd6FlLvGV1VU0x7bkPmmCNolxzjMf4NczoDnQcIWrAF+cPtZn5i6n+RfD2d9i0tzpKnG6Yk168yIyw==",
        "dependencies": {
            "is-core-module": "^2.13.0",
            "path-parse": "^1.0.7",
            "supports-preserve-symlinks-flag": "^1.0.0"
        },
        "bin": {
            "resolve": "bin/resolve"
        },
        "funding": {
            "url": "https://github.com/sponsors/ljharb"
        }
        },
        "node_modules/reusify": {
        "version": "1.0.4",
        "resolved": "https://mirrors.cloud.tencent.com/npm/reusify/-/reusify-1.0.4.tgz",
        "integrity": "sha512-U9nH88a3fc/ekCF1l0/UP1IosiuIjyTh7hBvXVMHYgVcfGvt897Xguj2UOLDeI5BG2m7/uwyaLVT6fbtCwTyzw==",
        "engines": {
            "iojs": ">=1.0.0",
            "node": ">=0.10.0"
        }
        },
        "node_modules/rollup": {
        "version": "4.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/rollup/-/rollup-4.6.1.tgz",
        "integrity": "sha512-jZHaZotEHQaHLgKr8JnQiDT1rmatjgKlMekyksz+yk9jt/8z9quNjnKNRoaM0wd9DC2QKXjmWWuDYtM3jfF8pQ==",
        "devOptional": true,
        "bin": {
            "rollup": "dist/bin/rollup"
        },
        "engines": {
            "node": ">=18.0.0",
            "npm": ">=8.0.0"
        },
        "optionalDependencies": {
            "@rollup/rollup-android-arm-eabi": "4.6.1",
            "@rollup/rollup-android-arm64": "4.6.1",
            "@rollup/rollup-darwin-arm64": "4.6.1",
            "@rollup/rollup-darwin-x64": "4.6.1",
            "@rollup/rollup-linux-arm-gnueabihf": "4.6.1",
            "@rollup/rollup-linux-arm64-gnu": "4.6.1",
            "@rollup/rollup-linux-arm64-musl": "4.6.1",
            "@rollup/rollup-linux-x64-gnu": "4.6.1",
            "@rollup/rollup-linux-x64-musl": "4.6.1",
            "@rollup/rollup-win32-arm64-msvc": "4.6.1",
            "@rollup/rollup-win32-ia32-msvc": "4.6.1",
            "@rollup/rollup-win32-x64-msvc": "4.6.1",
            "fsevents": "~2.3.2"
        }
        },
        "node_modules/run-parallel": {
        "version": "1.2.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/run-parallel/-/run-parallel-1.2.0.tgz",
        "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
        "funding": [
            {
            "type": "github",
            "url": "https://github.com/sponsors/feross"
            },
            {
            "type": "patreon",
            "url": "https://www.patreon.com/feross"
            },
            {
            "type": "consulting",
            "url": "https://feross.org/support"
            }
        ],
        "dependencies": {
            "queue-microtask": "^1.2.2"
        }
        },
        "node_modules/scule": {
        "version": "1.1.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/scule/-/scule-1.1.1.tgz",
        "integrity": "sha512-sHtm/SsIK9BUBI3EFT/Gnp9VoKfY6QLvlkvAE6YK7454IF8FSgJEAnJpVdSC7K5/pjI5NfxhzBLW2JAfYA/shQ=="
        },
        "node_modules/select": {
        "version": "1.1.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/select/-/select-1.1.2.tgz",
        "integrity": "sha1-DnNQrN7ICxEIUoeG7B1EGNEbOW0="
        },
        "node_modules/sortablejs": {
        "version": "1.15.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/sortablejs/-/sortablejs-1.15.1.tgz",
        "integrity": "sha512-P5Cjvb0UG1ZVNiDPj/n4V+DinttXG6K8n7vM/HQf0C25K3YKQTQY6fsr/sEGsJGpQ9exmPxluHxKBc0mLKU1lQ=="
        },
        "node_modules/source-map-js": {
        "version": "1.0.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/source-map-js/-/source-map-js-1.0.2.tgz",
        "integrity": "sha512-R0XvVJ9WusLiqTCEiGCmICCMplcCkIwwR11mOSD9CR5u+IXYdiseeEuXCVAjS54zqwkLcPNnmU4OeJ6tUrWhDw==",
        "engines": {
            "node": ">=0.10.0"
        }
        },
        "node_modules/strip-literal": {
        "version": "1.3.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/strip-literal/-/strip-literal-1.3.0.tgz",
        "integrity": "sha512-PugKzOsyXpArk0yWmUwqOZecSO0GH0bPoctLcqNDH9J04pVW3lflYE0ujElBGTloevcxF5MofAOZ7C5l2b+wLg==",
        "dependencies": {
            "acorn": "^8.10.0"
        },
        "funding": {
            "url": "https://github.com/sponsors/antfu"
        }
        },
        "node_modules/supports-preserve-symlinks-flag": {
        "version": "1.0.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
        "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
        "engines": {
            "node": ">= 0.4"
        },
        "funding": {
            "url": "https://github.com/sponsors/ljharb"
        }
        },
        "node_modules/tdesign-icons-vue-next": {
        "version": "0.2.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/tdesign-icons-vue-next/-/tdesign-icons-vue-next-0.2.2.tgz",
        "integrity": "sha512-ZKleBME7ZF1IVgnRXmIBPjfNa2Mef1nrK56f2xwn1Aa5mvXxB3fSxEzwhObR7bhzf/K42mz/Knnbll5Y7vCBjg==",
        "dependencies": {
            "@babel/runtime": "^7.16.3"
        },
        "peerDependencies": {
            "vue": "^3.0.0"
        }
        },
        "node_modules/tdesign-vue-next": {
        "version": "1.7.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/tdesign-vue-next/-/tdesign-vue-next-1.7.1.tgz",
        "integrity": "sha512-zPfzkgul4zAltUt3OJIzItZkhBxYT7kc5uoW/pGRvlcKwqOj4v+LdgAU9UfYztgKVyrwLQVc82KRaM+4y2nlYg==",
        "dependencies": {
            "@babel/runtime": "^7.22.6",
            "@popperjs/core": "^2.11.8",
            "@types/lodash": "4.14.182",
            "@types/sortablejs": "^1.15.1",
            "@types/tinycolor2": "^1.4.3",
            "@types/validator": "^13.7.17",
            "dayjs": "^1.11.9",
            "lodash": "^4.17.21",
            "mitt": "^3.0.1",
            "sortablejs": "^1.15.0",
            "tdesign-icons-vue-next": "^0.2.0",
            "tinycolor2": "^1.6.0",
            "validator": "^13.9.0"
        },
        "peerDependencies": {
            "vue": ">=3.1.0"
        }
        },
        "node_modules/tiny-emitter": {
        "version": "2.1.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/tiny-emitter/-/tiny-emitter-2.1.0.tgz",
        "integrity": "sha512-NB6Dk1A9xgQPMoGqC5CVXn123gWyte215ONT5Pp5a0yt4nlEoO1ZWeCwpncaekPHXO60i47ihFnZPiRPjRMq4Q=="
        },
        "node_modules/tinycolor2": {
        "version": "1.6.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/tinycolor2/-/tinycolor2-1.6.0.tgz",
        "integrity": "sha512-XPaBkWQJdsf3pLKJV9p4qN/S+fm2Oj8AIPo1BTUhg5oxkvm9+SVEGFdhyOz7tTdUTfvxMiAs4sp6/eZO2Ew+pw=="
        },
        "node_modules/to-regex-range": {
        "version": "5.0.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/to-regex-range/-/to-regex-range-5.0.1.tgz",
        "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
        "dependencies": {
            "is-number": "^7.0.0"
        },
        "engines": {
            "node": ">=8.0"
        }
        },
        "node_modules/tslib": {
        "version": "2.3.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/tslib/-/tslib-2.3.0.tgz",
        "integrity": "sha512-N82ooyxVNm6h1riLCoyS9e3fuJ3AMG2zIZs2Gd1ATcSFjSA23Q0fzjjZeh0jbJvWVDZ0cJT8yaNNaaXHzueNjg=="
        },
        "node_modules/ufo": {
        "version": "1.3.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/ufo/-/ufo-1.3.2.tgz",
        "integrity": "sha512-o+ORpgGwaYQXgqGDwd+hkS4PuZ3QnmqMMxRuajK/a38L6fTpcE5GPIfrf+L/KemFzfUpeUQc1rRS1iDBozvnFA=="
        },
        "node_modules/unimport": {
        "version": "3.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/unimport/-/unimport-3.6.1.tgz",
        "integrity": "sha512-zKzbp8AQ+l8QK3XrONtUBdgBbMI8TkGh8hBYF77ZkVqMLLIAHwGSwJRFolPQMBx/5pezeRKvmu2gzlqnxRZeqQ==",
        "dependencies": {
            "@rollup/pluginutils": "^5.1.0",
            "escape-string-regexp": "^5.0.0",
            "fast-glob": "^3.3.2",
            "local-pkg": "^0.5.0",
            "magic-string": "^0.30.5",
            "mlly": "^1.4.2",
            "pathe": "^1.1.1",
            "pkg-types": "^1.0.3",
            "scule": "^1.1.1",
            "strip-literal": "^1.3.0",
            "unplugin": "^1.5.1"
        }
        },
        "node_modules/unplugin": {
        "version": "1.5.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/unplugin/-/unplugin-1.5.1.tgz",
        "integrity": "sha512-0QkvG13z6RD+1L1FoibQqnvTwVBXvS4XSPwAyinVgoOCl2jAgwzdUKmEj05o4Lt8xwQI85Hb6mSyYkcAGwZPew==",
        "dependencies": {
            "acorn": "^8.11.2",
            "chokidar": "^3.5.3",
            "webpack-sources": "^3.2.3",
            "webpack-virtual-modules": "^0.6.0"
        }
        },
        "node_modules/unplugin-auto-import": {
        "version": "0.17.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/unplugin-auto-import/-/unplugin-auto-import-0.17.2.tgz",
        "integrity": "sha512-Eu/xWI6SH4jTWXvzOfXQWAxRtiz/gMObm7wXtgMj7wBjHQKLgHTmHd4R4oha87KYGah1aKMqiqDeAxiPmfSoTg==",
        "dependencies": {
            "@antfu/utils": "^0.7.6",
            "@rollup/pluginutils": "^5.1.0",
            "fast-glob": "^3.3.2",
            "local-pkg": "^0.5.0",
            "magic-string": "^0.30.5",
            "minimatch": "^9.0.3",
            "unimport": "^3.6.0",
            "unplugin": "^1.5.1"
        },
        "engines": {
            "node": ">=14"
        },
        "funding": {
            "url": "https://github.com/sponsors/antfu"
        },
        "peerDependencies": {
            "@nuxt/kit": "^3.2.2",
            "@vueuse/core": "*"
        },
        "peerDependenciesMeta": {
            "@nuxt/kit": {
            "optional": true
            },
            "@vueuse/core": {
            "optional": true
            }
        }
        },
        "node_modules/unplugin-vue-components": {
        "version": "0.25.2",
        "resolved": "https://mirrors.cloud.tencent.com/npm/unplugin-vue-components/-/unplugin-vue-components-0.25.2.tgz",
        "integrity": "sha512-OVmLFqILH6w+eM8fyt/d/eoJT9A6WO51NZLf1vC5c1FZ4rmq2bbGxTy8WP2Jm7xwFdukaIdv819+UI7RClPyCA==",
        "dependencies": {
            "@antfu/utils": "^0.7.5",
            "@rollup/pluginutils": "^5.0.2",
            "chokidar": "^3.5.3",
            "debug": "^4.3.4",
            "fast-glob": "^3.3.0",
            "local-pkg": "^0.4.3",
            "magic-string": "^0.30.1",
            "minimatch": "^9.0.3",
            "resolve": "^1.22.2",
            "unplugin": "^1.4.0"
        },
        "engines": {
            "node": ">=14"
        },
        "funding": {
            "url": "https://github.com/sponsors/antfu"
        },
        "peerDependencies": {
            "@babel/parser": "^7.15.8",
            "@nuxt/kit": "^3.2.2",
            "vue": "2 || 3"
        },
        "peerDependenciesMeta": {
            "@babel/parser": {
            "optional": true
            },
            "@nuxt/kit": {
            "optional": true
            }
        }
        },
        "node_modules/unplugin-vue-components/node_modules/local-pkg": {
        "version": "0.4.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/local-pkg/-/local-pkg-0.4.3.tgz",
        "integrity": "sha512-SFppqq5p42fe2qcZQqqEOiVRXl+WCP1MdT6k7BDEW1j++sp5fIY+/fdRQitvKgB5BrBcmrs5m/L0v2FrU5MY1g==",
        "engines": {
            "node": ">=14"
        },
        "funding": {
            "url": "https://github.com/sponsors/antfu"
        }
        },
        "node_modules/validator": {
        "version": "13.11.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/validator/-/validator-13.11.0.tgz",
        "integrity": "sha512-Ii+sehpSfZy+At5nPdnyMhx78fEoPDkR2XW/zimHEL3MyGJQOCQ7WeP20jPYRz7ZCpcKLB21NxuXHF3bxjStBQ==",
        "engines": {
            "node": ">= 0.10"
        }
        },
        "node_modules/vite": {
        "version": "5.0.6",
        "resolved": "https://mirrors.cloud.tencent.com/npm/vite/-/vite-5.0.6.tgz",
        "integrity": "sha512-MD3joyAEBtV7QZPl2JVVUai6zHms3YOmLR+BpMzLlX2Yzjfcc4gTgNi09d/Rua3F4EtC8zdwPU8eQYyib4vVMQ==",
        "dev": true,
        "dependencies": {
            "esbuild": "^0.19.3",
            "postcss": "^8.4.32",
            "rollup": "^4.2.0"
        },
        "bin": {
            "vite": "bin/vite.js"
        },
        "engines": {
            "node": "^18.0.0 || >=20.0.0"
        },
        "funding": {
            "url": "https://github.com/vitejs/vite?sponsor=1"
        },
        "optionalDependencies": {
            "fsevents": "~2.3.3"
        },
        "peerDependencies": {
            "@types/node": "^18.0.0 || >=20.0.0",
            "less": "*",
            "lightningcss": "^1.21.0",
            "sass": "*",
            "stylus": "*",
            "sugarss": "*",
            "terser": "^5.4.0"
        },
        "peerDependenciesMeta": {
            "@types/node": {
            "optional": true
            },
            "less": {
            "optional": true
            },
            "lightningcss": {
            "optional": true
            },
            "sass": {
            "optional": true
            },
            "stylus": {
            "optional": true
            },
            "sugarss": {
            "optional": true
            },
            "terser": {
            "optional": true
            }
        }
        },
        "node_modules/vue": {
        "version": "3.3.10",
        "resolved": "https://mirrors.cloud.tencent.com/npm/vue/-/vue-3.3.10.tgz",
        "integrity": "sha512-zg6SIXZdTBwiqCw/1p+m04VyHjLfwtjwz8N57sPaBhEex31ND0RYECVOC1YrRwMRmxFf5T1dabl6SGUbMKKuVw==",
        "dependencies": {
            "@vue/compiler-dom": "3.3.10",
            "@vue/compiler-sfc": "3.3.10",
            "@vue/runtime-dom": "3.3.10",
            "@vue/server-renderer": "3.3.10",
            "@vue/shared": "3.3.10"
        },
        "peerDependencies": {
            "typescript": "*"
        },
        "peerDependenciesMeta": {
            "typescript": {
            "optional": true
            }
        }
        },
        "node_modules/vue-clipboard3": {
        "version": "2.0.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/vue-clipboard3/-/vue-clipboard3-2.0.0.tgz",
        "integrity": "sha512-Q9S7dzWGax7LN5iiSPcu/K1GGm2gcBBlYwmMsUc5/16N6w90cbKow3FnPmPs95sungns4yvd9/+JhbAznECS2A==",
        "dependencies": {
            "clipboard": "^2.0.6"
        }
        },
        "node_modules/vue-picture-cropper": {
        "version": "0.7.0",
        "resolved": "https://mirrors.cloud.tencent.com/npm/vue-picture-cropper/-/vue-picture-cropper-0.7.0.tgz",
        "integrity": "sha512-NF7+Dgso6d0GB16E5d/BbrcTIHm1VWz8dS3IjLhoBl+ZeC+yDA46CyJphQuO32SisaPmrKHN8VbiE2LgAfhnkQ==",
        "dependencies": {
            "@bassist/utils": "^0.4.0",
            "cropperjs": "^1.6.1"
        },
        "peerDependencies": {
            "vue": ">=3.2.13"
        }
        },
        "node_modules/vue-router": {
        "version": "4.2.5",
        "resolved": "https://mirrors.cloud.tencent.com/npm/vue-router/-/vue-router-4.2.5.tgz",
        "integrity": "sha512-DIUpKcyg4+PTQKfFPX88UWhlagBEBEfJ5A8XDXRJLUnZOvcpMF8o/dnL90vpVkGaPbjvXazV/rC1qBKrZlFugw==",
        "dependencies": {
            "@vue/devtools-api": "^6.5.0"
        },
        "funding": {
            "url": "https://github.com/sponsors/posva"
        },
        "peerDependencies": {
            "vue": "^3.2.0"
        }
        },
        "node_modules/webpack-sources": {
        "version": "3.2.3",
        "resolved": "https://mirrors.cloud.tencent.com/npm/webpack-sources/-/webpack-sources-3.2.3.tgz",
        "integrity": "sha512-/DyMEOrDgLKKIG0fmvtz+4dUX/3Ghozwgm6iPp8KRhvn+eQf9+Q7GWxVNMk3+uCPWfdXYC4ExGBckIXdFEfH1w==",
        "engines": {
            "node": ">=10.13.0"
        }
        },
        "node_modules/webpack-virtual-modules": {
        "version": "0.6.1",
        "resolved": "https://mirrors.cloud.tencent.com/npm/webpack-virtual-modules/-/webpack-virtual-modules-0.6.1.tgz",
        "integrity": "sha512-poXpCylU7ExuvZK8z+On3kX+S8o/2dQ/SVYueKA0D4WEMXROXgY8Ez50/bQEUmvoSMMrWcrJqCHuhAbsiwg7Dg=="
        },
        "node_modules/zrender": {
        "version": "5.4.4",
        "resolved": "https://mirrors.cloud.tencent.com/npm/zrender/-/zrender-5.4.4.tgz",
        "integrity": "sha512-0VxCNJ7AGOMCWeHVyTrGzUgrK4asT4ml9PEkeGirAkKNYXYzoPJCLvmyfdoOXcjTHPs10OZVMfD1Rwg16AZyYw==",
        "dependencies": {
            "tslib": "2.3.0"
        }
        }
    }
    }
    `
    },
    {
        js: `import { defineConfig } from 'vite'
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
})`
    },
    {
        html: `<!doctype html>
<html lang="zh">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/bmp" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>数据整理汇总与分析-银泰喵街-万寻</title>
    </head>
    <body>
    <div id="app"></div>
        <script type="module" src="/src/main.js"></script>
    </body>
</html>`
    },
    {
        js: `export default reactive({
    status: 'unlog', // unlog | loged | verify
    inform: false,
    logout: () => {
        localStorage.removeItem('access_token')
        location.href = location.origin + '/login'
    }
})`
    }
]