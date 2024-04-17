<template>
    <div style="padding: 12px; " class="opera-ana">
        <t-card
        :bordered="false"
        size="small"
        header-bordered
        style="height: calc(100vh - 115px);"
        >
            <template #header>
                <t-space size="6px" align="center">
                    <t-select
                    size="small"
                    :label="getString('store') + ': '"
                    v-model="store"
                    :options="shop.storeOptions"
                    @change="initData"
                    style="width: fit-content;"
                    :disabled="loading"
                    clearable
                    />
                    <t-select
                    size="small"
                    :label="getString('brand') + ': '"
                    v-model="brand"
                    :options="shop.brandOptions"
                    @change="initData"
                    style="width: fit-content;"
                    :disabled="loading"
                    />

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
                    :mode="mode"
                    v-model="date[mode]"
                    @change="initData"
                    style="width: 135px;"
                    :disabled="loading"
                    />

                    <t-input-number
                    size="small"
                    v-model="tagFee"
                    :step="1"
                    :label="getString('eahtc')"
                    :suffix="getString('yuan')"
                    style="width: fit-content;"
                    @change="computerProfit"
                    :disabled="loading"
                    />
                    <t-input-number
                    size="small"
                    v-model="platformServiceFee"
                    :step="0.01"
                    :label="getString('psfr')"
                    style="width: fit-content;"
                    @change="computerProfit"
                    :disabled="loading"
                    />
                    <t-input-number
                    size="small"
                    v-model="tax"
                    :step="0.01"
                    :label="getString('tax') + getString('ratio')"
                    style="width: fit-content;"
                    @change="computerProfit"
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
                v-for="item, index in errorInfo"
                :key="index"
                class="error-card"
                >
                    <t-icon name="close-circle" style="color: red; margin-right: 2px;" />
                    {{ item.message }}
                    <t-textarea
                    :value="item.data.join('\n')"
                    name="description"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    readonly
                    />
                </t-card>
            </div>
            <t-row
            :gutter="[18, 12]"
            style="width: 100%;"
            v-if="!loading && JSON.stringify(errorInfo) === '{}'"
            >
                <t-col :span="4">
                    <OperationalContrust :data="data" />
                </t-col>
                <t-col :span="4">
                    <ProfitRatio :data="data" />
                </t-col>
                <t-col :span="4">
                    <GoodsProfitRanks :data="data" />
                </t-col>
            </t-row>
        </t-card>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { translate, uniqueArray } from '../../../hooks'
import GoodsProfitRanks from './GoodsProfitRanks.vue'
import OperationalContrust from './OperationalContrust.vue'
import ProfitRatio from './ProfitRatio.vue'
import service from "../../../api/service.js"
import {tips} from "../../../hooks/tips.js"
import {getString} from "../../../i18n/index.js"

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
        value: 'date',
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
const date = ref(null)
date.value = {
    date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    month: dayjs().format('YYYY-MM'),
    year: dayjs().format('YYYY')
}

const tax = ref(0.08)
const platformServiceFee = ref(0.2)
const tagFee = ref(0)
const special = (brand) => {
    if(brand === 'DR'){
        platformServiceFee.value = 0.3
    } else {
        platformServiceFee.value = 0.2
    }
    if(brand === '兔皇'){
        tagFee.value = 8
    } else {
        tagFee.value = 8
    }
}
special(brand.value)
watch(() => brand.value, (newVal) => {
    special(newVal)
})

const data = ref({})
const errorInfo = ref({})

const loading = ref(false)
const initData = async () => {
    data.value = {}
    errorInfo.value = {}
    loading.value = true

    let n = 5
    if(mode.value === 'year'){
        n = 2
    }
    if(mode.value === 'date'){
        n = 7
    }
    let option = modeOptions.find(obj => obj.value === mode.value)
    let format = option.format
    let tag = option.tag
    let results = {}

    for (let i = 0; i < n; i++) {
        let matchTime = dayjs(date.value[mode.value]).subtract(i, tag).format(format)
        let res = await service.api.analysis.operational(brand.value, mode.value, matchTime, store.value ?? "")

        if(res.result){
            results[matchTime] = res
            continue
        } else {
            tips(res.error.message, 'error')
        }

        let ekey
        if(results[matchTime].error.message === '部分SKU在品牌的商品列表中未包含'){
            ekey = 'nosku'
        }
        if(results[matchTime].error.message === '部分SKU未上传运营价'){
            ekey = 'nocost'
        }

        errorInfo.value[ekey] = errorInfo.value[ekey] ? errorInfo.value[ekey] : { message: '', data: [] }
        errorInfo.value[ekey].message = (await translate(results[matchTime].error.message, i18n.language))['trans_result'][0]['dst']
        errorInfo.value[ekey].data = errorInfo.value[ekey].data.concat(results[matchTime].content)
        errorInfo.value[ekey].data = uniqueArray(errorInfo.value[ekey].data, arr => arr)
    }

    data.value = results
    if(JSON.stringify(errorInfo.value) === '{}'){
        computerProfit()
    } else {
        loading.value = false
    }
}
const computerProfit = () => {
    loading.value = true

    for (const key in data.value) {
        let list = data.value[key].data

        for (let i = 0; i < list.length; i++) {
            list[i].income = list[i].salesIncome - list[i].refundsIncome
            list[i].income = Math.round(list[i].income * 100) / 100
            list[i].actualSalesCount = list[i].salesCount - list[i].refundsCount
            list[i].actualSalesAmount = list[i].salesAmount - list[i].refundsAmount
            list[i].useCost = list[i].salesCost - list[i].refundsCost
            list[i].profit = list[i].income * (1 - tax.value) - platformServiceFee.value * list[i].actualSalesAmount - list[i].useCost - tagFee.value * list[i].actualSalesCount
            list[i].profit = Math.round(list[i].profit * 100) / 100
            list[i].profitRatio = list[i].profit == 0 ? 0 : list[i].profit / list[i].actualSalesAmount
            list[i].profitRatio = Math.round(list[i].profitRatio * 10000) / 10000
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
.opera-ana .chart{
    width: 100%;
    height: 40vh;
    margin: 15vh 0;
}
</style>