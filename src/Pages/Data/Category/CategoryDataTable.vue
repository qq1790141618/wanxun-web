<template>
    <t-table
    size="small"
    :columns="columns"
    :data="primaryData"
    max-height="calc(100vh - 310px)"
    :pagination="false"
    @sort-change="(val) => {
        sortValue = val
        primaryData = sort(val, primaryData, { sortBy: 'stylenumber', descending: true })
    }"
    :sort="sortValue"
    show-sort-column-bg-color
    :foot-data="footData"
    ></t-table>
</template>

<script>
import { sort } from '../../../hooks'
import {getString} from "../../../i18n/index.js";

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup(props){
        const i18n = inject('i18n')

        const primaryData = ref([])
        const footData = ref([])
        const columns = ref([
            {
                title: getString('category'),
                colKey: 'category',
                ellipsis: true,
                tooltip: true,
                width: 150
            },
            {
                title: getString('styleCount'),
                colKey: 'stylenumber',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('ratio'),
                colKey: 'stylenumber-proportion',
                cell: (h, {row}) => {
                    if(row['stylenumber-proportion']){
                        return Math.round(row['stylenumber-proportion'] * 10000) / 100 + '%'
                    }
                },
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('productCount'),
                colKey: 'productnumber',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('barcode') + getString('count'),
                colKey: 'barcode',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('quantityOfDynamicSalesStyles'),
                colKey: 'already-saled-stylenumber',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('turnoverRate'),
                colKey: 'turnover-rate',
                cell: (h, {row}) => {
                    if(row['turnover-rate'] !== false){
                        return Math.round(row['turnover-rate'] * 10000) / 100 + '%'
                    }
                },
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('salesCount'),
                colKey: 'sales-count',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('salesAmount'),
                colKey: 'sales-amount',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('refundsCount'),
                colKey: 'after-sale-count',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('refundsAmount'),
                colKey: 'after-sale-amount',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: getString('salesCount') + ' ' + getString('ratio'),
                colKey: 'saled-stylenumber-rate',
                cell: (h, {row}) => {
                    if(row['saled-stylenumber-rate'] !== false){
                        return Math.round(row['saled-stylenumber-rate'] * 10000) / 100 + '%'
                    }
                },
                sortType: 'all',
                sorter: true,
                width: 100
            }
        ])
        const sortValue = ref(null)

        const itemTemplate = {
            category: '',
            stylenumber: 0,
            productnumber: 0,
            barcode: 0,
            'sales-count': 0,
            'sales-amount': 0,
            'after-sale-count': 0,
            'after-sale-amount': 0,
            'already-saled-stylenumber': 0,
            'turnover-rate': 0,
            'stylenumber-proportion': 0,
            'saled-stylenumber-rate': 0,
            'need-style': true
        }
        const initData = () => {
            if(!props.data){
                return
            }

            primaryData.value = props.data
            footData.value = [{
                category: getString('summary'),
                stylenumber: 0,
                productnumber: 0,
                barcode: 0,
                'sales-count': 0,
                'sales-amount': 0,
                'after-sale-count': 0,
                'after-sale-amount': 0,
                'already-saled-stylenumber': 0,
                'turnover-rate': 0,
                'stylenumber-proportion': 0,
                'saled-stylenumber-rate': 0,
                'need-style': true
            }]

            for (let i = 0; i < primaryData.value.length; i++) {
                for (const key in itemTemplate) {
                    if (!primaryData.value[i][key]) {
                        primaryData.value[i][key] = itemTemplate[key]
                    }

                    if(key !== 'category'){
                        footData.value[0][key] += primaryData.value[i][key]
                    }
                }
            }

            footData.value[0]['stylenumber-proportion'] = '100%'
            footData.value[0]['saled-stylenumber-rate'] = '100%'
            footData.value[0]['turnover-rate'] = Math.round(footData.value[0]['already-saled-stylenumber'] / footData.value[0]['stylenumber'] * 10000) / 100 + '%'
        }
        onMounted(() => {
            initData()
        })

        return {
            i18n,
            primaryData,
            columns,
            sort,
            sortValue,
            footData
        }
    }
}
</script>

<style>

</style>