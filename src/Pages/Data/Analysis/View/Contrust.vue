<template>
    <t-row :gutter="[20, 20]" style="padding: 30px;">
        <t-col
            v-for="(item, index) in group"
            :key="index"
            :span="4"
        >
            <ContrustItem :yet="yet" :base="base" :color="item.color" :dkey="item.key" :title="item.title" />
        </t-col>
    </t-row>
</template>

<script>
import ContrustItem from './ContrustItem.vue'

export default {
    components: {
        ContrustItem
    },
    props: ['yet', 'base'],
    setup(){
        const group = ref([
            {
                color: '#F9CC45',
                key: 'salesAmount',
                title: 'salesAmount'
            },
            {
                color: '#23C343',
                key: 'salesCount',
                title: 'salesCount'
            },
            {
                color: '#F76560',
                key: 'refundsAmount',
                title: 'refundsAmount'
            },
            {
                color: '#FAAC7B',
                key: 'refundsCount',
                title: 'refundsCount'
            },
            {
                color: '#E13EDB',
                key: 'realSaleAmount',
                title: 'actualSalesAmount'
            },
            {
                color: '#165DFF',
                key: 'income',
                title: 'income'
            }
        ])

        return {
            group
        }
    }
}
</script>

<style>

</style>