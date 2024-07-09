<template>
    <t-table
        size="small"
        :columns="columns"
        :data="primaryData"
        max-height="calc(100vh - 310px)"
        :pagination="false"
        @sort-change="(val) => {
            sortValue = val
            primaryData = sort(val, primaryData, { sortBy: 'count', descending: true })
        }"
        :sort="sortValue"
        :show-sort-column-bg-color="true"
        :foot-data="footData"
    ></t-table>
</template>

<script setup>
import { sort } from '../../../hooks'
import {getString} from "../../../i18n/index.js"

const props  = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const i18n = inject('i18n')

const primaryData = ref([])
const footData = ref([])
const columns = ref([
    {
        title: getString('category'),
        colKey: 'name',
        ellipsis: true,
        tooltip: true,
        width: 150
    },
    {
        title: 'ID',
        colKey: 'category',
        ellipsis: true,
        tooltip: true,
        width: 150
    },
    {
        title: getString('styleCount'),
        colKey: 'count',
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('ratio'),
        colKey: 'stylenumber-proportion',
        cell: (h, {row}) => {
            return Math.round(row.ratio * 10000) / 100 + '%'
        },
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('quantityOfDynamicSalesStyles'),
        colKey: 'turnover',
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('turnoverRate'),
        colKey: 'turnover-rate',
        cell: (h, {row}) => {
            return Math.round(row.turnoverRatio * 10000) / 100 + '%'
        },
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('salesCount'),
        colKey: 'salesCount',
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('salesAmount'),
        colKey: 'salesAmount',
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('refundsCount'),
        colKey: 'refundsCount',
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('refundsAmount'),
        colKey: 'refundsAmount',
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('afterSaleRate'),
        colKey: 'saled-stylenumber-rate',
        cell: (h, {row}) => {
            return Math.round(row.afterSaleRatio * 10000) / 100 + '%'
        },
        sortType: 'all',
        sorter: true,
        width: 100
    },
    {
        title: getString('CUP'),
        colKey: 'customerUnitPrice',
        sortType: 'all',
        sorter: true,
        width: 100
    }
])
const sortValue = ref(null)

const initData = () => {
    if(!props.data){
        return
    }

    primaryData.value = props.data
    footData.value = [{
        name: getString('summary'),
        count: 0,
        ratio: 0,
        salesCount: 0,
        salesAmount: 0,
        refundsCount: 0,
        refundsAmount: 0,
        turnover: 0,
        turnoverRatio: 0,
        afterSaleRate: 0,
        customerUnitPrice: 0
    }]

    for (let i = 0; i < primaryData.value.length; i++) {
        for (const key in footData.value[0]) {
            if(key !== 'name'){
                footData.value[0][key] += primaryData.value[i][key]
            }
        }
    }

    footData.value[0].ratio = 1
    footData.value[0].turnoverRatio = parseFloat((footData.value[0].salesCount / footData.value[0].count).toFixed(4))
    footData.value[0].afterSaleRate = parseFloat((footData.value[0].refundsCount / footData.value[0].salesCount).toFixed(4))
    footData.value[0].customerUnitPrice = parseFloat((footData.value[0].salesAmount / footData.value[0].salesCount).toFixed(2))
}
onMounted(() => {
    initData()
})
</script>

<style>

</style>