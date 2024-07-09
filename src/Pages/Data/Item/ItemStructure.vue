<template>
    <div
        ref="chartEl"
        class="chart"
    >
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import {getString} from "../../../i18n/index.js"

const props = defineProps({
    data: {
        type: Array,
        required: true
    }
})

const chartEl = ref(null)
const chartOption = ref({
    title: {
        left: 'center',
        text: getString('categoryPriceRange') + ' / ' + getString('yuan')
    },
    tooltip: {
        trigger: 'axis',
        formatter: (params) => {
            let min = params[0].value
            let max = params[1].value + min
            return params[0].name + ' ' + min + '-' + max + ' ' + getString('yuan')
        }
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            label: 'Min',
            data: [],
            type: 'bar',
            stack: 'total',
            showBackground: true,
            itemStyle: {
                color: 'rgba(180, 180, 180, 0)'
            },
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.1)'
            }
        },
        {
            label: 'Max',
            data: [],
            stack: 'total',
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.1)'
            }
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
        chartOption.value.xAxis.data.push(chartData[i].name)
        chartOption.value.series[0].data.push(chartData[i].minPrice)
        let cross = chartData[i].maxPrice - chartData[i].minPrice
        chartOption.value.series[1].data.push(cross)
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