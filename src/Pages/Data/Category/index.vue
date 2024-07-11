<template>
    <t-card
        :bordered="false"
        :header-bordered="true"
        size="small"
        style="margin: 15px;"
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
            style="width: 100%; height: 100%; min-height: 50vh;"
            size="small"
            :text="getString('loading')"
        ></t-loading>
        <div v-if="!loading">
            <t-radio-group
                size="small"
                v-model="view"
                variant="default-filled"
                style="margin-bottom: 10px;"
            >
                <t-radio-button value="charts">
                    <t-icon name="chart-radial"></t-icon>
                    {{ getString('chart') }}
                </t-radio-button>
                <t-radio-button value="table">
                    <t-icon name="table"></t-icon>
                    {{ getString('table') }}
                </t-radio-button>
            </t-radio-group>
            <t-row v-if="view === 'charts'">
                <t-col :span="4">
                    <div style="padding: 50px; box-sizing: border-box;">
                        <MainChart :data="data" />
                    </div>
                </t-col>
                <t-col :span="8">
                    <div style="padding: 50px; box-sizing: border-box">
                        <ElseChart :data="data" />
                    </div>
                </t-col>
            </t-row>
            <div v-if="view === 'table'" style="padding: 50px; box-sizing: border-box">
                <CategoryDataTable :data="data" />
            </div>
        </div>
    </t-card>
</template>

<script setup>
import dayjs from 'dayjs'
import MainChart from './MainChart.vue'
import ElseChart from './ElseChart.vue'
import CategoryDataTable from './CategoryDataTable.vue'
import { getQuickDateRangePicker } from '../../../hooks'
import { tips } from "../../../hooks/tips.js"
import { getString } from "../../../i18n/index.js"
import { request } from "../../../api/request.js"

const i18n = inject('i18n')
const shop = inject('shop')

const date = ref([
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
])
const view = ref('charts')
const loading = ref(false)
const data = ref([])

const matchData = async () => {
    loading.value = true

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
        data.value = res.content
    } else {
        tips(res.error.msg, 'error')
    }

    loading.value = false
}
let timer
const initData = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        matchData()
    }, 100)
}

const quickDateRangePicker = ref({})
watch(() => i18n.language,  async (newValue) => {
    quickDateRangePicker.value = await getQuickDateRangePicker(newValue)
})
watch(() => shop.store, () => {
    matchData()
})
watch(() => shop.brand, () => {
    matchData()
})
onMounted(async () => {
    await matchData()
    quickDateRangePicker.value = await getQuickDateRangePicker(i18n.language)
})
</script>

<style>

</style>