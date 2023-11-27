import { createRouter, createWebHistory }from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('./Pages/Login/index.vue'),
        meta: {
            title: {
                zh: '登录',
                en: 'Login'
            },
            key: '0',
            keepAlive: false
        }
    },
    {
        path: '/',
        name: 'home',
        component: () => import('./Pages/Home/index.vue'),
        meta: {
            title: {
                zh: '首页',
                en: 'Home'
            },
            icon: 'home',
            avatar: 'https://cdn.fixeam.com/tw/colorful/home.png',
            key: '1',
            keepAlive: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from) => {
    // 路由守卫
})

export default router