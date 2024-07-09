<template>
    <div
    ref="chartEl"
    style="width: 100%; height: calc(100vh - 310px);"
    ></div> 
</template>

<script setup>
import * as echarts from 'echarts'
import { getString } from "../../../i18n/index.js"

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
const chartEl = ref(null)
const chartOption = ref({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
            label: {
                show: true
            }
        }
    },
    calculable: true,
    legend: {
        data: [
            getString('styleCount'),
            getString('actualSalesCount')
        ],
        itemGap: 5
    },
    grid: {
        top: '12%',
        left: '1%',
        right: '10%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: []
        }
    ],
    yAxis: [
        {
            type: 'value',
        }
    ],
    dataZoom: [
        {
            show: true,
            show: true,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            start: 0,
            end: 100
        },
        {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 30,
            height: '80%',
            showDataShadow: false,
            left: '93%'
        }
    ],
    series: [
        {
            name: getString('styleCount'),
            type: 'bar',
            itemStyle: {
                borderRadius: 5,
                borderColor: '#fff'
            },
            data: []
        },
        {
            name: getString('actualSalesCount'),
            type: 'bar',
            itemStyle: {
                borderRadius: 5,
                borderColor: '#fff'
            },
            data: []
        }
    ]
})
let chart

const initChart = () => {
    if(!props.data){
        return
    }

    let chartData = props.data

    for (let i = 0; i < chartData.length; i++) {
        let a = chartData[i].count
        let b = chartData[i].realSaleCount
        chartOption.value.xAxis[0].data.push(chartData[i].name + '\n' + chartData[i].category)
        chartOption.value.series[0].data.push(a)
        chartOption.value.series[1].data.push(b)
    }

    chart = echarts.init(chartEl.value)
    chartEl.value.removeAttribute('_echarts_instance_')
    chart.clear()
    chart.setOption(chartOption.value)

    window.addEventListener("resize", function () {
        chart.resize()
    })
}
onMounted(initChart)
</script>

<style>

</style>