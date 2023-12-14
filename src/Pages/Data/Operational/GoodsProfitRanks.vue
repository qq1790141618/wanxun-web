<template>
    <t-table
    size="small"
    :data="primaryData"
    :columns="columns"
    max-height="calc(100vh - 270px)"
    style="margin: 40px 0;"
    :foot-data="footData"
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
        const footData = ref([])
        const sortValue = ref(null)
        const columns = ref([
            {
                colKey: 'stylenumber',
                title: i18n.stylenumber[i18n.language],
                width: 100
            },
            {
                colKey: 'actualSalesCount',
                title: i18n.actualSalesCount[i18n.language],
                width: 80
            },
            {
                colKey: 'actualSalesAmount',
                title: i18n.actualSalesAmount[i18n.language],
                width: 80
            },
            {
                colKey: 'income',
                title: i18n.income[i18n.language],
                width: 80
            },
            {
                colKey: 'profit',
                title: i18n.profit[i18n.language],
                width: 80
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
                width: 80
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
                footData.value[0] = { stylenumber: i18n.summary[i18n.language] }
                for (let i = 0; i < primaryData.value.length; i++) {
                    for (const key in primaryData.value[i]) {
                        if(key !== 'profitRatio' && typeof(primaryData.value[i][key]) === 'number' && !isNaN(primaryData.value[i][key])){
                            if(!footData.value[0][key]){
                                footData.value[0][key] = 0
                            }
                            footData.value[0][key] += primaryData.value[i][key]
                            footData.value[0][key] = Math.round(footData.value[0][key] * 100) / 100 
                        }
                    }
                }
                footData.value[0].profitRatio = footData.value[0].profit == 0 ? 0 : footData.value[0].profit / footData.value[0].actualSalesAmount
                footData.value[0].profitRatio = Math.round(footData.value[0].profitRatio * 10000) / 100 + '%'

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
            sortValue,
            footData
        }
    }
}
</script>

<style>

</style>