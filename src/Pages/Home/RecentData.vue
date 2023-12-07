<template>
    <t-card :bordered="false" style="margin-top: 12px;">
        <template #title>
            <t-icon name="chart"></t-icon>
            <span style="vertical-align: middle; margin-left: 8px;">
                {{ i18n.recentData[i18n.language] }}
            </span>
        </template>
        <div ref="mainChart" style="width: 100%; height: 450px;"></div>
    </t-card>
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
        const shop = inject('shop')
        let charts
        const mainChart = ref(null)

        const initData = () => {
            if(!props.data){
                return
            }

            let chartsData = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [
                        i18n.salesAmount[i18n.language],
                        i18n.refundsAmount[i18n.language],
                        i18n.income[i18n.language]
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
                        type: 'bar',
                        barMaxWidth: 30,
                        itemStyle: {
                            borderRadius: 5,
                        },
                        name: i18n.salesAmount[i18n.language],
                        data: [],
                        showSymbol: false,
                        smooth: true
                    },
                    {
                        type: 'bar',
                        barMaxWidth: 30,
                        itemStyle: {
                            borderRadius: 5,
                        },
                        name: i18n.refundsAmount[i18n.language],
                        data: [],
                        showSymbol: false,
                        smooth: true
                    },
                    {
                        type: 'line',
                        name: i18n.income[i18n.language],
                        data: [],
                        showSymbol: false,
                        smooth: true
                    }
                ]
            }

            let lin = props.data
            for (let i = 0; i < lin.length; i++) {
                chartsData.xAxis.data.push(lin[i].time)

                chartsData.series[0].data.push(lin[i].salesAmount)
                chartsData.series[1].data.push(lin[i].refundsAmount)
                chartsData.series[2].data.push(lin[i].income)
            }

            setTimeout(() => {
                charts = echarts.init(mainChart.value)
                mainChart.value.removeAttribute('_echarts_instance_')
                charts.clear()
                charts.setOption(chartsData)

                window.addEventListener("resize", function () {
                    charts.resize()
                })
            }, 100)
        }

        watch(() => i18n.language, () => {
            initData()
        })

        onActivated(() => {
            if(charts){
                charts.resize()
            }
        })
        onMounted(() => {
            initData()
        })

        return {
            i18n,
            shop,
            mainChart
        }
    }
}
</script>

<style>

</style>