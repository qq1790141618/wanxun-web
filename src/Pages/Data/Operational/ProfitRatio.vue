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
                text: i18n.profit[i18n.language] + i18n.ratio[i18n.language]
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
                        borderWidth: 0
                    },
                    label: {
                        show: true,
                        formatter(param) {
                            if(param.name == i18n.profit[i18n.language] + i18n.ratio[i18n.language])
                                return param.name + ' (' + param.percent + '%)';
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
            if(!props.data){
                return
            }

            let chartData = props.data
            for (const key in chartData) {
                let list = chartData[key].data
                let profit = 0, actualSalesAmount = 0
                
                for (let i = 0; i < list.length; i++) {
                    profit += list[i].profit
                    actualSalesAmount += list[i].actualSalesAmount
                }

                profit = Math.round(profit * 100) / 100
                actualSalesAmount = Math.round(actualSalesAmount * 100) / 100
                let t = Math.round((actualSalesAmount - profit) * 100) / 100

                chartOption.value.series[0].data.push({
                    name: i18n.profit[i18n.language] + i18n.ratio[i18n.language],
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

                console.log(chartOption.value)
                chart = echarts.init(chartEl.value)
                chartEl.value.removeAttribute('_echarts_instance_')
                chart.clear()
                chart.setOption(chartOption.value)

                window.addEventListener("resize", function () {
                    chart.resize()
                })

                return
            }
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