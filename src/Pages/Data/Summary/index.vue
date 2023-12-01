<template>
    <t-card class="summary-card" :bordered="false" style="padding: 12px;">
        <template #title>
            <t-icon :name="$route.meta.icon"></t-icon>
            <span style="vertical-align: middle; margin-left: 8px;">
                {{ $route.meta.title[local.name] }}
                ({{ shop.storeOptions.filter(item => item.value === shop.store)[0].label }}{{ shop.store }} / {{ shop.brand }})
            </span>
        </template>
        <t-table
        :bordered="false"
        :data="data[useMonth]"
        :columns="columns"
        :loading="loading"
        :loading-props="{
            text: localString.loading[local.name]
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
                shape="square" @click="useMonth = dayjs(useMonth).subtract(1, 'month').format('YYYY-MM')"
                :disabled="useMonth == '2021-11'"
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
                @click="useMonth = dayjs(useMonth).add(1, 'month').format('YYYY-MM')"
                :disabled="useMonth == dayjs().format('YYYY-MM')"
                >
                    <template #icon>
                        <t-icon name="chevron-right"></t-icon>
                    </template>
                </t-button>
            </div>
        </template>
    </t-card>
</template>

<script>
import dayjs from 'dayjs'
import localString from './local'
import { sort } from '../../../hooks'

export default {
    setup(){
        const local = inject('local')
        const serve = inject('serve')
        const shop = inject('shop')

        const loading = ref(false)
        const data = ref({})
        const columns = [
            {
                title: '日期',
                colKey: 'date',
                sortType: 'all',
                sorter: true,
                width: 180
            },
            {
                title: '销售商品总数',
                colKey: 'salesCount',
                sortType: 'all',
                sorter: true
            },
            {
                title: '销售商品总金额',
                colKey: 'salesAmount',
                sortType: 'all',
                sorter: true
            },
            {
                title: '退款商品总数',
                colKey: 'refundsCount',
                sortType: 'all',
                sorter: true
            },
            {
                title: '退款商品总金额',
                colKey: 'refundsAmount',
                sortType: 'all',
                sorter: true
            },
            {
                title: '实销金额',
                colKey: 'realSalesAmount',
                sortType: 'all',
                sorter: true
            },
            {
                title: '净收金额',
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

        const getSummary = async (month) => {
            return fetch(serve + "/analysis/summary/month?id=1000000073&store-id=" + shop.store + "&brand=" + shop.brand + "&month=" + month)
            .then((response) => {
                return Promise.resolve(response.json())
            })
            .catch(() => {
                MessagePlugin.error(localString.httpFail[local.name])
            })
        }
        const computeFootData = (data) => {
            let countData = {}
            countData.date = '合计'

            data.forEach(row => {
                for (const key in row) {
                    if(typeof(row[key]) == 'number' && !isNaN(row[key])){
                        if(countData[key]){
                            countData[key] = Math.round(countData[key] * 1 + row[key] * 1)
                        } else {
                            countData[key] = Math.round(row[key] * 1)
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
            let res = await getSummary(useMonth.value)
            data.value[useMonth.value] = res
            footData.value = computeFootData(res)
            loading.value = false
        }

        onMounted(() => {
            initData()
        })
        watch(() => shop.store, () => {
            data.value = {}
            initData()
        })
        watch(() => shop.brand, () => {
            data.value = {}
            initData()
        })
        watch(() => useMonth.value, () => {
            initData()
        })

        return {
            shop,
            local,
            dayjs,
            localString,
            loading,
            data,
            columns,
            useMonth,
            footData,
            sortConfig,
            initData
        }
    }
}
</script>

<style>
.summary-card{
    width: 1000px;
    max-width: 95vw;
    max-height: calc(100vh - 100px);
    margin: 10px auto;
}
</style>