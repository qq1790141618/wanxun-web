<template>
    <t-config-provider :global-config="globalConfig">
        <router-view v-if="$route.name === 'login'"/>
        <div v-if="$route.name !== 'login'">
            <header-component />
            <t-breadcrumb max-item-width="150" style="margin: 10px 0 0 20px;">
                <t-breadcrumbItem
                :to="$router.getRoutes()[6].path"
                >
                    <template #icon>
                        <t-icon :name="$router.getRoutes()[6].meta.icon" />
                    </template>
                    {{ $router.getRoutes()[6].meta.title[local.name] }}
                </t-breadcrumbItem>
                <t-breadcrumbItem
                v-for="item in $route.matched"
                :key="item.meta.key"
                :to="item.path"
                >
                    <template #icon>
                        <t-icon :name="item.meta.icon" />
                    </template>
                    {{ item.meta.title[local.name] }}
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
import enConfig from 'tdesign-vue-next/es/locale/en_US'
import korConfig from 'tdesign-vue-next/es/locale/ko_KR'
import jpConfig from 'tdesign-vue-next/es/locale/ja_JP'

export default {
    components: {
        headerComponent
    },
    setup(){
        const local = inject('local')
        const serve = inject('serve')
        const user = inject('user')
        const shop = inject('shop')
        const router = useRouter()

        const initSet = () => {
            if(localStorage.getItem('lang')){
                local.name = localStorage.getItem('lang')
                document.documentElement.lang = local.name
            }
            initLangConfig(local.name)
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

                let message = {
                    zh: '欢迎回来！',
                    en: 'Welcome Back! ',
                    kor: '안녕하세요！',
                    jp: 'いらっしゃい！',
                    th: 'สวัสดี! '
                }
                MessagePlugin.success(message[local.name] + res.user.nickname)
            })
            .catch(() => {
                let message = {
                    zh: '用户未登录或登录已经失效',
                    en: 'User not logged in or login has expired',
                    kor: '사용자 로그인 하거나 로그인 만료',
                    jp: 'ユーザーが未登録か、登録が古いです',
                    th: 'ผู้ใช้ไม่ได้เข้าสู่ระบบไร่ หรือ เข้าระบบไม่เยอะ'
                }
                MessagePlugin.info(message[local.name])

                user.status = 'unlog'
                router.replace('/login')
            })
        }

        const route = useRoute()
        const historyRecord = () => {
            if(route.path == '/login' || route.path == '/'){
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

                case 'en':
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
        watch(() => local.name, (newValue) => {
            initLangConfig(newValue)
        })
        initSet()

        onMounted(() => {
            loginVerify()
            setTimeout(() => {
                historyRecord()
            }, 1000)
        })

        return {
            local,
            globalConfig
        }
    }
}
</script>

<style>

</style>