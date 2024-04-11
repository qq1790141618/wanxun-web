<template>
    <div
    ref="primaryChart"
    class="cas-chart"
    ></div>
</template>

<script>
import * as echarts from 'echarts'
import {getString} from "../../../../i18n/index.js";

export default {
    props: ['data'],
    setup(props){
        let chart
        let amount = new Object
        const primaryChart = ref(null)
        const chartOptions = ref({
            tooltip: {
                formatter: function (info) {
                    return info.name + ' - ' + info.value + ' ' + getString('piece') + ' / ' + amount[info.name] + ' ' + getString('yuan')
                }
            },
            series: [
                {
                    type: 'treemap',
                    label: {
                        show: true
                    },
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: []
                }
            ]
        })

        const initChart = async () => {
            if(!props.data){
                return
            }

            for (let i = 0; i < props.data.length; i++) {
                chartOptions.value.series[0].data.push({
                    name: props.data[i].name,
                    value: props.data[i].salesCount
                })
                amount[props.data[i].name] = props.data[i].salesAmount
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