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
    ></t-table>
</template>

<script>
import { sort } from '../../../hooks'

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
        const columns = ref([
            {
                title: i18n.category[i18n.language],
                colKey: 'category',
                width: 150
            },
            {
                title: i18n.styleCount[i18n.language],
                colKey: 'stylenumber',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.ratio[i18n.language],
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
                title: i18n.productCount[i18n.language],
                colKey: 'productnumber',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.barcode[i18n.language] + i18n.count[i18n.language],
                colKey: 'barcode',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.quantityOfDynamicSalesStyles[i18n.language],
                colKey: 'already-saled-stylenumber',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.turnoverRate[i18n.language],
                colKey: 'turnover-rate',
                cell: (h, {row}) => {
                    if(row['turnover-rate']){
                        return Math.round(row['turnover-rate'] * 10000) / 100 + '%'
                    }
                },
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.salesCount[i18n.language],
                colKey: 'sales-count',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.salesAmount[i18n.language],
                colKey: 'sales-amount',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.refundsCount[i18n.language],
                colKey: 'after-sale-count',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.refundsAmount[i18n.language],
                colKey: 'after-sale-amount',
                sortType: 'all',
                sorter: true,
                width: 100
            },
            {
                title: i18n.salesCount[i18n.language] + ' ' + i18n.ratio[i18n.language],
                colKey: 'saled-stylenumber-rate',
                cell: (h, {row}) => {
                    if(row['saled-stylenumber-rate']){
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
            for (let i = 0; i < primaryData.value.length; i++) {
                for (const key in itemTemplate) {
                    if (!primaryData.value[i][key]) {
                        primaryData.value[i][key] = itemTemplate[key]
                    }
                }
            }
        }
        onMounted(() => {
            initData()
        })

        return {
            i18n,
            primaryData,
            columns,
            sort,
            sortValue
        }
    }
}
</script>

<style>

</style>