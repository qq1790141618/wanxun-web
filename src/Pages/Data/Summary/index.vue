<template>
    <t-card class="summary-card" :bordered="false" style="padding: 12px;">
        <template #title>
            <t-icon :name="$route.meta.icon"></t-icon>
            <span style="vertical-align: middle; margin-left: 8px;">
                {{ getString($route.meta.title) }}
                ({{ shop.storeOptions.filter(item => item.id === shop.store)[0].label }}{{ shop.store }} / {{ shop.brand }})
            </span>
        </template>
        <t-table
            :bordered="false"
            :data="data[useMonth]"
            :columns="columns"
            :loading="loading"
            :loading-props="{
                text: getString('loading')
            }"
            max-height="calc(100vh - 300px)"
            @sort-change="sortConfig.done"
            :sort="sortConfig.value"
            :foot-data="footData"
            show-sort-column-bg-color
            row-key="date"
        >
        </t-table>
        <template #footer>
            <div style="margin-bottom: 10px; text-align: center;">
                <t-button
                    variant="outline"
                    shape="square"
                    @click="changeMonth(-1)"
                    :disabled="useMonth === '2021-11'"
                >
                    <template #icon>
                        <t-icon name="chevron-left"></t-icon>
                    </template>
                </t-button>
                <t-date-picker
                    mode="month"
                    v-model="useMonth"
                    format="YYYY-MM"
                    @change="initData()"
                    :disableDate="(current) => dayjs(current).isBefore(dayjs('2021-11-01')) || dayjs(current).isAfter(dayjs().subtract(1, 'day'))"
                    allow-input
                    style="margin: 0 10px; width: 200px;"
                >
                </t-date-picker>
                <t-button
                    shape="square"
                    style="margin-right: 10px;"
                    @click="() => {
                        delete data[useMonth]
                        initData()
                    }"
                >
                    <template #icon>
                        <t-icon name="refresh"></t-icon>
                    </template>
                </t-button>
                <t-button
                    variant="outline"
                    shape="square"
                    @click="changeMonth(1)"
                    :disabled="useMonth === dayjs().format('YYYY-MM')"
                >
                    <template #icon>
                        <t-icon name="chevron-right"></t-icon>
                    </template>
                </t-button>
            </div>
        </template>
    </t-card>
</template>

<script setup>
import dayjs from 'dayjs'
import { sort } from '../../../hooks'
import { tips } from "../../../hooks/tips.js"
import { getString } from "../../../i18n/index.js"
import { request } from "../../../api/request.js"

const i18n = inject('i18n')
const shop = inject('shop')

const loading = ref(false)
const data = ref({})
const columns = [
    {
        title: getString('date'),
        colKey: 'time',
        sortType: 'all',
        sorter: true,
        width: 180
    },
    {
        title: getString('salesCount'),
        colKey: 'salesCount',
        sortType: 'all',
        sorter: true
    },
    {
        title: getString('salesAmount'),
        colKey: 'salesAmount',
        sortType: 'all',
        sorter: true
    },
    {
        title: getString('refundsCount'),
        colKey: 'refundsCount',
        sortType: 'all',
        sorter: true
    },
    {
        title: getString('refundsAmount'),
        colKey: 'refundsAmount',
        sortType: 'all',
        sorter: true
    },
    {
        title: getString('actualSalesAmount'),
        colKey: 'realSaleAmount',
        sortType: 'all',
        sorter: true
    },
    {
        title: getString('income'),
        colKey: 'income',
        sortType: 'all',
        sorter: true
    }
]
const useMonth = ref(null)
useMonth.value = dayjs().format('YYYY-MM')
const footData = ref([])
const sortConfig = ref({
    value: null,
    default: { sortBy: 'date', descending: false },
    done: (val) => {
        sort.value.value = val
        data[useMonth.value] = sort(val, data[useMonth.value], sort.value.default)
    }
})

const computeFootData = (data) => {
    let countData = {}
    countData.time = '合计'

    data.forEach(row => {
        for (const key in row) {
            if(typeof(row[key]) == 'number' && !isNaN(row[key])){
                if(countData[key]){
                    countData[key] = Math.round((countData[key] * 1 + row[key] * 1) * 100) / 100
                } else {
                    countData[key] = Math.round(row[key] * 100) / 100
                }
            }
        }
    })

    return [
        countData
    ]
}
const initData = async () => {
    if(data.value[useMonth.value]){
        footData.value = computeFootData(data.value[useMonth.value])
        return
    }
    loading.value = true

    footData.value = []
    let res = await request('/analysis/summary', {
        store: shop.store,
        brand: shop.brand,
        startTime: dayjs(useMonth.value).startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
        endTime: dayjs(useMonth.value).endOf('month').format('YYYY-MM-DD') + ' 23:59:59'
    })
    if(res.status === 'success'){
        data.value[useMonth.value] = res.content
        footData.value = computeFootData(res.content)
    } else {
        tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
    }

    loading.value = false
}
const cantChangeMonth = ref(false)
const changeMonth = (number) => {
    if(number === 0 || cantChangeMonth.value){
        return
    }
    if(number > 0){
        if(useMonth.value === dayjs().format('YYYY-MM')){
            return
        }
        useMonth.value = dayjs(useMonth.value).add(number, 'month').format('YYYY-MM')
    } else {
        if(useMonth.value === '2021-11'){
            return
        }
        useMonth.value = dayjs(useMonth.value).subtract(number * -1, 'month').format('YYYY-MM')
    }
}
const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        changeMonth(-1)
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        changeMonth(1)
    }
}

onMounted(() => {
    initData()
})
onActivated(() => {
    cantChangeMonth.value = false
    window.addEventListener('keydown', onKeyDown)
})
onDeactivated(() => {
    cantChangeMonth.value = true
    window.removeEventListener('keydown', onKeyDown)
})
watch(() => shop.store, initData)
watch(() => shop.brand, initData)
watch(() => useMonth.value, initData)
</script>

<style>
.summary-card{
    width: 1000px;
    max-width: 95vw;
    max-height: calc(100vh - 100px);
    margin: 10px auto;
}
</style>