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
const chartOption = ref({
    title: {
        left: 'center',
        text: getString('recentBusinessComparison') + ' / ' + getString('yuan')
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        bottom: 0,
        data: [
            getString('income'),
            getString('profit')
        ]
    },
    xAxis: {
        type: 'category',
        nameLocation: 'middle',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            type: 'line',
            name: getString('income'),
            data: [],
            showSymbol: true,
            smooth: false
        },
        {
            type: 'line',
            name: getString('profit'),
            data: [],
            showSymbol: true,
            smooth: false
        },
    ]
})
let chart

const initChart = () => {
    if(!props.data){
        return
    }

    let chartData = props.data
    for (const key in chartData) {
        let list = chartData[key]
        let profit = 0, income = 0

        for (let i = 0; i < list.length; i++) {
            profit += list[i].profit
            income += list[i].income
        }

        profit = Math.round(profit * 100) / 100
        income = Math.round(income * 100) / 100

        chartOption.value.xAxis.data.push(key)
        chartOption.value.series[0].data.push(income)
        chartOption.value.series[1].data.push(profit)
    }

    for (let i = 0; i < chartOption.value.xAxis.data.length; i++) {
        let a = chartOption.value.xAxis.data[i]
        for (let j = i + 1; j < chartOption.value.xAxis.data.length; j++) {
            let b = chartOption.value.xAxis.data[j]
            if (a > b) {
                let t1 = chartOption.value.xAxis.data[i]
                chartOption.value.xAxis.data[i] = chartOption.value.xAxis.data[j]
                chartOption.value.xAxis.data[j] = t1

                let t2 = chartOption.value.series[0].data[i]
                chartOption.value.series[0].data[i] = chartOption.value.series[0].data[j]
                chartOption.value.series[0].data[j] = t2

                let t3 = chartOption.value.series[1].data[i]
                chartOption.value.series[1].data[i] = chartOption.value.series[1].data[j]
                chartOption.value.series[1].data[j] = t3
            }
        }
    }

    setTimeout(() => {
        chart = echarts.init(chartEl.value)
        chartEl.value.removeAttribute('_echarts_instance_')
        chart.clear()
        chart.setOption(chartOption.value)

        window.addEventListener("resize", function () {
            chart.resize()
        })
    }, 100)
}

onMounted(initChart)
</script>

<style>

</style>