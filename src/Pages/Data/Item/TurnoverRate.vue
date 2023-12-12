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
                text: i18n.comprehensiveTurnoverRate[i18n.language]
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
                        borderWidth: 0
                    },
                    label: {
                        show: true,
                        formatter(param) {
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
            let saled = 0
            let nosale = 0
            for (let i = 0; i < chartData.length; i++) {
                if(!chartData[i]['already-saled-stylenumber']){
                    chartData[i]['already-saled-stylenumber'] = 0
                }
                saled += chartData[i]['already-saled-stylenumber']
                nosale += chartData[i]['stylenumber'] - chartData[i]['already-saled-stylenumber']
            }

            chartOption.value.series[0].data.push({
                name: i18n.salesAvailable[i18n.language],
                itemStyle: {
                    color: '#37A2DA'
                },
                value: saled
            })
            chartOption.value.series[0].data.push({
                name: i18n.noSales[i18n.language],
                itemStyle: {
                    color: '#dedede'
                },
                value: nosale
            })

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