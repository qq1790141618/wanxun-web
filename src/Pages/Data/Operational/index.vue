<template>
    <div style="padding: 12px; " class="opera-ana">
        <t-card
            :bordered="false"
            size="small"
            :header-bordered="true"
            style="height: calc(100vh - 115px);"
        >
            <template #header>
                <span>
                    {{ shop.storeOptions.find(item => item.id === shop.store).name }}
                    {{ shop.store }}
                    /
                    {{ shop.brandOptions.find(item => item.id === shop.brand).name }}
                    {{ shop.brand }}
                </span>
                <t-space size="6px" align="center">
                    <t-select
                        size="small"
                        :options="modeOptions"
                        v-model="mode"
                        @change="initData"
                        style="width: 90px;"
                        :disabled="loading"
                    />
                    <t-date-picker
                        size="small"
                        :mode="mode === 'time' ? 'date': mode"
                        v-model="date[mode]"
                        @change="initData"
                        style="width: 135px;"
                        :disabled="loading"
                    />
                    <t-button
                        size="small"
                        variant="outline"
                        :loading="loading"
                        @click="initData"
                    >
                        <template #icon>
                            <t-icon name="refresh" />
                        </template>
                        {{ getString('refresh') }}
                    </t-button>
                </t-space>
            </template>
            <t-loading
                v-if="loading"
                style="width: 100%; min-height: 50vh;"
                size="small"
                :text="getString('loading')"
            ></t-loading>
            <div
                class="error-card-list"
                v-if="!loading && JSON.stringify(errorInfo) !== '{}'"
            >
                <t-card
                v-for="(item, index) in errorInfo"
                :key="index"
                class="error-card"
                >
                    <t-icon name="close-circle" style="color: red; margin-right: 2px;" />
                    {{ item.message }}
                    <t-textarea
                        :value="item.data.join('\n')"
                        name="description"
                        :autosize="{ minRows: 3, maxRows: 5 }"
                        :readonly="true"
                    />
                </t-card>
            </div>
            <t-row
                :gutter="[18, 12]"
                style="width: 100%;"
                v-if="!loading && JSON.stringify(errorInfo) === '{}'"
            >
                <t-col :span="3">
                    <ProfitRatio :list="data[time]" />
                </t-col>
                <t-col :span="4">
                    <OperationalContrast :data="data" />
                </t-col>
                <t-col :span="5">
                    <GoodsProfitRanks :data="data" />
                </t-col>
            </t-row>
        </t-card>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import GoodsProfitRanks from './GoodsProfitRanks.vue'
import OperationalContrast from './OperationalContrast.vue'
import ProfitRatio from './ProfitRatio.vue'
import { getString } from "../../../i18n/index.js"
import { request } from "../../../api/request.js"

const shop = inject('shop')
const store = ref('')
const brand = ref('')
store.value = shop.store
brand.value = shop.brand
const i18n = inject('i18n')

const mode = ref('month')
const modeOptions = [
    {
        label: getString('date'),
        value: 'time',
        format: 'YYYY-MM-DD',
        tag: 'day'
    },
    {
        label: getString('month'),
        value: 'month',
        format: 'YYYY-MM',
        tag: 'month'
    },
    {
        label: getString('year'),
        value: 'year',
        format: 'YYYY',
        tag: 'year'
    }
]
const date = ref({
    time: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    month: dayjs().format('YYYY-MM'),
    year: dayjs().format('YYYY')
})

const data = ref([])
const time = ref('')
const errorInfo = ref({})

const loading = ref(false)
const initData = () => {
    data.value = []
    errorInfo.value = {}
    loading.value = true

    let n = 5
    let f = 'YYYY-MM'
    if(mode.value === 'year'){
        n = 2
        f = 'YYYY'
    }
    if(mode.value === 'day'){
        n = 7
        f = 'YYYY-MM-DD'
    }

    let isR = false
    let count = 0
    const addCount = () => {
        count++
        if (count >= n) {
            if (isR) {
                loading.value = false
            } else {
                computerProfit()
            }
        }
    }

    for (let i = 0; i < n; i++) {
        let startTime = dayjs().subtract(i, mode.value).startOf(mode.value).format('YYYY-MM-DD') + ' 00:00:00'
        let endTime = dayjs().subtract(i, mode.value).endOf(mode.value).format('YYYY-MM-DD') + ' 23:59:59'
        let t = dayjs().subtract(i, mode.value).format(f)
        if (i === 0) time.value = t
        request('/analysis/operational', {
            store: shop.store,
            brand: shop.brand,
            startTime,
            endTime
        }).then(res => {
            if(res.status !== 'success'){
                errorInfo.value.message = res.error.msg
                errorInfo.value.data = res.content
                isR = true
            } else {
                data.value[t] = res.content
            }
            addCount()
        })
    }
}
const computerProfit = () => {
    for (const key in data.value) {
        let list = data.value[key]
        for (let i = 0; i < list.length; i++) {
            list[i].profitRatio = list[i].profit === 0 ? 0 : parseFloat((list[i].profit / list[i].realSaleAmount).toFixed(4))
        }
    }
    setTimeout(() => {
        loading.value = false
    }, 100)
}

onMounted(() => {
    initData()
})
</script>
 
<style>
.error-card {
    flex-shrink: 0;
    width: 270px;
}
.error-card-list {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 8px;
}
.opera-ana .chart {
    width: 100%;
    height: 40vh;
    margin: 15vh 0;
}
</style>