<template>
    <t-radio-group v-model="view" variant="default-filled" style="margin-bottom: 10px;">
        <t-radio-button value="chart"><t-icon name="chart-ring"></t-icon></t-radio-button>
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
        class="cas-table"
        max-height="calc(100vh - 360px)"
        :sort="sortValue"
        @sort-change="(val) => {
            sortValue = val
            primaryData = sort(val, primaryData, sortDefault)
        }"
        show-sort-column-bg-color
        :foot-data="footData"
        row-key="name"
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
        const sortDefault = { sortBy: 'salesCount', descending: true }
        const footData = ref([])
        const columns = [
            {
                title: getString('season'),
                colKey: 'season',
                ellipsis: true,
                tooltip: true,
                width: 200
            },
            {
                title: getString('salesCount'),
                colKey: 'salesCount',
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('ratio'),
                colKey: 'proportion',
                cell: (h, {row}) => {
                    return Math.round(row['ratio'] * 10000) / 100 + '%'
                },
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('salesAmount'),
                colKey: 'salesAmount',
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('refundsCount'),
                colKey: 'refundsCount',
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('refundsAmount'),
                colKey: 'refundsAmount',
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('afterSalesRatio'),
                colKey: 'afterSalesRate',
                cell: (h, {row}) => {
                    return Math.round(row['afterSaleRatio'] * 10000) / 100 + '%'
                },
                sortType: 'all',
                sorter: true
            },
            {
                title: getString('CUP'),
                colKey: 'customerUnitPrice',
                sortType: 'all',
                sorter: true
            }
        ]
        let chart
        const primaryChart = ref(null)
        const chartOptions = ref({
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    type: 'pie',
                    radius: ['45%', '80%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        formatter: '{name|{b}}\n{count|{c} 件}',
                        lineHeight: 15,
                        rich: {
                            name: {
                                fontSize: 14,
                            },
                            count: {
                                fontSize: 13,
                                color: '#999'
                            }
                        },
                        show: true
                    },
                    emphasis: {
                        scale: false
                    },
                    labelLine: {
                        length: 30,
                        length2: 120,
                        show: true
                    },
                    data: []
                }
            ]
        })
        const initChart = async () => {
            if(!props.data){
                return
            }

            primaryData.value = props.data
            let foo = {
                name: getString('summary')
            }

            for (let i = 0; i < props.data.length; i++) {
                chartOptions.value.series[0].data.push({
                    name: props.data[i].season,
                    value: props.data[i].salesCount
                })

                for (const key in props.data[i]) {
                    if(typeof(props.data[i][key] * 1) === 'number' && !isNaN(props.data[i][key] * 1) && key !== 'name' && key !== 'afterSaleRatio' && key !== 'ratio' && key !== 'customerUnitPrice'){
                        if(!foo[key]){
                            foo[key] = props.data[i][key] * 1
                        } else {
                            foo[key] += props.data[i][key] * 1
                        }
                        foo[key] = Math.round(foo[key])
                    } else if(key === 'afterSaleRatio'){
                        foo[key] = Math.round(foo['refundsCount'] / foo['salesCount'] * 10000) / 100
                    } else if(key === 'customerUnitPrice'){
                        foo[key] = Math.round(foo['salesAmount'] / foo['salesCount'])
                    } else if(key === 'ratio'){
                        foo[key] = 1
                    }
                }
            }
            footData.value = [
                foo
            ]

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
            primaryChart,
            footData
        }
    }
}
</script>

<style>

</style>