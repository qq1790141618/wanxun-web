<template>
    <t-table
        size="small"
        :data="primaryData"
        :columns="columns"
        max-height="calc(100vh - 270px)"
        style="margin: 40px 0;"
        :foot-data="footData"
        :sort="sortValue"
        @sort-change="(val) => {
            sortValue = val
            primaryData = sort(val, primaryData, { sortBy: 'actualSalesCount', descending: true  })
        }"
        :show-sort-column-bg-color="true"
    >
    </t-table>
</template>

<script setup>
import {sort} from '../../../hooks'
import {getString} from "../../../i18n/index.js"

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const i18n = inject('i18n')
const mode = ref('profit')

const primaryData = ref([])
const footData = ref([])
const sortValue = ref(null)
const columns = ref([
    {
        colKey: 'styleNumber',
        title: getString('stylenumber'),
        width: 100,
        align: 'center'
    },
    {
        colKey: 'realSaleCount',
        title: getString('actualSalesCount')
    },
    {
        colKey: 'realSaleAmount',
        title: getString('actualSalesAmount')
    },
    {
        colKey: 'income',
        title: getString('income')
    },
    {
        colKey: 'profit',
        title: getString('profit')
    },
    {
        colKey: 'profitRatio',
        title: getString('profit') + getString('ratio'),
        cell: (h, {row}) => {
            if(row.profitRatio !== false){
                if(row.profitRatio === -Infinity || row.profitRatio === Infinity){
                    return 0
                }
                return Math.round(row.profitRatio * 10000) / 100 + '%'
            }
        }
    }
])

const initData = () => {
    if(!props.data){
        return
    }

    let chartData = props.data
    for (const key in chartData) {
        primaryData.value = chartData[key]
        footData.value[0] = { styleNumber: getString('summary') }

        for (let i = 0; i < primaryData.value.length; i++) {
            for (const key in primaryData.value[i]) {
                if(key !== 'profitRatio' && typeof(primaryData.value[i][key]) === 'number' && !isNaN(primaryData.value[i][key])){
                    if(!footData.value[0][key]){
                        footData.value[0][key] = 0
                    }
                    footData.value[0][key] += primaryData.value[i][key]
                    footData.value[0][key] = Math.round(footData.value[0][key] * 100) / 100
                }
            }
        }
        footData.value[0].profitRatio = footData.value[0].profit === 0 ? 0 : footData.value[0].profit / footData.value[0].realSaleAmount
        footData.value[0].profitRatio = Math.round(footData.value[0].profitRatio * 10000) / 100 + '%'

        return
    }
}

onMounted(initData)
</script>

<style>

</style>