<template>
    <div style="padding: 20px 15px;">
        <span v-if="title" style="padding: 0 5px;">
            {{ getString(title) }}
        </span>
        <div
        style="width: 100%; height: 260px;"
        ref="primaryChart"
        >
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import {getString} from "../../../../i18n/index.js"

const props = defineProps(['base', 'yet', 'color', 'dkey', 'title'])
let chart
const primaryChart = ref(null)
const options = ref({
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: [
            getString('thisCycle'),
            getString('comparisonCycle')
        ]
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: ''
                }
            },
            axisPointer: {
                label: {
                    formatter: function (params) {
                        return params.value
                    }
                }
            },
            data: []
        },
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: ''
                }
            },
            axisPointer: {
                label: {
                    formatter: function (params) {
                        return params.value
                    }
                }
            },
            data: []
        }
    ],
    yAxis: {
        type: 'value'
    },
    series: [
        {
            xAxisIndex: 1,
            type: 'line',
            data: [],
            showSymbol: false,
            smooth: true
        },
        {
            xAxisIndex: 0,
            type: 'line',
            data: [],
            showSymbol: false,
            smooth: true
        }
    ]
})

const intChart = () => {
    if(!props.base || !props.yet || !props.dkey){
        return
    }

    if(props.color){
        options.value.series[0].color = props.color + '40'
        options.value.series[1].color = props.color
    }

    for (let i = 0; i < props.base.length; i++) {
        options.value.xAxis[0].data.push(props.base[i].time)
        options.value.series[1].data.push(props.base[i][props.dkey])
    }

    for (let i = 0; i < props.yet.length; i++) {
        options.value.xAxis[1].data.push(props.yet[i].time)
        options.value.series[0].data.push(props.yet[i][props.dkey])
    }

    chart = echarts.init(primaryChart.value)
    primaryChart.value.removeAttribute('_echarts_instance_')
    chart.clear()
    chart.setOption(options.value)

    window.addEventListener("resize", function () {
        chart.resize()
    })
}

onMounted(() => {
    intChart()
})
</script>

<style>

</style>