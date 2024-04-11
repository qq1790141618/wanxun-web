<template>
    <div
    ref="chartEl"
    class="chart"
    >
    </div>
</template>

<script>
import * as echarts from 'echarts'
import {getString} from "../../../i18n/index.js";

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup(props){
        const i18n = inject('i18n')
        const chartEl = ref(null)
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
        let chart

        const initChart = () => {
            if(!props.data){
                return
            }

            let chartData = props.data
            let pd = {}
            for (let i = 0; i < chartData.length; i++) {
                let average = Math.round(chartData[i].salesAmount / chartData[i].salesCount * 100) / 100
                let minAva = Math.floor(average / 100) * 100
                if(!pd[minAva]){
                    pd[minAva] = 0
                }
                pd[minAva]++
            }
            for (const key in pd) {
                chartOption.value.series[0].data.push({
                    name: key + '~' + (key * 1 + 100) + getString('yuan'),
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
        onMounted(() => {
            initChart()
        })

        return {
            chartEl
        }
    }
}
</script>

<style>

</style>