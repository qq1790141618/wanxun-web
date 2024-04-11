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
                text: getString('categoryPriceRange') + ' / ' + getString('yuan')
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (info) {
                    let d = JSON.parse(JSON.stringify(info[0].data))
                    d.splice(0, 1)
                    return info[0].axisValue + ': ' + Math.min(...d) + '~' + Math.max(...d) + getString('yuan')
                }
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    show: true,
                    yAxisIndex: 0,
                    filterMode: 'empty',
                    width: 30,
                    height: '80%',
                    showDataShadow: false,
                    left: '93%'
                }
            ],
            series: [
                {
                    type: 'candlestick',
                    itemStyle: {
                        color: '#AFF0B5',
                        color0: '#AFF0B5',
                        borderColor: '#AFF0B5',
                        borderColor0: '#AFF0B5'
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
            for (let i = 0; i < chartData.length; i++) {
                if(!chartData[i].category){
                    continue
                }
                
                if(chartOption.value.xAxis.data.indexOf(chartData[i].category) === -1){
                    chartOption.value.xAxis.data.push(chartData[i].category)
                }
                let key = chartOption.value.xAxis.data.indexOf(chartData[i].category)
                if(!chartOption.value.series[0].data[key]){
                    chartOption.value.series[0].data[key] = []
                }

                let average = Math.round(chartData[i].salesAmount / chartData[i].salesCount * 100) / 100
                if(chartOption.value.series[0].data[key].indexOf(average) === -1){
                    chartOption.value.series[0].data[key].push(average)
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