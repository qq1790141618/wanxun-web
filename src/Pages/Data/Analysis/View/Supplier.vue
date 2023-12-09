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

export default {
    components: {
        SupplierTreeMap,
        SupplierRing
    },
    props: ['data', 'tabId'],
    setup(props){
        const i18n = inject('i18n')
        
        const primaryData = ref([])
        const view = ref('chart-tree')
        const sortValue = ref(null)
        const sortDefault = { sortBy: 'salesCount', descending: true }
        const footData = ref([])
        const columns = [
            {
                title: i18n.supplier[i18n.language],
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
        const initChart = async () => {
            if(!props.data){
                return
            }

            primaryData.value = props.data
            let foo = {
                name: i18n.summary[i18n.language]
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