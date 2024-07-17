<template>
    <div
        ref="chartEl"
        class="chart"
    >
    </div>
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
let chart
const chartOption = ref({
    title: {
        left: 'center',
        text: getString('refundReasonRatio')
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        show: false,
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            type: 'pie',
            radius: [0, '80%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 0,
                borderWidth: 0
            },
            label: {
                rich: {
                    count: {
                        fontSize: 10,
                        color: '#999'
                    }
                },
                show: true
            },
            emphasis: {
                scale: false
            },
            labelLine: {
                show: true,
            },
            data: []
        }
    ]
})
const initChart = () => {
    if(!props.data){
        return
    }

    chartOption.value.series[0].data = []
    for (let i = 0; i < props.data.length; i++) {
        chartOption.value.series[0].data.push({
            name: props.data[i].name,
            value: props.data[i].count
        })
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