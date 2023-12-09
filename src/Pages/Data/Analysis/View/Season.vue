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
    :max-height="550"
    style="width: 100%; margin: 20px auto;"
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

export default {
    props: ['data'],
    setup(props){
        const i18n = inject('i18n')
        
        const primaryData = ref([])
        const view = ref('chart')
        const sortValue = ref(null)
        const sortDefault = { sortBy: 'salesCount', descending: true }
        const footData = ref([])
        const columns = [
            {
                title: i18n.season[i18n.language],
                colKey: 'name',
                ellipsis: true,
                tooltip: true,
                width: 200
            },
            {
                title: i18n.salesCount[i18n.language],
                colKey: 'salesCount',
                sortType: 'all',
                sorter: true
            },
            {
                title: i18n.ratio[i18n.language],
                colKey: 'proportion',
                cell: (h, {row}) => {
                    if(row.proportion){
                        return Math.round(row.proportion * 10000) / 100 + '%'
                    }
                },
                sortType: 'all',
                sorter: true
            },
            {
                title: i18n.salesAmount[i18n.language],
                colKey: 'salesAmount',
                sortType: 'all',
                sorter: true
            },
            {
                title: i18n.refundsCount[i18n.language],
                colKey: 'refundsCount',
                sortType: 'all',
                sorter: true
            },
            {
                title: i18n.refundsAmount[i18n.language],
                colKey: 'refundsAmount',
                sortType: 'all',
                sorter: true
            },
            {
                title: i18n.afterSalesRatio[i18n.language],
                colKey: 'afterSalesRate',
                cell: (h, {row}) => {
                    if(row.afterSalesRate){
                        return Math.round(row.proportion * 10000) / 100 + '%'
                    }
                },
                sortType: 'all',
                sorter: true
            },
            {
                title: i18n.CUP[i18n.language],
                colKey: 'CUP',
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
                    radius: ['50%', '90%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
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
        const initChart = async () => {
            if(!props.data){
                return
            }

            primaryData.value = props.data
            let foo = {
                name: i18n.summary[i18n.language]
            }

            for (let i = 0; i < props.data.length; i++) {
                chartOptions.value.series[0].data.push({
                    name: props.data[i].name,
                    value: props.data[i].salesCount
                })

                for (const key in props.data[i]) {
                    if(typeof(props.data[i][key] * 1) === 'number' && !isNaN(props.data[i][key] * 1) && key !== 'name' && key !== 'afterSalesRate' && key !== 'proportion' && key !== 'CUP'){
                        if(!foo[key]){
                            foo[key] = props.data[i][key] * 1
                        } else {
                            foo[key] += props.data[i][key] * 1
                        }
                        foo[key] = Math.round(foo[key])
                    } else if(key === 'afterSalesRate'){
                        foo[key] = Math.round(foo['refundsCount'] / foo['salesCount'] * 10000) / 100 + '%'
                    } else if(key === 'CUP'){
                        foo[key] = Math.round(foo['salesAmount'] / foo['salesCount'])
                    } else if(key === 'proportion'){
                        foo[key] = '100%'
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