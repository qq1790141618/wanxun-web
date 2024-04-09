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
import service from "../../api/service.js";
import {getMirrors} from "../../api/goodsApi.js";
import {tips} from "../../hooks/tips.js";
import host from "../../api/host.js";
import {MessagePlugin} from "tdesign-vue-next";

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
        const shop = inject('shop')
        const i18n = inject('i18n')

        const data = ref({
            famousWord: '',
            day: {
                income: 0,
                refundsAmount: 0,
                refundsCount: 0,
                salesAmount: 0,
                salesCount: 0
            },
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

        const initF = async () => {
            let f = await service.api.analysis.famousWord()

            if(!f.result){
                tips(typeof f.error === 'string' ? f.error : f.error.message, 'error')
            }

            data.value.famousWord = f.content.hitokoto + ' 来自《' + f.content.works + '》'
            if(f.content.author){
                data.value.famousWord += f.content.author
            }
            data.value.famousWord += '。'

            translate(data.value.famousWord, i18n.language)
            .then(res => {
                data.value.famousWord = res['trans_result'][0]['dst']
                return Promise.resolve()
            })
        }
        const initData = async () => {
            loading.value = true

            await initF()
            percent.value = 10

            let timer = setInterval(() => {
                percent.value += 1

                if(percent.value >= 90){
                    clearInterval(timer)
                }
            }, 50)

            let ao = await service.api.analysis.annualOverview()

            if(!ao.result){
                tips(typeof ao.error === 'string' ? ao.error : ao.error.message, 'error')
            } else {
                data.value.year.income = ao.income
                data.value.year.ordersCount = ao.ordersCount
                data.value.year.salesCount = ao.salesCount
                data.value.year.productsCount = ao.productsCount
                data.value.week = ao.nearlyWeek
                data.value.supplier = ao.ms.supplier
                data.value.goods = ao.ms.product

                let y = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
                for (let i = 0; i < data.value.week.length; i++){
                    if (y === data.value.week[i].time){
                        data.value.day = data.value.week[i]
                    }
                }
            }

            clearInterval(timer)
            percent.value = 100

            loading.value = false
        }
        const runGetGoodsRank = async () => {
            let res = await service.api.goods.getMirrors(getMirrors)

            if(!res.result){
                tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
                return
            }

            let ranks = {
                KCOR: [],
                NT: [],
                '兔皇': [],
                DR: []
            }
            for (let i = 0; i < res.content.length; i++) {
                for (const ranksKey in ranks) {
                    if(res.content[i].brand.indexOf(ranksKey) >= 0){
                        ranks[ranksKey].push(res.content[i])
                    }
                }
            }

            data.value.ranks = ranks
        }


        onMounted(() => {
            initData()
            runGetGoodsRank()
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