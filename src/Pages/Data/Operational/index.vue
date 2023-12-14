<template>
    <div style="padding: 12px; " class="opera-ana">
        <t-card
        :bordered="false"
        size="small"
        header-bordered
        style="height: calc(100vh - 115px);"
        >
            <template #header>
                <span>
                    <t-icon name="castle-3" style="margin-right: 3px;" />
                    {{ shop.storeOptions.filter(item => item.value === shop.store)[0].label }}
                    /
                    {{ shop.brand }}
                </span>
                <t-space size="6px" align="center">
                    <t-select
                    size="small"
                    :label="i18n.store[i18n.language] + ': '"
                    v-model="store"
                    :options="shop.storeOptions"
                    @change="initData"
                    style="width: 160px;"
                    creatable
                    />
                    <t-select
                    size="small"
                    :label="i18n.brand[i18n.language] + ': '"
                    v-model="brand"
                    :options="shop.brandOptions"
                    @change="initData"
                    style="width: 160px;"
                    />
                    
                    <span style="margin-right: 6px;">
                        <t-icon name="calendar" style="margin-right: 3px;" />
                        {{ i18n.choose[i18n.language] }}{{ i18n.time[i18n.language] }}:
                    </span>
                    <t-select
                    size="small"
                    :options="modeOptions"
                    v-model="mode"
                    @change="initData"
                    style="width: 90px;"
                    />
                    <t-date-picker
                    size="small"
                    :mode="mode"
                    v-model="date[mode]"
                    @change="initData"
                    style="width: 135px;"
                    />

                    <t-input-number
                    size="small"
                    v-model="tagFee"
                    :step="1"
                    :label="i18n.eahtc[i18n.language]"
                    :suffix="i18n.yuan[i18n.language]"
                    style="width: 240px;"
                    @change="computerProfit"
                    />
                    <t-input-number
                    size="small"
                    v-model="platformServiceFee"
                    :step="0.01"
                    :label="i18n.psfr[i18n.language]"
                    style="width: 220px;"
                    @change="computerProfit"
                    />
                    <t-input-number
                    size="small"
                    v-model="platformServiceFee"
                    :step="0.01"
                    :label="i18n.tax[i18n.language] + i18n.ratio[i18n.language]"
                    style="width: 180px;"
                    @change="computerProfit"
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
                        {{ i18n.refresh[i18n.language] }}
                    </t-button>
                </t-space>
            </template>
            <t-loading
            v-if="loading"
            style="width: 100%; min-height: 50vh;"
            size="small"
            :text="i18n.loading[i18n.language]"
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

<script>
import dayjs from 'dayjs'
import { translate, uniqueArray } from '../../../hooks'
import GoodsProfitRanks from './GoodsProfitRanks.vue'
import OperationalContrust from './OperationalContrust.vue'
import ProfitRatio from './ProfitRatio.vue'

export default {
    components: {
        OperationalContrust,
        GoodsProfitRanks,
        ProfitRatio
    },
    setup(){
        const serve = inject('serve')
        const shop = inject('shop')
        const store = ref('')
        const brand = ref('')
        store.value = shop.store
        brand.value = shop.brand
        const i18n = inject('i18n')

        const mode = ref('month')
        const modeOptions = [
            {
                label: i18n.date[i18n.language],
                value: 'date',
                format: 'YYYY-MM-DD',
                tag: 'day'
            },
            {
                label: i18n.month[i18n.language],
                value: 'month',
                format: 'YYYY-MM',
                tag: 'month'
            },
            {
                label: i18n.year[i18n.language],
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
            if(brand == 'DR'){
                platformServiceFee.value = 0.3
            } else {
                platformServiceFee.value = 0.2
            }
            if(brand == '兔皇'){
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
        const fetchData = async (mode, value) => {
            let url = serve + `/analysis/aooc?brand=${ brand.value }&mode=${ mode }&time=${ value }`
            if(store.value !== null){
                url = url + `&store-id=${ store.value }`
            }

            return fetch(url)
            .then(response => {
                return Promise.resolve(response.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const initData = async () => {
            data.value = {}
            errorInfo.value = {}
            loading.value = true

            let n = 5
            if(mode.value == 'year'){
                n = 2
            }
            let option = modeOptions.find(obj => obj.value === mode.value)
            let format = option.format
            let tag = option.tag
            let results = {}

            for (let i = 0; i < n; i++) {
                let matchTime = dayjs(date.value[mode.value]).subtract(i, tag).format(format)
                results[matchTime] = await fetchData(mode.value, matchTime)

                if(results[matchTime].result){
                    continue
                }

                let ekey
                if(results[matchTime].message === '部分SKU在品牌的商品列表中未包含'){
                    ekey = 'nosku'
                }
                if(results[matchTime].message === '部分SKU未上传运营价'){
                    ekey = 'nocost'
                }

                errorInfo.value[ekey] = errorInfo.value[ekey] ? errorInfo.value[ekey] : { message: '', data: [] }
                errorInfo.value[ekey].message = errorInfo.value[ekey].message || (await translate(results[matchTime].message, i18n.language)).trans_result[0].dst
                errorInfo.value[ekey].data = errorInfo.value[ekey].data.concat(results[matchTime].data)
                errorInfo.value[ekey].data = uniqueArray(errorInfo.value[ekey].data, arr => arr)
            }

            data.value = results
            computerProfit()
        }
        const computerProfit = () => {
            loading.value = true

            for (const key in data.value) {
                let list = data.value[key].data

                for (let i = 0; i < list.length; i++) {
                    list[i].income = list[i].salesIncome - list[i].refundsIncome
                    list[i].actualSalesCount = list[i].salesCount - list[i].refundsCount
                    list[i].actualSalesAmount = list[i].salesAmount - list[i].refundsAmount
                    list[i].useCost = list[i].salesCost - list[i].refundsCost
                    list[i].profit = list[i].income * (1 - platformServiceFee.value - tax.value) - list[i].useCost - tagFee.value * list[i].actualSalesCount
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

        return {
            i18n,
            shop,
            store,
            brand,

            mode,
            modeOptions,
            date,

            tax,
            platformServiceFee,
            tagFee,

            data,
            loading,
            errorInfo,
            initData,
            computerProfit
        }
    }
}
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
    height: 400px;
    margin: 15vh 0;
}
</style>