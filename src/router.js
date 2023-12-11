import { createRouter, createWebHistory }from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('./Pages/Login/index.vue'),
        meta: {
            title: "login",
            key: '0',
            keepAlive: false,
            menuShow: false
        }
    },
    {
        path: '/',
        name: 'home',
        component: () => import('./Pages/Home/index.vue'),
        meta: {
            title: "home",
            icon: 'home',
            avatar: 'https://cdn.fixeam.com/tw/colorful/home.png',
            key: '1',
            keepAlive: true,
            menuShow: true
        }
    },
    {
        path: '/goods',
        name: 'goods',
        component: () => import('./Pages/Goods/index.vue'),
        meta: {
            title: "goods",
            icon: 'shop',
            avatar: 'https://cdn.fixeam.com/tw/colorful/shopping.png',
            key: '2',
            keepAlive: true,
            menuShow: true
        }
    },
    {
        path: '/datas',
        name: 'datas',
        component: () => import('./Pages/Data/index.vue'),
        redirect: '/datas/summary',
        meta: {
            title: "data",
            icon: 'chart',
            avatar: 'https://cdn.fixeam.com/tw/colorful/data.png',
            key: '3',
            keepAlive: true,
            menuShow: true
        },
        children: [
            {
                path: '/datas/summary',
                name: 'datas-summary',
                component: () => import('./Pages/Data/Summary/index.vue'),
                meta: {
                    title: "data1",
                    icon: 'table',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/collection.png',
                    key: '3-1',
                    keepAlive: true
                }
            },
            {
                path: '/datas/analysis',
                name: 'datas-analysis',
                component: () => import('./Pages/Data/Analysis/index.vue'),
                meta: {
                    title: "data2",
                    icon: 'chart-bubble',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/economy.png',
                    key: '3-2',
                    keepAlive: true
                }
            },
            {
                path: '/datas/item',
                name: 'datas-item',
                component: () => import('./Pages/Data/Item/index.vue'),
                meta: {
                    title: "data3",
                    icon: 'chart-colum',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/bar_chart.png',
                    key: '3-3',
                    keepAlive: true
                }
            },
            {
                path: '/datas/category',
                name: 'datas-category',
                component: () => import('./Pages/Data/Category/index.vue'),
                meta: {
                    title: "data4",
                    icon: 'chart-ring',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/report_forms.png',
                    key: '3-4',
                    keepAlive: true
                }
            },
            {
                path: '/datas/operational',
                name: 'datas-operational',
                component: () => import('./Pages/Data/Operational/index.vue'),
                meta: {
                    title: "data5",
                    icon: 'calculation',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/business.png',
                    key: '3-5',
                    keepAlive: true
                }
            },
            {
                path: '/data/analysis-view',
                name: 'datas-analysis-view',
                component: () => import('./Pages/Data/Analysis/View/index.vue'),
                meta: {
                    title: "data2",
                    icon: 'chart-bubble',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/economy.png',
                    key: '3-2-1',
                    keepAlive: false,
                    hide: true
                }
            }
        ]
    },
    {
        path: '/import',
        name: 'import',
        component: () => import('./Pages/Import/index.vue'),
        meta: {
            title: 'import',
            icon: 'upload',
            avatar: 'https://cdn.fixeam.com/tw/colorful/import.png',
            key: '4',
            keepAlive: true,
            menuShow: true
        }
    },
    {
        path: '/open-source',
        name: 'open-source',
        component: () => import('./Pages/Source/index.vue'),
        redirect: '/open-source/Appvue',
        meta: {
            title: 'openSource',
            icon: 'code',
            avatar: 'https://cdn.fixeam.com/tw/colorful/code.png',
            key: '5',
            keepAlive: true,
            menuShow: true,
            hideChild: true
        },
        children: [
            {
                path: '/open-source/Appvue',
                name: 'Appvue',
                component: () => import('./Pages/Source/document/index.vue'),
                meta: {
                    title: 'entryFile',
                    icon: 'code',
                    key: '6-1-1',
                    keepAlive: true,
                    hide: true,
                    idx: 0
                }
            },
            {
                path: '/open-source/mainjs',
                name: 'mainjs',
                component: () => import('./Pages/Source/document/index.vue'),
                meta: {
                    title: 'entryScript',
                    icon: 'code',
                    key: '6-1-2',
                    keepAlive: true,
                    hide: true,
                    idx: 1
                }
            },
            {
                path: '/open-source/stylecss',
                name: 'stylecss',
                component: () => import('./Pages/Source/document/index.vue'),
                meta: {
                    title: 'mainStyleFile',
                    icon: 'code',
                    key: '6-1-3',
                    keepAlive: true,
                    hide: true,
                    idx: 2
                }
            },
            {
                path: '/open-source/packagejson',
                name: 'packagejson',
                component: () => import('./Pages/Source/document/index.vue'),
                meta: {
                    title: 'packageConfig',
                    icon: 'code',
                    key: '6-1-4',
                    keepAlive: true,
                    hide: true,
                    idx: 3
                }
            },
            {
                path: '/open-source/package-lockjson',
                name: 'package-lockjson',
                component: () => import('./Pages/Source/document/index.vue'),
                meta: {
                    title: 'packageLockConfig',
                    icon: 'code',
                    key: '6-1-8',
                    keepAlive: true,
                    hide: true,
                    idx: 4
                }
            },
            {
                path: '/open-source/viteconfigjs',
                name: 'viteconfigjs',
                component: () => import('./Pages/Source/document/index.vue'),
                meta: {
                    title: 'viteConfig',
                    icon: 'code',
                    key: '6-1-5',
                    keepAlive: true,
                    hide: true,
                    idx: 5
                }
            },
            {
                path: '/open-source/indexhtml',
                name: 'indexhtml',
                component: () => import('./Pages/Source/document/index.vue'),
                meta: {
                    title: 'indexHtmlFile',
                    icon: 'code',
                    key: '6-1-6',
                    keepAlive: true,
                    hide: true,
                    idx: 6
                }
            },
            {
                path: '/open-source/userjs',
                name: 'userjs',
                component: () => import('./Pages/Source/document/index.vue'),
                meta: {
                    title: 'userConrtrolFile',
                    icon: 'code',
                    key: '6-1-7',
                    keepAlive: true,
                    hide: true,
                    idx: 7
                }
            }
        ]
    },
    {
        path: '/user-center',
        name: 'user-center',
        component: () => import('./Pages/UserCenter/index.vue'),
        meta: {
            title: 'userCenter',
            icon: 'verify',
            avatar: 'https://cdn.fixeam.com/tw/colorful/user.png',
            key: '6',
            keepAlive: true,
            menuShow: true
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