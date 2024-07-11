<template>
    <div
        ref="chartEl"
        class="chart"
    >
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import {getString} from "../../../i18n/index.js";

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
        text: getString('comprehensivePriceRange') + ' / ' + getString('piece')
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
            radius: ['42%', '80%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 0,
                borderWidth: 0
            },
            label: {
                alignTo: 'edge',
                formatter: '{name|{b}}\n{count|{c} 件}',
                minMargin: 5,
                edgeDistance: 10,
                lineHeight: 15,
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
                length: 10,
                length2: 0,
                maxSurfaceAngle: 80
            },
            labelLayout: function (params) {
                const isLeft = params.labelRect.x < chart.getWidth() / 2
                const points = params.labelLinePoints
                points[2][0] = isLeft
                    ? params.labelRect.x
                    : params.labelRect.x + params.labelRect.width
                return {
                    labelLinePoints: points
                }
            },
            data: []
        }
    ]
})
const initChart = () => {
    if(!props.data){
        return
    }

    let chartData = props.data
    let pd = {}
    for (let i = 0; i < chartData.length; i++) {
        let average = Math.round(chartData[i].salesAmount / chartData[i].salesCount * 200) / 200
        let minAva = Math.floor(average / 200) * 200
        if(!pd[minAva]){
            pd[minAva] = 0
        }
        pd[minAva] += chartData[i].salesCount
    }
    chartOption.value.series[0].data = []
    for (const key in pd) {
        if (key % 200 !== 0) continue
        let name = key + '~' + (key * 1 + 200) + getString('yuan')
        chartOption.value.series[0].data.push({
            name,
            value: pd[key]
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