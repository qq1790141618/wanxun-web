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
    list: {
        type: Array,
        required: true
    }
})

const chartEl = ref(null)
const chartOption = ref({
    title: {
        left: 'center',
        text: getString('profit') + getString('ratio')
    },
    legend: {
        show: false,
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            type: 'pie',
            radius: ['36%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderWidth: 0
            },
            label: {
                show: true,
                formatter(param) {
                    if(param.name === getString('profit') + getString('ratio'))
                        return param.name + ' (' + param.percent + '%)'
                }
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
let chart

const initChart = () => {
    if(!props.list){
        return
    }

    let profit = 0, realSaleAmount = 0
    let list = props.list
    for (let i = 0; i < list.length; i++) {
        profit += list[i].profit
        realSaleAmount += list[i].realSaleAmount
    }

    profit = Math.round(profit * 100) / 100
    realSaleAmount = Math.round(realSaleAmount * 100) / 100
    let t = Math.round((realSaleAmount - profit) * 100) / 100

    chartOption.value.series[0].data.push({
        name: getString('profit') + getString('ratio'),
        itemStyle: {
            color: '#37A2DA'
        },
        value: profit
    })
    chartOption.value.series[0].data.push({
        name: '',
        itemStyle: {
            color: '#dedede'
        },
        value: t
    })

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