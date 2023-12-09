<template>
    <div
    ref="chartEl"
    style="width: 100%; height: calc(100vh - 310px);"
    ></div>
</template>

<script>
import * as echarts from 'echarts'

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
            tooltip: {
                trigger: 'item'
            },
            legend: {
                data: [
                    i18n.styleCount[i18n.language],
                    i18n.actualSalesCount[i18n.language]
                ]
            },
            radar: {
                indicator: []
            },
            series: [
                {
                    name: '',
                    type: 'radar',
                    data: [
                        {
                            value: [],
                            name: i18n.styleCount[i18n.language]
                        },
                        {
                            value: [],
                            name: i18n.actualSalesCount[i18n.language]
                        }
                    ]
                }
            ]
        })
        let chart

        const initChart = async () => {
            if(!props.data){
                return
            }

            let chartData = props.data
            let other = i18n.other[i18n.language]
            let maxRadar = 6

            for (let i = 0; i < chartData.length; i++) {
                let a = chartData[i].stylenumber
                let b = chartData[i]['sales-count'] ? (chartData[i]['sales-count'] - chartData[i]['after-sale-count']) : 0

                if(i < maxRadar - 1){
                    chartOption.value.radar.indicator.push({
                        name: chartData[i].category
                    })
                    chartOption.value.series[0].data[0].value.push(a)
                    chartOption.value.series[0].data[1].value.push(b)
                } else {
                    chartOption.value.radar.indicator[maxRadar - 1] = {
                        name: other
                    }
                    chartOption.value.series[0].data[0].value[maxRadar - 1] = chartOption.value.series[0].data[0].value[maxRadar - 1] ? chartOption.value.series[0].data[0].value[maxRadar - 1] + a : a
                    chartOption.value.series[0].data[1].value[maxRadar - 1] = chartOption.value.series[0].data[1].value[maxRadar - 1] ? chartOption.value.series[0].data[1].value[maxRadar - 1] + b : b
                }
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