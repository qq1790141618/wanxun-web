<template>
    <div style="padding: 12px;" class="item-ana">
        <t-card
        :bordered="false"
        size="small"
        header-bordered
        >
            <template #header>
                <span>
                    <t-icon name="castle-3" style="margin-right: 3px;" />
                    {{ shop.storeOptions.filter(item => item.value === shop.store)[0].label }}
                    /
                    {{ shop.brand }}
                </span>
                <span>
                    <span style="margin-right: 6px;">
                        <t-icon name="calendar" style="margin-right: 3px;" />
                        {{ i18n.choose[i18n.language] }}{{ i18n.time[i18n.language] }}:
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
                    style="margin-left: 5px;"
                    :loading="exportLoading"
                    @click="exportToFiles"
                    >
                        <template #icon>
                            <t-icon name="file-export" />
                        </template>
                        {{ i18n.export[i18n.language] }}
                    </t-button>
                </span>
            </template>
            <t-loading
            v-if="loading"
            style="width: 100%; min-height: 50vh;"
            size="small"
            :text="i18n.loading[i18n.language]"
            ></t-loading>
            <t-row
            :gutter="[18, 12]"
            style="width: 100%;"
            v-if="!loading"
            >
                <t-col :span="4">
                    <ItemStructure :data="data.goods" />
                </t-col>
                <t-col :span="4">
                    <PriceRange :data="data.goods" />
                </t-col>
                <t-col :span="4">
                    <TurnoverRateVue :data="data.category" />
                </t-col>
                <t-col :span="4">
                    <Sales :data="data.goods" />
                </t-col>
                <t-col :span="6">
                    <AfterSales :data="data.goods" />
                </t-col>
                <t-col :span="2">
                    <RefundsReverseFreight :data="data.freight" />
                </t-col>
            </t-row>
        </t-card>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { getQuickDateRangePicker } from '../../../hooks'
import ItemStructure from './ItemStructure.vue'
import PriceRange from './PriceRange.vue'
import TurnoverRateVue from './TurnoverRate.vue'
import AfterSales from './AfterSales.vue'
import Sales from './Sales.vue'
import RefundsReverseFreight from './RefundsReverseFreight.vue'

export default {
    components: {
        ItemStructure,
        PriceRange,
        TurnoverRateVue,
        AfterSales,
        Sales,
        RefundsReverseFreight
    },
    setup() {
        const i18n = inject('i18n')
        const serve = inject('serve')
        const shop = inject('shop')

        const date = ref([
            dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
            dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        ])
        const loading = ref(false)
        const data = ref([])

        const categoryInfrom = async (dateFrom, dateTo) => {
            return fetch(serve + `/goods/category/inform?store-id=${ shop.store }&brand=${ shop.brand }&from=${ dateFrom }&to=${ dateTo }`)
            .then(res => {
                return Promise.resolve(res.json())
            })
        }
        const getData = async (dateFrom, dateTo, isExport = false) => {
            let url = serve + `/analysis/refunds/get?store-id=${ shop.store }&brand=${ shop.brand }&date=["${ dateFrom }","${ dateTo }"]&start=0&number=9999`
            if(isExport){
                url += '&export=export'
            }
            return fetch(url)
            .then(res => {
                if(isExport){
                    return Promise.resolve(res.text())
                }
                return Promise.resolve(res.json())
            })
        }
        const getFreight = async (dateFrom, dateTo) => {
            return fetch(serve + `/analysis/refunds/freight?store-id=${ shop.store }&brand=${ shop.brand }&date=["${ dateFrom }","${ dateTo }"]`)
            .then(res => {
                return Promise.resolve(res.json())
            })
        }
        const matchData = async () => {
            loading.value = true

            let d = await getData(date.value[0], date.value[1])
            data.value.goods = d.data
            for (let i = 0; i < data.value.goods.length; i++) {
                data.value.goods[i].actualSalesCount = data.value.goods[i].salesCount - data.value.goods[i].afterSaleCount
                data.value.goods[i]['store-id'] = shop.store
                data.value.goods[i].brand = shop.brand
            }
            let f = await getFreight(date.value[0], date.value[1])
            data.value.freight = f
            let c = await categoryInfrom(date.value[0], date.value[1])
            data.value.category = c.data

            loading.value = false
        }
        let timer
        const initData = () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                matchData()
            }, 500)
        }

        const exportLoading = ref(false)
        const exportToFiles = async () => {
            exportLoading.value = true

            let res = await getData(date.value[0], date.value[1], true)
            MessagePlugin.success(i18n.exportSuccess[i18n.language])
            window.open(serve + '/download?filename=' + res)
            
            exportLoading.value = false
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
            matchData()
            quickDateRangePicker.value = await getQuickDateRangePicker(i18n.language)
        })

        return {
            i18n,
            quickDateRangePicker,
            date,
            shop,
            loading,
            data,
            initData,
            exportLoading,
            exportToFiles
        }
    }
}
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