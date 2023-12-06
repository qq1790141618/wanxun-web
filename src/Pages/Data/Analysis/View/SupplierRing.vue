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
                trigger: 'item',
                formatter: function (info) {
                    if(info.componentIndex == 0){
                        return info.name + ' ' + info.value + '件'
                    }
                    if(info.componentIndex == 1){
                        return info.name + ' ' + info.value + '元'
                    }
                }
            },
            legend: {
                show: false,
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    type: 'pie',
                    label: {
                        show: false
                    },
                    radius: '55%',
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: []
                },
                {
                    type: 'pie',
                    label: {
                        show: false
                    },
                    radius: ['60%', '80%'],
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
                chartOptions.value.series[1].data.push({
                    name: props.data[i].name,
                    value: props.data[i].salesAmount
                })
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