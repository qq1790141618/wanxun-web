<template>
    <t-radio-group v-model="view" variant="default-filled" style="margin-bottom: 10px;">
        <t-radio-button value="chart-tree"><t-icon name="component-layout"></t-icon></t-radio-button>
        <t-radio-button value="chart-pie"><t-icon name="chart-pie"></t-icon></t-radio-button>
        <t-radio-button value="table"><t-icon name="table"></t-icon></t-radio-button>
    </t-radio-group>
    <SupplierTreeMap
    :data="data"
    v-if="view == 'chart-tree'"
    />
    <SupplierRing
    :data="data"
    v-if="view == 'chart-pie'"
    />
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
import SupplierTreeMap from './SupplierTreeMap.vue'
import SupplierRing from './SupplierRing.vue'
import {getString} from "../../../../i18n/index.js";

export default {
    components: {
        SupplierTreeMap,
        SupplierRing
    },
    props: ['data', 'tabId'],
    setup(props){
        
        const primaryData = ref([])
        const view = ref('chart-tree')
        const sortValue = ref(null)
        const sortDefault = { sortBy: 'salesCount', descending: true }
        const footData = ref([])
        const columns = [
            {
                title: getString('supplier'),
                colKey: 'name',
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
                    if(row.proportion){
                        return Math.round(row.proportion * 10000) / 100 + '%'
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
                    if(row.afterSalesRate){
                        return Math.round(row.afterSalesRate * 10000) / 100 + '%'
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
        const initChart = async () => {
            if(!props.data){
                return
            }

            primaryData.value = props.data
            let foo = {
                name: getString('summary')
            }

            for (let i = 0; i < props.data.length; i++) {
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
            footData
        }
    }
}
</script>

<style>

</style>