<template>
    <t-table
        size="small"
        :data="data"
        :columns="columns"
        max-height="calc(64vh - 230px)"
        @sort-change="(val) => {
            sortValue = val
            data = sort(val, primaryData, { sortBy: 'salesCount', descending: true })
        }"
        :sort="sortValue"
    >
        <template #styleNumber="{ row }">
            <t-link @click="miaostreetGoodsLink(row)" theme="primary" style="font-size: 13px;">{{ row.styleNumber }}</t-link>
        </template>
    </t-table>
</template>

<script setup>
import { miaostreetGoodsLink } from '../../../hooks'
import { getString } from "../../../i18n/index.js"

const props = defineProps({
    data: {
        type: Array,
        required: true
    }
})

const i18n = inject('i18n')
const sortValue = ref(null)

const primaryData = ref([])
const columns = ref([
    {
        colKey: 'styleNumber',
        title: getString('stylenumber'),
        align: 'center',
        sorter: true
    },
    {
        colKey: 'id',
        title: getString('miaostreet-id'),
        align: 'center',
        sorter: true
    },
    {
        colKey: 'name',
        title: getString('name'),
        align: 'center',
        ellipsis: true,
        tooltip: true,
        width: 360,
        sorter: true
    },
    {
        colKey: 'salesCount',
        title: getString('salesCount'),
        align: 'center',
        sorter: true
    },
    {
        colKey: 'salesAmount',
        title: getString('salesAmount'),
        align: 'center',
        sorter: true
    },
    {
        colKey: 'refundsCount',
        title: getString('refundsCount'),
        align: 'center',
        sorter: true
    },
    {
        colKey: 'refundsAmount',
        title: getString('refundsAmount'),
        align: 'center',
        sorter: true
    },
    {
        colKey: 'realSaleCount',
        title: getString('actualSalesCount'),
        align: 'center',
        sorter: true
    }
])


</script>

<style>

</style>