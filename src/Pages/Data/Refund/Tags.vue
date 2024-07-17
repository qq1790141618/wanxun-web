<template>
    <div
        ref="chartEl"
        class="chart"
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
    title: {
        left: 'center',
        text: getString('reasonTagCharts')
    },
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
    series: [
        {
            label: {
                show: true,
                position: 'top'
            },
            type: 'bar',
            itemStyle: {
                borderRadius: 7,
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


    for (let i = 0; i < props.data.length; i++) {
        chartOption.value.xAxis[0].data.push(props.data[i].tag)
        chartOption.value.series[0].data.push(props.data[i].count)
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