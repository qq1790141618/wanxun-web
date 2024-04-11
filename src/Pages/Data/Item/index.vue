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
                        {{ getString('choose') }}{{ getString('time') }}:
                    </span>
                    <t-date-range-picker
                    size="small"
                    v-model="date"
                    :presets="quickDateRangePicker"
                    @change="initData"
                    ></t-date-range-picker>
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
import {MessagePlugin} from "tdesign-vue-next";
import service from "../../../api/service.js";
import {tips} from "../../../hooks/tips.js";
import {getString} from "../../../i18n/index.js";

export default {
    methods: {getString},
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
        const shop = inject('shop')

        const date = ref([
            dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
            dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        ])
        const loading = ref(false)
        const data = ref([])

        const matchData = async () => {
            loading.value = true

            let d = await service.api.analysis.refunds(date.value[0], date.value[1])
            if(d.result){
                data.value.goods = d.data

                for (let i = 0; i < data.value.goods.length; i++) {
                    data.value.goods[i].actualSalesCount = data.value.goods[i].salesCount - data.value.goods[i].afterSaleCount
                    data.value.goods[i]['store-id'] = shop.store
                    data.value.goods[i].brand = shop.brand
                }
            } else {
                tips(typeof d.error === 'string' ? d.error : d.error.message, 'error')
            }

            let f = await service.api.analysis.freights(date.value[0], date.value[1])
            if(f.result){
                data.value.freight = f
            } else {
                tips(typeof f.error === 'string' ? f.error : f.error.message, 'error')
            }

            let res = await service.api.analysis.categoryInform(date.value[0], date.value[1])
            if(res.result){
                data.value.category = res.data
            } else {
                tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
            }

            loading.value = false
        }
        let timer
        const initData = () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                matchData()
            }, 500)
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