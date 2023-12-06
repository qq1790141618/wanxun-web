<template>
    <div
    ref="primaryChart"
    class="cas-chart"
    ></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    props: ['data'],
    setup(props){
        const i18n = inject('i18n')

        let chart
        const primaryChart = ref(null)
        const chartOptions = ref({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [
                    i18n.salesAmount[i18n.language],
                    i18n.refundsAmount[i18n.language]
                ]
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                nameLocation: 'middle',
                boundaryGap: false,
                data: []
            },
            series: [
                {
                    type: 'bar',
                    name: i18n.salesAmount[i18n.language],
                    data: [],
                    itemStyle: {
                        borderRadius: 5,
                        borderColor: '#fff'
                    },
                    showSymbol: false,
                    smooth: true
                },
                {
                    type: 'bar',
                    name: i18n.refundsAmount[i18n.language],
                    data: [],
                    itemStyle: {
                        borderRadius: 5,
                        borderColor: '#fff'
                    },
                    showSymbol: false,
                    smooth: true
                }
            ]
        })
        
        const initChart = () => {
            if(!props.data){
                return
            }

            for (let i = 0; i < props.data.length; i++) {
                chartOptions.value.yAxis.data.push(props.data[i].time)
                chartOptions.value.series[0].data.push(props.data[i].salesAmount)
                chartOptions.value.series[1].data.push(props.data[i].refundsAmount)
            }
            chart = echarts.init(primaryChart.value)
            primaryChart.value.removeAttribute('_echarts_instance_')
            chart.clear()
            chart.setOption(chartOptions.value)

            window.addEventListener("resize", function () {
                chart.resize()
            })
        }

        onMounted(() => {
            initChart()
        })

        return {
            chart,
            primaryChart
        }
    }
}
</script>

<style>

</style>