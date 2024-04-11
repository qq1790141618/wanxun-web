<template>
    <t-radio-group
    size="small"
    v-model="mode"
    variant="default-filled"
    style="margin-bottom: 10px;"
    @change="initData"
    >
        <t-radio-button value="salesCount">
            {{ getString('salesCount') }}
        </t-radio-button>
        <t-radio-button value="actualSalesCount">
            {{ getString('actualSalesCount') }}
        </t-radio-button>
    </t-radio-group>
    <t-table
    size="small"
    :data="primaryData"
    :columns="columns"
    max-height="calc(64vh - 260px)"
    >
        <template #stylenumber="{ row }">
            <t-link @click="miaostreetGoodsLink(row)" theme="primary" style="font-size: 13px;">{{ row.stylenumber }}</t-link>
        </template>
    </t-table>
</template>

<script>
import { sort, miaostreetGoodsLink } from '../../../hooks'
import {getString} from "../../../i18n/index.js";

export default {
    methods: {getString},
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup(props){
        const i18n = inject('i18n')
        const mode = ref('salesCount')

        const primaryData = ref([])
        const columns = ref([
            {
                colKey: 'stylenumber',
                title: getString('stylenumber'),
                width: 100,
                align: 'center'
            },
            {
                colKey: 'category',
                title: getString('category'),
                ellipsis: true,
                tooltip: true,
                width: 120,
                align: 'center'
            },
            {
                colKey: 'salesCount',
                title: getString('salesCount'),
                width: 80,
                align: 'center'
            },
            {
                colKey: 'salesAmount',
                title: getString('salesAmount'),
                width: 80,
                align: 'center'
            },
            {
                colKey: 'actualSalesCount',
                title: getString('actualSalesCount'),
                width: 80,
                align: 'center'
            }
        ])

        const initData = (sortBy) => {
            if(!props.data){
                return
            }

            let temp = JSON.parse(JSON.stringify(props.data))
            let chartData = sort({
                sortBy,
                descending: true
            }, temp)
            primaryData.value = chartData.splice(0, 30)
        }
        onMounted(() => {
            initData(mode.value)
        })

        return {
            i18n,
            mode,
            primaryData,
            columns,
            initData,
            miaostreetGoodsLink
        }
    }
}
</script>

<style>

</style>