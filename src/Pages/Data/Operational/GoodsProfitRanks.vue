<template>
    <t-table
    size="small"
    :data="primaryData"
    :columns="columns"
    max-height="calc(100vh - 270px)"
    style="margin: 40px 0;"
    :sort="sortValue"
    @sort-change="(val) => {
        sortValue = val
        primaryData = sort(val, primaryData, { sortBy: 'actualSalesCount', descending: true  })
    }"
    show-sort-column-bg-color
    >
    </t-table>
</template>

<script>
import { sort, miaostreetGoodsLink } from '../../../hooks'

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup(props){
        const i18n = inject('i18n')
        const mode = ref('profit')

        const primaryData = ref([])
        const sortValue = ref(null)
        const columns = ref([
            {
                colKey: 'stylenumber',
                title: i18n.stylenumber[i18n.language],
                width: 100,
                align: 'center'
            },
            {
                colKey: 'actualSalesCount',
                title: i18n.actualSalesCount[i18n.language],
                width: 80,
                align: 'center'
            },
            {
                colKey: 'actualSalesAmount',
                title: i18n.actualSalesAmount[i18n.language],
                width: 80,
                align: 'center'
            },
            {
                colKey: 'profit',
                title: i18n.profit[i18n.language],
                width: 80,
                align: 'center'
            },
            {
                colKey: 'profitRatio',
                title: i18n.profit[i18n.language] + i18n.ratio[i18n.language],
                cell: (h, {row}) => {
                    if(row.profitRatio !== false){
                        if(row.profitRatio == -Infinity || row.profitRatio == Infinity){
                            return 0
                        }
                        return Math.round(row.profitRatio * 10000) / 100 + '%'
                    }
                },
                width: 80,
                align: 'center'
            }
        ])

        const initData = () => {
            if(!props.data){
                return
            }

            let chartData = props.data
            for (const key in chartData) {
                let list = chartData[key].data
                primaryData.value = list
                return
            }
        }
        onMounted(() => {
            initData()
        })

        return {
            i18n,
            mode,
            primaryData,
            columns,
            initData,
            miaostreetGoodsLink,
            sort,
            sortValue
        }
    }
}
</script>

<style>

</style>