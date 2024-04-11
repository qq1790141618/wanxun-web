<template>
    <t-radio-group v-model="view" variant="default-filled" style="margin-bottom: 10px;">
        <t-radio-button value="chart"><t-icon name="chart-line-data-1"></t-icon></t-radio-button>
        <t-radio-button value="table"><t-icon name="table"></t-icon></t-radio-button>
    </t-radio-group>
    <div
    ref="primaryChart"
    v-show="view == 'chart'"
    class="cas-chart"
    ></div>
    <t-table
    v-if="primaryData && primaryData.length > 0"
    v-show="view == 'table'"
    :bordered="false"
    :data="primaryData"
    :columns="columns"
    :max-height="550"
    style="max-width: 800px; margin: 20px auto;"
    :sort="sortValue"
    @sort-change="(val) => {
        sortValue = val
        primaryData = sort(val, primaryData, sortDefault)
    }"
    show-sort-column-bg-color
    row-key="time"
    ></t-table>
</template>

<script>
import { sort } from '../../../../hooks'
import * as echarts from 'echarts'
import {getString} from "../../../../i18n/index.js";

export default {
    props: ['data'],
    setup(props){
        
        const primaryData = ref([])
        const view = ref('chart')
        const sortValue = ref(null)
        const sortDefault = { sortBy: 'time', descending: false }
        const columns = [
            {
                title: getString('time'),
                colKey: 'time',
                ellipsis: true,
                tooltip: true,
                align: 'center'
            },
            {
                title: getString('salesCount'),
                colKey: 'salesCount',
                align: 'center',
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('salesAmount'),
                colKey: 'salesAmount',
                align: 'center',
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('refundsCount'),
                colKey: 'refundsCount',
                align: 'center',
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('refundsAmount'),
                colKey: 'refundsAmount',
                align: 'center',
                sortType: 'all',
                sorter: true
            }
        ]
        let chart
        const primaryChart = ref(null)
        const chartOptions = ref({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [
                    getString('salesAmount'),
                    getString('refundsAmount'),
                    getString('income')
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
                    name: getString('salesAmount'),
                    data: [],
                    showSymbol: false,
                    smooth: true,
                    color: '#F98981'
                },
                {
                    type: 'line',
                    name: getString('refundsAmount'),
                    data: [],
                    showSymbol: false,
                    smooth: true,
                    color: '#7BE188',
                    sortType: 'all',
                    sorter: true
                },
                {
                    type: 'line',
                    name: getString('income'),
                    data: [],
                    showSymbol: false,
                    smooth: true,
                    color: '#FADC6D',
                    sortType: 'all',
                    sorter: true
                }
            ]
        })
        const initChart = () => {
            if(!props.data){
                return
            }
            primaryData.value = props.data

            for (let i = 0; i < props.data.length; i++) {
                chartOptions.value.xAxis.data.push(props.data[i].time)
                chartOptions.value.series[0].data.push(props.data[i].salesAmount)
                chartOptions.value.series[1].data.push(props.data[i].refundsAmount)
                chartOptions.value.series[2].data.push(props.data[i].income)
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
            primaryData,
            view,
            sort,
            sortValue,
            sortDefault,
            columns,
            chart,
            primaryChart
        }
    }
}
</script>

<style>

</style>