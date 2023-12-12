<template>
    <t-card
    :bordered="false"
    style="margin: 15px;"
    header-bordered
    size="small"
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
            </span>
        </template>
        <t-loading
        v-if="loading"
        style="width: 100%; height: 100%; min-height: 50vh;"
        size="small"
        :text="i18n.loading[i18n.language]"
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
                    {{ i18n.chart[i18n.language] }}
                </t-radio-button>
                <t-radio-button value="table">
                    <t-icon name="table"></t-icon>
                    {{ i18n.table[i18n.language] }}
                </t-radio-button>
            </t-radio-group>
            <t-row v-if="view == 'charts'">
                <t-col :span="6">
                    <div style="padding: 50px; box-sizing: border-box;">
                        <MainChart :data="data" />
                    </div>
                </t-col>
                <t-col :span="6">
                    <div style="padding: 50px; box-sizing: border-box">
                        <ElseChart :data="data" />
                    </div>
                </t-col>
            </t-row>
            <div v-if="view == 'table'" style="padding: 50px; box-sizing: border-box">
                <CategoryDataTable :data="data" />
            </div>
        </div>
    </t-card>
</template>

<script>
import dayjs from 'dayjs'
import { getQuickDateRangePicker } from '../../../hooks'
import MainChart from './MainChart.vue'
import ElseChart from './ElseChart.vue'
import CategoryDataTable from './CategoryDataTable.vue'

export default {
    components: {
        MainChart,
        ElseChart,
        CategoryDataTable
    },
    setup() {
        const i18n = inject('i18n')
        const serve = inject('serve')
        const shop = inject('shop')

        const date = ref([
            dayjs().subtract(97, 'day').format('YYYY-MM-DD'),
            dayjs().subtract(7, 'day').format('YYYY-MM-DD')
        ])
        const view = ref('charts')
        const loading = ref(false)
        const data = ref([])

        const categoryInfrom = async (dateFrom, dateTo) => {
            return fetch(serve + `/goods/category/inform?store-id=${ shop.store }&brand=${ shop.brand }&from=${ dateFrom }&to=${ dateTo }`)
            .then(res => {
                return Promise.resolve(res.json())
            })
        }
        const matchData = async () => {
            loading.value = true
            let res = await categoryInfrom(date.value[0], date.value[1])
            data.value = res.data
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
            matchData()
            quickDateRangePicker.value = await getQuickDateRangePicker(i18n.language)
        })

        return {
            i18n,
            quickDateRangePicker,
            date,
            view,
            shop,
            loading,
            data,
            initData
        }
    }
}
</script>

<style>

</style>