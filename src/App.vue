<template>
    <router-view v-if="$route.name === 'login'"/>
    <div v-if="$route.name !== 'login'">
        <header-component />
        <router-view v-slot="{ Component }" >
            <keep-alive>
                <component :is="Component" :key="$route.meta.key" v-if="$route.meta.keepAlive"/>
            </keep-alive>
            <component :is="Component" :key="$route.meta.key" v-if="!$route.meta.keepAlive"/>
        </router-view>
    </div>
</template>

<script>
import { verifyUser } from './hooks/apis'
import headerComponent from './components/header.vue'

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
                    en: 'Welcome Back!',
                    kor: '안녕하세요',
                    jp: 'いらっしゃい',
                    th: 'สวัสดี'
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

        onMounted(() => {
            initSet()
            loginVerify()
        })
    }
}
</script>

<style>

</style>