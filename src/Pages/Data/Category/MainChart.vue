<template>
    <div
        ref="chartEl"
        style="width: 100%; height: calc(100vh - 330px);"
    ></div>
</template>

<script>
import * as echarts from 'echarts'
import { getString } from "../../../i18n/index.js"

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup(props){

        const chartEl = ref(null)
        const chartOption = ref({
            tooltip: {
                trigger: 'item'
            },
            legend: {
                data: [
                    getString('styleCount'),
                    getString('actualSalesCount')
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
                            name: getString('styleCount')
                        },
                        {
                            value: [],
                            name: getString('actualSalesCount')
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
            let other = getString('other')
            let maxRadar = 6

            for (let i = 0; i < chartData.length; i++) {
                let a = chartData[i].count
                let b = chartData[i].realSaleCount

                if(i < maxRadar - 1){
                    chartOption.value.radar.indicator.push({
                        name: chartData[i].shortName.split("/").join('\n') + '\n' + chartData[i].category
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