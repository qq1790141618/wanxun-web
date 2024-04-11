<template>
    <t-card :bordered="false">
        <template #title>
            <span>
                <t-icon name="chart-bubble"></t-icon>
                <span style="vertical-align: middle; margin-left: 8px;">
                    {{ title }} {{ getString('rank') }}
                </span>
            </span>
            <t-tooltip :content="getString('tip0')">
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
        :show-sort-column-bg-color="true"
        height="450px"
        :row-key="colKey"
        ></t-table>
    </t-card>
</template>

<script>
import { sort } from '../../hooks'
import {getString} from "../../i18n/index.js";

export default {
    methods: {getString},
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
                title: getString('salesCount'),
                colKey: 'salesCount',
                sortType: 'all',
                sorter: true,
                width: 100,
                align: 'center'
            },
            {
                title: getString('salesAmount'),
                colKey: 'salesAmount',
                sortType: 'all',
                sorter: true,
                width: 100,
                align: 'center'
            },
            {
                title: getString('refundsCount'),
                colKey: 'refundsCount',
                sortType: 'all',
                sorter: true,
                width: 100,
                align: 'center'
            },
            {
                title: getString('refundsAmount'),
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
            primaryData,
            sortValue
        }
    }
}
</script>

<style>

</style>