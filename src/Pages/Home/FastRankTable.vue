<template>
    <t-card :bordered="false">
        <template #title>
            <span>
                <t-icon name="chart-bubble"></t-icon>
                <span style="vertical-align: middle; margin-left: 8px;">
                    {{ title }} {{ i18n.rank[i18n.language] }}
                </span>
            </span>
            <t-tooltip :content="i18n.tip0[i18n.language]">
                <t-icon name="help-circle" :style="{
                    color: '#aaa',
                    cursor: 'pointer',
                    marginLeft: '8px'
                }"/>
            </t-tooltip>
        </template>
        <t-table
        size="small"
        :key="primaryData"
        :data="primaryData"
        :columns="columns"
        :bordered="false"
        @sort-change="(val) => {
            sortValue = val
            data = sort(val, primaryData, { sortBy: 'salesCount', descending: true })
        }"
        :sort="sortValue"
        show-sort-column-bg-color
        height="450px"
        :row-key="colKey"
        ></t-table>
    </t-card>
</template>

<script>
import { sort } from '../../hooks'

export default {
    props: {
        data: {
            type: Object,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        colKey: {
            type: String,
            required: true
        }
    },
    setup(props){
        const i18n = inject('i18n')
        const shop = inject('shop')

        const columns = ref([
            {
                title: props.title,
                colKey: props.colKey,
                width: 100,
                ellipsis: true,
                tooltip: true,
                align: 'center'
            },
            {
                title: i18n.salesCount[i18n.language],
                colKey: 'salesCount',
                sortType: 'all',
                sorter: true,
                width: 100,
                align: 'center'
            },
            {
                title: i18n.salesAmount[i18n.language],
                colKey: 'salesAmount',
                sortType: 'all',
                sorter: true,
                width: 100,
                align: 'center'
            },
            {
                title: i18n.refundsCount[i18n.language],
                colKey: 'refundsCount',
                sortType: 'all',
                sorter: true,
                width: 100,
                align: 'center'
            },
            {
                title: i18n.refundsAmount[i18n.language],
                colKey: 'refundsAmount',
                sortType: 'all',
                sorter: true,
                width: 100,
                align: 'center'
            }
        ])
        const primaryData = ref([])
        const sortValue = ref(null)

        const initData = () => {
            if(!props.data){
                return
            }
            primaryData.value = props.data
        }
        onMounted(() => {
            initData()
        })

        return {
            i18n,
            shop,
            sort,
            columns,
            primaryData
        }
    }
}
</script>

<style>

</style>