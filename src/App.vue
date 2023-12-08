<template>
    <t-config-provider :global-config="globalConfig">
        <router-view v-if="frameLessPage.indexOf($route.name) >= 0"/>
        <div v-if="frameLessPage.indexOf($route.name) < 0">
            <header-component />
            <t-breadcrumb max-item-width="150" style="margin: 10px 0 0 20px;">
                <t-breadcrumbItem
                :to="$router.getRoutes()[7].path"
                >
                    <template #icon>
                        <t-icon :name="$router.getRoutes()[7].meta.icon" />
                    </template>
                    {{ i18n[$router.getRoutes()[7].meta.title][i18n.language] }}
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
    </t-config-provider>
</template>

<script>
import { verifyUser } from './hooks'
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
            frameLessPage
        }
    }
}
</script>

<style>

</style>