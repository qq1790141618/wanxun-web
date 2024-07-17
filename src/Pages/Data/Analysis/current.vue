<template>
    <div style="padding: 12px;" class="item-ana">
        <t-card
            :bordered="false"
            size="small"
            :header-bordered="true"
        >
            <template #header>
                <span>
                    <t-tag theme="primary" variant="light">
                        {{ shop.storeOptions.find(item => item.id === shop.store).name }}
                        {{ shop.store }}
                    </t-tag>
                    <br />
                    <t-tag theme="success" variant="light">
                        {{ shop.brandOptions.find(item => item.id === shop.brand).name }}
                        {{ shop.brand }}
                    </t-tag>
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
                    <t-select
                        v-model="density"
                        :label="getString('timeDensity') + '：'"
                        :options="[
                            {
                                label: getString('auto'),
                                value: 'auto'
                            },
                            {
                                label: getString('day'),
                                value: 'DATE'
                            },
                            {
                                label: getString('month'),
                                value: 'MONTH'
                            },
                            {
                                label: getString('year'),
                                value: 'YEAR'
                            },
                            {
                                label: getString('hour'),
                                value: 'HOUR'
                            },
                            {
                                label: getString('minute'),
                                value: 'MINUTE'
                            }
                        ]"
                        @change="densityChange"
                        size="small"
                        style="margin-top: 6px;"
                    />
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
                placement="left"
            >
                <t-tab-panel
                    :value="0"
                    :label="getString('summary')"
                    :destroy-on-hide="true"
                >
                    <div class="analysis-view-item">
                        <SumVeri :data="data.summary" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                    :value="1"
                    :label="getString('timeLine')"
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
import { request } from "../../../api/request.js"
import Summary from "./View/Summary.vue"
import TimePoint from "./View/TimePoint.vue"
import Contrust from "./View/Contrust.vue"
import Category from "./View/Category.vue"
import Channel from "./View/Channel.vue"
import Season from "./View/Season.vue"
import Sex from "./View/Sex.vue"
import Supplier from "./View/Supplier.vue"
import SumVeri from "./SumVeri.vue"

const i18n = inject('i18n')
const shop = inject('shop')

const date = ref([
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
])
const tabId = ref(1)
const loading = ref(false)
const data = ref({})
const density = ref('auto')

const densityChange = (value) => {
    density.value = value
    loading.value = true
    let count = 0
    const addCount = () => {
        count++
        if (count >= 2) {
            loading.value = false
        }
    }
    getLineSale().then(addCount)
    getContrast().then(addCount)
}

const quickDateRangePicker = ref({})
const initQuickDate = async (newValue) => {
    quickDateRangePicker.value = await getQuickDateRangePicker(newValue)
}
watch(() => i18n.language,  initQuickDate)
initQuickDate()

const errorInfo = ref([])
const addError = (error) => {
    errorInfo.value.push(error)
}
const calculateDensity = () => {
    if (density.value !== 'auto') return density.value
    let timeFrom = dayjs(date.value[0]).unix()
    let timeTo = dayjs(date.value[1]).unix()
    if(timeTo - timeFrom < 60 * 60) return 'MINUTE'
    if(timeTo - timeFrom < 24 * 60 * 60) return 'HOUR'
    if(timeTo - timeFrom < 31 * 24 * 60 * 60) return 'DATE'
    if(timeTo - timeFrom < 365 * 24 * 60 * 60) return 'MONTH'
    return 'YEAR'
}
const getLineSale = async () => {
    let res = await request('/analysis/summary', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59',
        density: calculateDensity()
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
        endTime: dayjs(date.value[1]).subtract(1, 'year').format('YYYY-MM-DD') + ' 23:59:59',
        density: calculateDensity()
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
watch(() => shop.store, initData)
watch(() => shop.brand, initData)
watch(() => date.value, initData)
</script>

<style>
.analysis-tab {
    border-radius: 10px;
    height: calc(100vh - 190px);
    --chart-cas-margin-top-bottom: 50px;
}
.analysis-tab .t-tab-panel {
    padding: 10px;
}
.analysis-tab svg {
    position: relative;
    top: -2px;
}
.analysis-tab .cas-table,
.analysis-tab .cas-chart {
    width: 100%;
    max-width: 1350px;
    height: 500px;
    max-height: calc(100vh - 360px);
    margin: var(--chart-cas-margin-top-bottom) auto;
}
.analysis-tab .t-tabs__header,
.analysis-tab .t-tabs__nav,
.analysis-tab .t-tabs__nav-container,
.analysis-tab .t-tabs__nav-scroll {
    height: 100%;
}
.analysis-tab .t-tabs__nav-item,
.analysis-tab .t-tabs__nav-item-wrapper {
    width: 100px;
}
.analysis-tab .t-tabs__nav-item-text-wrapper {
    margin: 0 auto;
}
.item-ana .t-card__body {
    padding: 0;
}
</style>