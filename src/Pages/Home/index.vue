<template>
    <t-progress
    v-if="loading"
    class="home-progress"
    :percentage="percent"
    :label="i18n.loading[i18n.language] + ' ' + Math.ceil(percent) + '%'"
    />
    <t-row :gutter="[12, 12]" v-if="!loading" style="width: 100%; padding: 15px;">
        <t-col :span="12">
            <div style="padding: 0 10px; font-size: 15px;">
                {{ i18n.welcomeBack[i18n.language] }}！{{ data.famousWord }}
            </div>
        </t-col>
        <t-col :span="9">
            <FastView :data="data.day" />
            <RecentData :data="data.week" />
            <t-row :gutter="[12, 12]" style="margin-top: 12px;">
                <t-col
                :span="6"
                v-for="item in ['goods', 'supplier']"
                :key="item"
                >
                    <FastRankTable
                    :data="data[item]"
                    :title="i18n[item][i18n.language]"
                    :colKey="item == 'goods' ? 'stylenumber' : item"
                    />
                </t-col>
            </t-row>
        </t-col>
        <t-col :span="3">
            <FastLink />
            <StyleRecommed :data="data.ranks" />
        </t-col>
    </t-row>
</template>

<script>
import dayjs from 'dayjs'
import { translate } from '../../hooks'
import FastView from './FastView.vue'
import RecentData from './RecentData.vue'
import FastRankTable from './FastRankTable.vue'
import FastLink from './FastLink.vue'
import StyleRecommed from './StyleRecommed.vue'

export default {
    components: {
        FastView,
        RecentData,
        FastRankTable,
        FastLink,
        StyleRecommed
    },
    setup(){
        const loading = ref(true)
        const percent = ref(0)
        const serve = inject('serve')
        const shop = inject('shop')
        const i18n = inject('i18n')

        const data = ref({
            famousWord: '',
            day: {},
            week: [],
            goods: [],
            supplier: [],
            ranks: {
                kcor: [],
                nt: [],
                '兔皇': [],
                dr: []
            },
            year: {}
        })

        const famousWord = async () => {
            return fetch(serve + "/famous-word")
            .then((response) => {
                return Promise.resolve(response.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const daySales = async () => {
            return fetch(serve + '/analysis/sum?store-id=' + shop.store + '&brand=' + shop.brand + '&mode=日&time=' + dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const annualOverview = async () => {
            return fetch(serve + '/analysis/annual-overview?store-id=' + shop.store + '&brand=' + shop.brand)
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const goodsRanks = async () => {
            return fetch(serve + '/goods/mirros')
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }

        const initF = async () => {
            let f = await famousWord()
            data.value.famousWord = f.hitokoto + ' 来自《' + f.works + '》'
            if(f.author && f.author != undefined && f.author != null){
                data.value.famousWord += f.author
            }
            data.value.famousWord += '。'
            translate(data.value.famousWord, i18n.language)
            .then(res => {
                data.value.famousWord = res.trans_result[0].dst

                return Promise.resolve()
            })
        }
        const initData = async () => {
            loading.value = true

            await initF()
            percent.value = 25

            data.value.day = await daySales()
            for (const sum in data.value.day) {
                for (const key in data.value.day[sum]) {
                    if (data.value.day[sum][key] == null) {
                        data.value.day[sum][key] = 0
                    }
                }
            }
            percent.value = 50

            let ao = await annualOverview()
            data.value.year.income = ao.income
            data.value.year.ordersCount = ao.ordersCount
            data.value.year.salesCount = ao.salesCount
            data.value.year.productsCount = ao.productsCount
            data.value.week = ao.nearlyWeek
            data.value.supplier = ao.ms.supplier
            data.value.goods = ao.ms.product
            percent.value = 75

            let ranks = await goodsRanks()
            data.value.ranks = {
                KCOR: [],
                NT: [],
                '兔皇': [],
                DR: []
            }
            for (let i = 0; i < ranks.length; i++) {
                data.value.ranks[ranks[i].brand].push(ranks[i])
            }
            percent.value = 1

            loading.value = false
        }

        onMounted(() => {
            initData()
        })
        watch(() => shop.store, () => {
            initData()
        })
        watch(() => shop.brand, () => {
            initData()
        })
        watch(() => i18n.language, () => {
            initF()
        })

        return{
            dayjs,
            percent,
            loading,
            shop,
            data,
            i18n
        }
    }
}
</script>

<style>
.home-progress{
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
}
</style>