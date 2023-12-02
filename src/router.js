import { createRouter, createWebHistory }from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('./Pages/Login/index.vue'),
        meta: {
            title: {
                zh: '登录',
                en: 'Login',
                kor: '로그인',
                jp: 'ログイン＃ログイン＃',
                th: 'เข้าสู่ระบบ'
            },
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
            title: {
                zh: '首页',
                en: 'Home',
                kor: '홈',
                jp: 'ホーム',
                th: 'หน้าหน้า'
            },
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
            title: {
                zh: '商品', 
                en: 'Goods',
                kor: '상품',
                jp: '商品',
                th: 'สินค้า'
            },
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
            title: {
                zh: '数据', 
                en: 'Datas',
                kor: '데이터',
                jp: 'データ',
                th: 'ข้อมูล'
            },
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
                    title: {
                        zh: '数据汇总报表', 
                        en: 'Data Summary Report',
                        kor: '데이터 요약 보고서',
                        jp: 'データ要約レポート',
                        th: 'รายการ'
                    },
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
                    title: {
                        zh: '数据分析', 
                        en: 'Data Analysis',
                        kor: '데이터 분석',
                        jp: 'データ解析',
                        th: 'การตั้ง'
                    },
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
                    title: {
                        zh: '单品分析', 
                        en: 'Item Analysis',
                        kor: '단품 분석',
                        jp: '単品分析',
                        th: 'สินค้า'
                    },
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
                    title: {
                        zh: '品类分析', 
                        en: 'Category Analysis',
                        kor: '품목 분석',
                        jp: 'クラス分析',
                        th: 'การนำ'
                    },
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
                    title: {
                        zh: '经营分析', 
                        en: 'Operational Analysis',
                        kor: '영업 분석',
                        jp: '経営分析',
                        th: 'การนำ'
                    },
                    icon: 'calculation',
                    avatar: 'https://cdn.fixeam.com/tw/colorful/business.png',
                    key: '3-5',
                    keepAlive: true
                }
            }
        ]
    },
    {
        path: '/import',
        name: 'import',
        component: () => import('./Pages/Import/index.vue'),
        meta: {
            title: {
                zh: '数据导入', 
                en: 'Data Import',
                kor: '데이터 입력',
                jp: 'データインポート',
                th: 'การเข้า'
            },
            icon: 'upload',
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
            title: {
                zh: '个人中心', 
                en: 'User Center',
                kor: '사용자 센터',
                jp: 'パーソナルセンター',
                th: 'การตั้ง'
            },
            icon: 'verify',
            avatar: 'https://cdn.fixeam.com/tw/colorful/user.png',
            key: '5',
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