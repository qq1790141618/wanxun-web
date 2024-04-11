<template>
    <t-radio-group v-model="view" variant="default-filled" style="margin-bottom: 10px;">
        <t-radio-button value="chart"><t-icon name="chart-ring"></t-icon></t-radio-button>
        <t-radio-button value="table"><t-icon name="table"></t-icon></t-radio-button>
    </t-radio-group>
    <div
    ref="primaryChart"
    v-show="view === 'chart'"
    class="cas-chart"
    ></div>
    <t-table
    v-if="primaryData && primaryData.length > 0"
    v-show="view === 'table'"
    :bordered="false"
    :data="primaryData"
    :columns="columns"
    :max-height="550"
    style="width: 100%; margin: 20px auto;"
    :sort="sortValue"
    @sort-change="(val) => {
        sortValue = val
        primaryData = sort(val, primaryData, sortDefault)
    }"
    :show-sort-column-bg-color="true"
    :foot-data="footData"
    row-key="name"
    ></t-table>
</template>

<script setup>
import { sort } from '../../../../hooks'
import * as echarts from 'echarts'
import {getString} from "../../../../i18n/index.js"

const props = defineProps(['data'])
const primaryData = ref([])
const view = ref('chart')
const sortValue = ref(null)
const sortDefault = { sortBy: 'salesCount', descending: true }
const footData = ref([])

const columns = [
    {
        title: getString('channel'),
        colKey: 'name',
        ellipsis: true,
        tooltip: true,
        width: 200
    },
    {
        title: getString('salesCount'),
        colKey: 'salesCount',
        sortType: 'all',
        sorter: true
    },
    {
        title: getString('ratio'),
        colKey: 'proportion',
        cell: (h, {row}) => {
            if(row['proportion']){
                return Math.round(row['proportion'] * 10000) / 100 + '%'
            }
        },
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
        title: getString('afterSalesRatio'),
        colKey: 'afterSalesRate',
        cell: (h, {row}) => {
            if(row['afterSalesRate']){
                return Math.round(row['afterSalesRate'] * 10000) / 100 + '%'
            }
        },
        sortType: 'all',
        sorter: true
    },
    {
        title: getString('CUP'),
        colKey: 'CUP',
        sortType: 'all',
        sorter: true
    }
]
let chart
const primaryChart = ref(null)
const chartOptions = ref({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            type: 'pie',
            radius: ['50%', '90%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 700
                }
            },
            labelLine: {
                show: false
            },
            data: []
        }
    ]
})
const initChart = async () => {
    if(!props.data){
        return
    }

    primaryData.value = props.data
    let foo = {
        name: getString('summary')
    }

    for (let i = 0; i < props.data.length; i++) {
        chartOptions.value.series[0].data.push({
            name: props.data[i].name,
            value: props.data[i].salesCount
        })

        for (const key in props.data[i]) {
            if(typeof(props.data[i][key] * 1) === 'number' && !isNaN(props.data[i][key] * 1) && key !== 'name' && key !== 'afterSalesRate' && key !== 'proportion' && key !== 'CUP'){
                if(!foo[key]){
                    foo[key] = props.data[i][key] * 1
                } else {
                    foo[key] += props.data[i][key] * 1
                }
                foo[key] = Math.round(foo[key])
            } else if(key === 'afterSalesRate'){
                foo[key] = Math.round(foo['refundsCount'] / foo['salesCount'] * 10000) / 100 + '%'
            } else if(key === 'CUP'){
                foo[key] = Math.round(foo['salesAmount'] / foo['salesCount'])
            } else if(key === 'proportion'){
                foo[key] = '100%'
            }
        }
    }
    footData.value = [
        foo
    ]

    chart = echarts.init(primaryChart.value)
    primaryChart.value.removeAttribute('_echarts_instance_')
    chart.clear()
    chart.setOption(chartOptions.value)

    window.addEventListener("resize", function () {
        chart.resize()
    })
}

onMounted(() => {
    initChart()
})
</script>

<style>

</style>