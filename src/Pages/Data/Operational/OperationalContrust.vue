<template>
    <div
    ref="chartEl"
    class="chart"
    >
    </div>
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
            title: {
                left: 'center',
                text: i18n.recentBusinessComparison[i18n.language] + ' / ' + i18n.yuan[i18n.language]
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                bottom: 0,
                data: [
                    i18n.income[i18n.language],
                    i18n.profit[i18n.language]
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
                    name: i18n.income[i18n.language],
                    data: [],
                    showSymbol: true,
                    smooth: false
                },
                {
                    type: 'line',
                    name: i18n.profit[i18n.language],
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
                let list = chartData[key].data
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

            chartOption.value.xAxis.data.reverse()
            chartOption.value.series[0].data.reverse()
            chartOption.value.series[1].data.reverse()

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