<template>
    <t-config-provider :global-config="globalConfig">
        <splash v-if="loading" />
        <router-view v-if="!loading && frameLessPage.indexOf($route.name) >= 0"/>
        <div v-if="!loading && frameLessPage.indexOf($route.name) < 0">
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
    </t-config-provider>
</template>

<script setup>
import headerComponent from './components/header.vue'
import merge from 'lodash/merge'
import zhConfig from 'tdesign-vue-next/es/locale/zh_CN'
import chtConfig from 'tdesign-vue-next/es/locale/zh_TW'
import enConfig from 'tdesign-vue-next/es/locale/en_US'
import korConfig from 'tdesign-vue-next/es/locale/ko_KR'
import jpConfig from 'tdesign-vue-next/es/locale/ja_JP'
import { DialogPlugin, MessagePlugin } from "tdesign-vue-next"
import { getString } from "./i18n/index.js"
import { useRoute, useRouter } from "vue-router"
import { tips } from "./hooks/tips.js"
import {apiKey, request} from "./api/request.js"
import Splash from "./Pages/splash.vue"

const i18n = inject('i18n')
const user = inject('user')
const shop = inject('shop')
const route = useRoute()
const router = useRouter()
const homeRoute = ref(false)
const showPage = ref(false)
const loading = ref(true)
const routes = router.getRoutes()
for (let i = 0; i < routes.length; i++) {
    if(routes[i].path === '/'){
        homeRoute.value = routes[i]
    }
}

const getShopOption = async () => {
    let storeResponse = await request('/shop/store')
    if(storeResponse.status !== 'success'){
        tips(storeResponse.error.msg, 'error')
    } else {
        shop.storeOptions = storeResponse.content
    }
    let brandResponse = await request('/shop/brand')
    if(brandResponse.status !== 'success'){
        tips(brandResponse.error.msg, 'error')
    } else {
        shop.brandOptions = brandResponse.content
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
}
const loginVerify = async () => {
    user.status = 'verify'

    let routeToken = route.query.access_token
    if(routeToken) {
        let response = await request("/user/login/token", {
            accessToken: routeToken
        }, 'POST')
        if(response.status === 'success'){
            await MessagePlugin.success(getString('loged'))
        } else {
            tips(response.error.msg, 'error')
        }
    }

    let res = await request('/user/inform')
    if(res.status === 'success'){
        user.inform = res.content
        user.status = 'loged'

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
        user.status = 'unlog'
        await router.replace('/login')
        await MessagePlugin.info(getString('loginFailure'))
    }
}

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
        fetch(`index.html?ver=${ (new Date()).getTime() }`)
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
    const runningVersion = parseFloat(application.dataset.version)

    let html = await queryVersion()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    let webApplication = doc.querySelector('#app')
    let newVersion = parseFloat(webApplication.dataset.version)

    if(newVersion > runningVersion){
        clearInterval(timer)
        timer = null

        DialogPlugin.confirm({
            header: getString('pageUpgrade'),
            body: getString('pageUpgradeConfirm'),
            confirmBtn: getString('confirm'),
            cancelBtn: getString('close'),
            onConfirm: () => {
                location.reload()
            }
        })
    }
}

onMounted(async () => {
    let load = await MessagePlugin.loading('正在获取门店和品牌信息', 0)
    await apiKey()
    await getShopOption()
    load.close()
    load = await MessagePlugin.loading('正在验证用户信息', 0)
    await loginVerify()
    load.close()
    loading.value = false
    if (user.status === 'loged') await MessagePlugin.success(getString('welcomeBack') + '！' + user.inform['realName'])

    i18n.checkEmpty()
    if (import.meta.env.DEV) return
    setTimeout(() => {
        timer = setInterval(() => {
            checkForUpdate()
        }, 3000)
    }, 1000)
})
</script>

<style>

</style>