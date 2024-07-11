<template>
    <div style="padding: 12px;" class="item-ana">
        <t-card
            :bordered="false"
            size="small"
            :header-bordered="true"
        >
            <template #header>
                <span>
                    {{ shop.storeOptions.find(item => item.id === shop.store).name }}
                    {{ shop.store }}
                    /
                    {{ shop.brandOptions.find(item => item.id === shop.brand).name }}
                    {{ shop.brand }}
                </span>
                <span>
                    <span style="margin-right: 6px;">
                        {{ getString('choose') }}{{ getString('time') }}:
                    </span>
                    <t-date-range-picker
                        size="small"
                        v-model="date"
                        :presets="quickDateRangePicker"
                        @change="initData"
                    ></t-date-range-picker>
                    <t-button
                        size="small"
                        variant="outline"
                        :loading="loading"
                        @click="matchData"
                        style="margin-left: 6px;"
                    >
                        <template #icon>
                            <t-icon name="refresh" />
                        </template>
                        {{ getString('refresh') }}
                    </t-button>
                </span>
            </template>
            <t-loading
                v-if="loading"
                style="width: 100%; min-height: 50vh;"
                size="small"
                :text="getString('loading')"
            ></t-loading>
            <t-row
                :gutter="[18, 12]"
                style="width: 100%;"
                v-if="!loading"
            >
                <t-col :span="6">
                    <ItemStructure :data="data.category" />
                </t-col>
                <t-col :span="3">
                    <PriceRange :data="data.goods" />
                </t-col>
                <t-col :span="3">
                    <TurnoverRateVue :data="data.category" />
                </t-col>
                <t-col :span="10">
                    <Sales :data="data.goods" />
                </t-col>
<!--                <t-col :span="6">-->
<!--                    <AfterSales :data="data.goods" />-->
<!--                </t-col>-->
                <t-col :span="2">
                    <RefundsReverseFreight :data="data.freight" />
                </t-col>
            </t-row>
        </t-card>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { getQuickDateRangePicker } from '../../../hooks'
import ItemStructure from './ItemStructure.vue'
import PriceRange from './PriceRange.vue'
import TurnoverRateVue from './TurnoverRate.vue'
import Sales from './Sales.vue'
import RefundsReverseFreight from './RefundsReverseFreight.vue'
import {tips} from "../../../hooks/tips.js"
import {getString} from "../../../i18n/index.js"
import {request} from "../../../api/request.js"

const i18n = inject('i18n')
const shop = inject('shop')

const date = ref([
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
])
const loading = ref(false)
const data = ref({
    goods: [],
    freight: {

    },
    category: []
})

const getProduct = async () => {
    let d = await request('/analysis/product', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(d.status === 'success'){
        data.value.goods = d.content
    } else {
        tips(d.error.msg, 'error')
    }
}
const getFreight = async () => {
    let f = await request('/analysis/freight', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(f.status === 'success'){
        data.value.freight = f.content
    } else {
        tips(f.error.msg, 'error')
    }
}
const getCategories = async () => {
    let res = await request('/analysis/categories', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status === 'success'){
        data.value.category = res.content
    } else {
        tips(res.error.msg, 'error')
    }
}
const matchData = () => {
    loading.value = true
    let count = 0
    const addCount = () => {
        count++
        if (count >= 3) {
            loading.value = false
        }
    }
    getProduct().then(addCount)
    getCategories().then(addCount)
    getFreight().then(addCount)
}

let timer
const initData = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        matchData()
    }, 300)
}

const quickDateRangePicker = ref({})
const initQuickDate = async (newValue) => {
    quickDateRangePicker.value = await getQuickDateRangePicker(newValue)
}
watch(() => i18n.language,  initQuickDate)
initQuickDate()

watch(() => shop.store, matchData)
watch(() => shop.brand, matchData)
onMounted(matchData)
</script>

<style>
.item-ana .t-anchor{
    background-color: transparent;
}
.item-ana .chart{
    width: 100%;
    height: 36vh;
    margin: 20px 12px;
}
</style>