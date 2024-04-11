<template>
    <t-config-provider :global-config="globalConfig">
        <router-view v-if="frameLessPage.indexOf($route.name) >= 0"/>
        <div v-if="frameLessPage.indexOf($route.name) < 0">
            <header-component />
            <t-breadcrumb max-item-width="150" style="margin: 10px 0 0 20px;" v-if="$route.name !== 'NotFound'">
                <t-breadcrumbItem
                v-if="homeRoute"
                :to="homeRoute['path']"
                >
                    <template #icon>
                        <t-icon :name="homeRoute['meta'].icon" />
                    </template>
                    {{ getString(homeRoute['meta'].title) }}
                </t-breadcrumbItem>
                <t-breadcrumbItem
                v-for="item in $route.matched"
                :key="item.meta.key"
                :to="item.path"
                >
                    <template #icon>
                        <t-icon :name="item.meta.icon" />
                    </template>
                    {{ getString(item.meta.title) }}
                </t-breadcrumbItem>
            </t-breadcrumb>
            <router-view v-slot="{ Component }" v-if="showPage">
                <keep-alive>
                    <component :is="Component" :key="$route.meta.key" v-if="$route.meta.keepAlive"/>
                </keep-alive>
                <component :is="Component" :key="$route.meta.key" v-if="!$route.meta.keepAlive"/>
            </router-view>
        </div>
        <update-info />
    </t-config-provider>
</template>

<script setup>
import UpdateInfo from './components/UpdateInfo.vue'
import headerComponent from './components/header.vue'
import merge from 'lodash/merge'
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN'
import chtConfig from 'tdesign-vue-next/es/locale/zh_TW'
import enConfig from 'tdesign-vue-next/es/locale/en_US'
import korConfig from 'tdesign-vue-next/es/locale/ko_KR'
import jpConfig from 'tdesign-vue-next/es/locale/ja_JP'
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next"
import service from "./api/service.js"
import {getString} from "./i18n/index.js"
import {useRoute, useRouter} from "vue-router"
import {getAllBrand, getAllStore} from "./api/shop.js";
import {tips} from "./hooks/tips.js";
import {getToken} from "./hooks/user.js";

const i18n = inject('i18n')
const user = inject('user')
const shop = inject('shop')
const router = useRouter()
const homeRoute = ref(false)
const showPage = ref(false)
const routes = router.getRoutes()
for (let i = 0; i < routes.length; i++) {
    if(routes[i].path === '/'){
        homeRoute.value = routes[i]
    }
}

const getShopOption = async () => {
    let storeResponse = await getAllStore()
    if(!storeResponse.result){
        tips('门店信息获取失败：' + storeResponse.error.message, 'error')
    } else {
        for (let i = 0; i < storeResponse.content.length;i++){
            storeResponse.content[i].value = storeResponse.content[i].id
            storeResponse.content[i].label = storeResponse.content[i].name
        }
        shop.storeOptions = storeResponse.content
        shop.store = shop.storeOptions[0].value
    }

    let brandResponse = await getAllBrand()
    if(!brandResponse.result){
        tips('品牌信息获取失败：' + brandResponse.error.message, 'error')
    } else {
        for (let i = 0; i < brandResponse.content.length;i++){
            brandResponse.content[i].value = brandResponse.content[i].keyword
            brandResponse.content[i].label = brandResponse.content[i].name + ' ' + brandResponse.content[i].id
        }
        shop.brandOptions = brandResponse.content
        shop.brand = shop.brandOptions[0].value
    }
}


const initSet = () => {
    if(localStorage.getItem('lang')){
        i18n.language = localStorage.getItem('lang') === 'th' ? 'en' : localStorage.getItem('lang')
        document.documentElement.lang = i18n.languages
    }
    if(localStorage.getItem('language')){
        i18n.language = localStorage.getItem('language') === 'th' ? 'en' : localStorage.getItem('language')
        document.documentElement.lang = i18n.language
    }
    initLangConfig(i18n.language)
    if(localStorage.getItem('user')){
        user.inform = JSON.stringify(localStorage.getItem('user'))
    }
}
const loginVerify = async () => {
    user.status = 'verify'

    let token = localStorage.getItem('access_token')
    if(!token){
        router.replace('/login')
        return
    }

    let res = await service.api.user.inform(token)
    if(res.result){
        user.inform = res.content.user
        user.status = 'loged'
        localStorage.setItem('user', JSON.stringify(user.inform))
        MessagePlugin.success(getString('welcomeBack') + '！' + user.inform['realname'])

        user.inform.setting = JSON.parse(user.inform.setting) ?? {}
        let set = user.inform.setting
        if(set.store){
            shop.store = set.store
            localStorage.setItem('store', set.store)
        }
        if(set.brand){
            shop.brand = set.brand
            localStorage.setItem('brand', set.brand)
        }
        if(set.language){
            i18n.language = set.language
            localStorage.setItem('language', set.language)
        }

        showPage.value = true
    } else {
        MessagePlugin.info(getString('loginFailure'))
        user.status = 'unlog'
        router.replace('/login')
    }
}

const route = useRoute()
const historyRecord = () => {
    if(route.name === 'NotFound' || route.path === '/login' || route.path === '/' || route.path === '/data/analysis-view'){
        return
    }
    let history = JSON.parse(localStorage.getItem('history')) || {
        menus: [],
        goods: []
    }

    for (let i = history.menus.length - 1; i >= 0; i--) {
        if(history.menus[i].path === route.path){
            history.menus.splice(i, 1)
            history.menus.unshift(route)
            localStorage.setItem('history', JSON.stringify(history))
            return
        }
        if(history.menus[i].name === 'NotFound'){
            history.menus.splice(i, 1)
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
const queryVersion = () => {
    return new Promise((resolve, reject) => {
        fetch(`version?ver=${ (new Date()).getTime() }`)
            .then(response => {
                resolve(response.text())
            })
            .catch(error => {
                console.error(error)
                reject(error)
            })
    })
}

let timer
const checkForUpdate = async () => {
    const application = document.querySelector('#app')
    const runningVersion = parseInt(application.dataset.version)
    let newVersion = await queryVersion()

    if(typeof newVersion == 'string' && /^\d+$/.test(newVersion)){
        newVersion = parseInt(newVersion)

        if(newVersion > runningVersion){
            clearInterval(timer)
            timer = null

            DialogPlugin.confirm({
                header: '页面更新',
                body: '当前页面存在更新版本, 是否立即刷新以获取最新内容?',
                onConfirm: () => {
                    location.reload()
                }
            })
        }
    }
}

onMounted(async () => {
    await getShopOption()
    await loginVerify()

    i18n.checkEmpty()
    setTimeout(() => {
        historyRecord()

        timer = setInterval(() => {
            checkForUpdate()
        }, 3000)
    }, 1000)
})
</script>

<style>

</style>