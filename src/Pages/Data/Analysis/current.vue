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
                        @click="initData"
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
                style="width: 100%; height: calc(100vh - 160px); padding-top: 15vh;"
                size="small"
                :text="getString('loading')"
            ></t-loading>
            <t-row
                :gutter="[18, 12]"
                style="width: 100%;"
                v-if="!loading"
            >
                <t-col :span="6">
                </t-col>
            </t-row>
            <t-tabs
                v-model="tabId"
                class="analysis-tab"
                v-if="!loading"
            >
                <t-tab-panel
                    :value="1"
                    :label="getString('summary')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <Summary :data="data.summary" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                    :value="3"
                    :label="getString('time')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <TimePoint :data="data" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                    :value="4"
                    :label="getString('contrast')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <Contrust :base="data.summary" :yet="data.contrast" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                    :value="5"
                    :label="getString('category')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <Category :data="data.category" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                    :value="6"
                    :label="getString('channel')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <Channel :data="data.channel" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                    :value="8"
                    :label="getString('season')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <Season :data="data.season" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                    :value="7"
                    :label="getString('sex')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <Sex :data="data.sex" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                    :value="9"
                    :label="getString('supplier')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <Supplier :data="data.supplier" />
                    </div>
                </t-tab-panel>
            </t-tabs>
        </t-card>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { getQuickDateRangePicker } from '../../../hooks'
import { getString } from "../../../i18n/index.js"
import { tips } from "../../../hooks/tips.js"
import { request } from "../../../api/request.js"
import Summary from "./View/Summary.vue"
import TimePoint from "./View/TimePoint.vue";
import Contrust from "./View/Contrust.vue";
import Category from "./View/Category.vue";
import Channel from "./View/Channel.vue";
import Season from "./View/Season.vue";
import Sex from "./View/Sex.vue";
import Supplier from "./View/Supplier.vue";

const i18n = inject('i18n')
const shop = inject('shop')

const date = ref([
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
])
const tabId = ref(1)
const loading = ref(false)
const data = ref({})

const quickDateRangePicker = ref({})
watch(() => i18n.language,  async (newValue) => {
    quickDateRangePicker.value = await getQuickDateRangePicker(newValue)
})

const errorInfo = ref([])
const addError = (error) => {
    errorInfo.value.push(error)
}
const getLineSale = async () => {
    let res = await request('/analysis/summary', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status !== 'success'){
        addError(res.error)
    } else {
        data.value.summary = res.content
    }
}
const getSupplier = async () => {
    let res = await request('/analysis/supplier', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status !== 'success'){
        addError(res.error)
    } else {
        data.value.supplier = res.content
    }
}
const getWeeks = async () => {
    let res = await request('/analysis/week', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status !== 'success'){
        addError(res.error)
    } else {
        data.value.week = res.content
    }
}
const getHours = async () => {
    let res = await request('/analysis/hour', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status !== 'success'){
        addError(res.error)
    } else {
        data.value.hour = res.content
    }
}
const getContrast = async () => {
    let res = await request('/analysis/summary', {
        store: shop.store,
        brand: shop.brand,
        startTime: dayjs(date.value[0]).subtract(1, 'year').format('YYYY-MM-DD') + ' 00:00:00',
        endTime: dayjs(date.value[1]).subtract(1, 'year').format('YYYY-MM-DD') + ' 23:59:59'
    })
    if(res.status !== 'success'){
        addError(res.error)
    } else {
        data.value.contrast = res.content
    }
}
const getCategory = async () => {
    let res = await request('/analysis/categories', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status === 'success'){
        res.content.sort((a, b) => {
            let per = 'salesCount'
            if (a[per] < b[per]) {
                return 1
            }
            if (a[per] > b[per]) {
                return -1
            }
            return 0
        })
        data.value.category = res.content
    } else {
        data.value.contrast = res.content
    }
}
const getChannels = async () => {
    let res = await request('/analysis/channel', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status !== 'success'){
        addError(res.error)
    } else {
        data.value.channel = res.content
    }
}
const getSeasons = async () => {
    let res = await request('/analysis/season', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status !== 'success'){
        addError(res.error)
    } else {
        data.value.season = res.content
    }
}
const getSexes = async () => {
    let res = await request('/analysis/sex', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(res.status !== 'success'){
        addError(res.error)
    } else {
        data.value.sex = res.content
    }
}

const initData = async () => {
    loading.value = true
    errorInfo.value = []
    let count = 0

    const addCount = () => {
        count++
        if (count >= 9) {
            loading.value = false
        }
    }

    getLineSale().then(addCount)
    getSupplier().then(addCount)
    getWeeks().then(addCount)
    getHours().then(addCount)
    getContrast().then(addCount)
    getCategory().then(addCount)
    getChannels().then(addCount)
    getSeasons().then(addCount)
    getSexes().then(addCount)
}

onMounted(initData)
</script>

<style>
.analysis-tab {
    border-radius: 10px;
    height: calc(100vh - 160px);
    --chart-cas-margin-top-bottom: 50px;
}
.analysis-tab .t-tab-panel {
    padding-top: 10px;
}
.analysis-tab svg {
    position: relative;
    top: -2px;
}
.analysis-tab .cas-chart {
    height: calc(100vh - 360px);
    margin: var(--chart-cas-margin-top-bottom) 0;
    width: 100%;
}
.item-ana .t-card__body {
    padding: 0 10px;
}
</style>