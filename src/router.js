import { createRouter, createWebHistory }from 'vue-router'

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('./Pages/NotFound/index.vue'),
    },
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
                component: () => import('./Pages/Data/Analysis/current.vue'),
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
                path: '/datas/refunds',
                name: 'refunds-ana',
                component: () => import('./Pages/Data/Refund/index.vue'),
                meta: {
                    title: "refundReasonAnalysis",
                    icon: 'wealth',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/bar_chart.png',
                    key: '3-3-1',
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
        path: '/task',
        name: 'task',
        component: () => import('./Pages/Task/index.vue'),
        meta: {
            title: 'taskCenter',
            icon: 'task',
            avatar: 'https://cdn.fixeam.com/tw/colorful/import.png',
            key: '4',
            keepAlive: true,
            menuShow: true
        }
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
    },
    {
        path: '/manger',
        name: 'manger',
        component: () => import('./Pages/Manger/index.vue'),
        redirect: '/manger/user',
        meta: {
            title: 'manage',
            icon: 'user-setting',
            avatar: 'https://cdn.fixeam.com/tw/colorful/set-up-dot.png',
            key: '7',
            keepAlive: true,
            menuShow: true
        },
        children: [
            {
                path: '/manger/user',
                name: 'user-manage',
                component: () => import('./Pages/Manger/User/index.vue'),
                meta: {
                    title: "userManage",
                    icon: 'usergroup-add',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/data.png',
                    key: '7-1',
                    keepAlive: true
                }
            },
            {
                path: '/manger/user-group',
                name: 'user-group-manage',
                component: () => import('./Pages/Manger/UserGroup/index.vue'),
                meta: {
                    title: "userGroupMange",
                    icon: 'usergroup',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/data.png',
                    key: '7-2',
                    keepAlive: true
                }
            },
            // {
            //     path: '/manger/app',
            //     name: 'app-manager',
            //     component: () => import('./Pages/Manger/App/index.vue'),
            //     meta: {
            //         title: "appManage",
            //         icon: 'app',
            //         avatar: 'https://cdn.fixeam.com/tw/colorful/menu.png',
            //         key: '7-3',
            //         keepAlive: true
            //     }
            // },
            {
                path: '/manger/shop',
                name: 'shop-manager',
                component: () => import('./Pages/Manger/Shop/index.vue'),
                meta: {
                    title: "shopManage",
                    icon: 'store',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/factory.png',
                    key: '7-4',
                    keepAlive: true
                }
            },
        ]
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