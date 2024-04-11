<template>
    <t-radio-group v-model="view" variant="default-filled" style="margin-bottom: 10px;">
        <t-radio-button value="chart"><t-icon name="chart-ring-1"></t-icon></t-radio-button>
        <t-radio-button value="table"><t-icon name="table"></t-icon></t-radio-button>
    </t-radio-group>
    <div
    ref="primaryChart"
    v-show="view === 'chart'"
    class="cas-chart"
    ></div>
    <t-table
    v-if="primaryData && primaryData.length > 0"
    v-show="view === 'table'"
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
    :show-sort-column-bg-color="true"
    :foot-data="footData"
    row-key="name"
    ></t-table>
</template>

<script setup>
import { sort } from '../../../../hooks'
import * as echarts from 'echarts'
import {getString} from "../../../../i18n/index.js"

const props = defineProps(['data'])

const primaryData = ref([])
const view = ref('chart')
const sortValue = ref(null)
const sortDefault = { sortBy: 'salesCount', descending: true }
const footData = ref([])
const columns = [
    {
        title: getString('category'),
        colKey: 'name',
        ellipsis: true,
        tooltip: true,
        width: 200,
        align: 'center'
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
            if(row['proportion']){
                return Math.round(row['proportion'] * 10000) / 100 + '%'
            }
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
            if(row['afterSalesRate']){
                return Math.round(row['afterSalesRate'] * 10000) / 100 + '%'
            }
        },
        sortType: 'all',
        sorter: true
    },
    {
        title: getString('CUP'),
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
        show: false,
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            type: 'sunburst',
            label: {
                show: false
            },
            radius: [0, '90%'],
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 1
            },
            data: []
        }
    ]
})
const addThirdValue = (num, first_menu_index, second_menu_index, third_menu) => {
    if(chartOptions.value.series[0].data[first_menu_index].children[second_menu_index].children && chartOptions.value.series[0].data[first_menu_index].children[second_menu_index].children.length > 0){
        for (let i = 0; i < chartOptions.value.series[0].data[first_menu_index].children[second_menu_index].children.length; i++) {
            if(chartOptions.value.series[0].data[first_menu_index].children[second_menu_index].children[i].name === third_menu){
                chartOptions.value.series[0].data[first_menu_index].children[second_menu_index].children[i].value += num

                return Promise.resolve()
            } else if(i === chartOptions.value.series[0].data[first_menu_index].children[second_menu_index].children.length - 1){
                chartOptions.value.series[0].data[first_menu_index].children[second_menu_index].children.push({
                    name: third_menu,
                    value: num
                })

                return Promise.resolve()
            }
        }
    } else {
        chartOptions.value.series[0].data[first_menu_index].children[second_menu_index].children = [{
            name: third_menu,
            value: num
        }]

        return Promise.resolve()
    }
}
const addSecondValue = (num, first_menu_index, second_menu, third_menu) => {
    if(chartOptions.value.series[0].data[first_menu_index].children && chartOptions.value.series[0].data[first_menu_index].children.length > 0){
        for (let i = 0; i < chartOptions.value.series[0].data[first_menu_index].children.length; i++) {
            if(chartOptions.value.series[0].data[first_menu_index].children[i].name === second_menu){
                chartOptions.value.series[0].data[first_menu_index].children[i].value += num

                if(third_menu){
                    return Promise.resolve(addThirdValue(num, first_menu_index, i, third_menu))
                }
            } else if(i === chartOptions.value.series[0].data[first_menu_index].children.length - 1){
                chartOptions.value.series[0].data[first_menu_index].children.push({
                    name: second_menu,
                    value: num
                })

                if(third_menu){
                    return Promise.resolve(addThirdValue(num, first_menu_index, chartOptions.value.series[0].data[first_menu_index].children.length - 1, third_menu))
                }
            }
        }
    } else {
        chartOptions.value.series[0].data[first_menu_index].children = [{
            name: second_menu,
            value: num
        }]

        if(third_menu){
            return Promise.resolve(addThirdValue(num, first_menu_index, 0, third_menu))
        }
    }
}
const addFirstValue = (num, first_menu, second_menu, third_menu) => {
    if(chartOptions.value.series[0].data.length > 0){
        for (let r = 0; r < chartOptions.value.series[0].data.length; r++) {
            if(chartOptions.value.series[0].data[r].name === first_menu){
                return Promise.resolve(addSecondValue(num, r, second_menu, third_menu))
            } else if (r === chartOptions.value.series[0].data.length - 1){
                chartOptions.value.series[0].data.push({
                    name: first_menu
                })

                return Promise.resolve(addSecondValue(num, chartOptions.value.series[0].data.length - 1, second_menu, third_menu))
            }
        }
    } else {
        chartOptions.value.series[0].data.push({
            name: first_menu
        })

        return Promise.resolve(addSecondValue(num, 0, second_menu, third_menu))
    }
}
const initChart = async () => {
    if(!props.data){
        return
    }

    let category = props.data
    let labels = []
    let datas = []
    let foo = {
        name: getString('summary')
    }

    for (let i = 0; i < category.length; i++) {
        let name = category[i].name || 'Unknow'
        labels.push(name)
        datas.push(category[i].salesCount)

        for (const key in category[i]) {
            if(typeof(category[i][key] * 1) === 'number' && !isNaN(category[i][key] * 1) && key !== 'name' && key !== 'afterSalesRate' && key !== 'proportion' && key !== 'CUP'){
                if(!foo[key]){
                    foo[key] = category[i][key] * 1
                } else {
                    foo[key] += category[i][key] * 1
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

    for (let i = 0; i < labels.length; i++) {
        let label = labels[i].split('->')
        await addFirstValue(datas[i], label[0], label[1], label[2])
    }
    footData.value = [
        foo
    ]

    primaryData.value = props.data

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
</script>

<style>

</style>