const shop = reactive({
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
        },
        {
            label: '零号店',
            value: 'YT01'
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
        },
        {
            label: '卡莎米亚',
            value: '卡莎米亚',
            logo: 'https://cdn.fixeam.com/tw/CASAMIA.png'
        },
        {
            label: "查尔斯桃心(CHARLES JANG'S HAPPY HEART) 113073",
            value: '查尔斯桃心',
            logo: 'https://cdn.fixeam.com/tw/%E6%9F%A5%E5%B0%94%E6%96%AF%E6%A1%83%E5%BF%83.png'
        }
    ],
    counter: {
        'HZ13KCOR': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000053629&spm=a320s.12912863.0.0',
        'HZ13兔皇': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000065204&spm=a320s.12912863.0.0',
        'HZ13NT': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000055164&spm=a320s.12912863.0.0',
        'HZ20DR': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000064613&spm=a320s.12912863.0.0',
        'HZ20KCOR': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000064613&spm=a320s.12912863.0.0',
        '132KCOR': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000061335&spm=a320s.12912863.0.0',
        '132兔皇': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000061335&spm=a320s.12912863.0.0',
        '132NT': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=1000000061604&spm=a320s.12912863.0.0',
        'YT01查尔斯桃心': 'https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=store-poi&wh_weex=true&wx_navbar_hidden=true&shopId=[专柜号ID]&spm=a320s.12912863.0.0'
    }
})

export default shop