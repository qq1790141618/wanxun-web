<template>
    <div style="height: 90vh; overflow-y: auto;">
        <t-loading
            v-if="loading"
            :text="getString('loading')"
            size="small"
            style="width: 100%; padding: 200px;"
        />
        <t-row :gutter="[12, 12]" v-if="!loading" style="width: 100%; padding: 15px;">
        <t-col :span="12">
            <div style="padding: 0 10px; font-size: 15px;">
                {{ getString('welcomeBack') }}！{{ data.famousWord }}
            </div>
        </t-col>
        <t-col :span="9">
            <t-alert
                :close="true"
                v-if="updateShow"
                theme="success"
                :message="updateContent"
                style="padding: 10px 15px; margin-bottom: 12px;"
            >
                <template #icon>
                    <t-icon name="notification" />
                </template>
            </t-alert>
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
                    :title="getString(item)"
                    :colKey="item === 'goods' ? 'styleNumber' : item"
                    />
                </t-col>
            </t-row>
        </t-col>
        <t-col :span="3">
            <StyleRecommed :data="data.goods" />
        </t-col>
    </t-row>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { translate } from '../../hooks'
import FastView from './FastView.vue'
import RecentData from './RecentData.vue'
import FastRankTable from './FastRankTable.vue'
import StyleRecommed from './StyleRecommed.vue'
import {tips} from "../../hooks/tips.js"
import {getString, getStringAsync} from "../../i18n/index.js"
import {request} from "../../api/request.js"
import {as} from "../../../dist/assets/zrender-CKMklBXB.js";

const loading = ref(true)
const shop = inject('shop')
const i18n = inject('i18n')
const updateShow = ref(false)
const updateContent = ref("新增履约退货单（RMA）的导入功能，支持导入其他渠道的退货单。")

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
    supplier: []
})

const initF = async () => {
    let f = await request('/famous-word')

    if(f.status !== 'success'){
        tips(f.error.msg, 'error')
    }

    data.value.famousWord = f.content['works'] + ' 来自《' + f.content['works'] + '》'
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
const initA = async () => {
    let ao = await request('/analysis/summary', {
        store: shop.store,
        brand: shop.brand,
        startTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD') + ' 00:00:00',
        endTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD') + ' 23:59:59'
    })

    if(ao.status !== 'success'){
        tips(ao.error.msg, 'error')
    } else {
        data.value.week = ao.content
        let y = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        for (let i = 0; i < data.value.week.length; i++){
            if (y === data.value.week[i].time){
                data.value.day = data.value.week[i]
            }
        }
    }
}
const initSP = async () => {
    let ao = await request('/analysis/supplier', {
        store: shop.store,
        brand: shop.brand,
        startTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD') + ' 00:00:00',
        endTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD') + ' 23:59:59'
    })

    if(ao.status !== 'success'){
        tips(ao.error.msg, 'error')
    } else {
        data.value.supplier = ao.content
    }
}
const initSN = async () => {
    let ao = await request('/analysis/product', {
        store: shop.store,
        brand: shop.brand,
        startTime: dayjs().subtract(8, 'day').format('YYYY-MM-DD') + ' 00:00:00',
        endTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD') + ' 23:59:59'
    })

    if(ao.status !== 'success'){
        tips(ao.error.msg, 'error')
    } else {
        data.value.goods = ao.content
    }
}
const trans = async () => {
    let neverUploadKey = '未上传商品资料'
    let neverUpload = await getStringAsync(neverUploadKey)
    for (let i = 0; i < data.value.goods.length; i++){
        if(data.value.goods[i]['stylenumber'] === neverUploadKey){
            data.value.goods[i]['stylenumber'] = neverUpload
        }
    }
    for (let i = 0; i < data.value.supplier.length; i++){
        if(data.value.supplier[i]['supplier'] === neverUploadKey){
            data.value.supplier[i]['supplier'] = neverUpload
        }
    }
}

const initData = () => {
    loading.value = true
    let count = 0
    const addCount = async () => {
        count++
        if (count >= 4) {
            await trans()
            loading.value = false
        }
    }
    initA().then(addCount)
    initSP().then(addCount)
    initSN().then(addCount)
    initF().then(addCount)
}

onMounted(async () => {
    initData()
    if (updateContent.value) {
        if (i18n.language !== 'zh') {
            updateContent.value = await getStringAsync(updateContent.value)
        }
        updateShow.value = true
    }
})
watch(() => shop.store, initData)
watch(() => shop.brand, initData)
watch(() => i18n.language, initF)
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