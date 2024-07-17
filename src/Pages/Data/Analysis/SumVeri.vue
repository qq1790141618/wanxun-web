<template>
    <t-list
        size="small"
        :split="true"
        v-if="data"
        class="sum-veri"
        style="width: 360px; margin: 6vh auto;"
    >
        <t-list-item>
            <span>{{ getString('menus') }}</span>
            <span>{{ getString('value') }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('salesCount') }}</span>
            <span>{{ getSummary('salesCount') }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('salesAmount') }}</span>
            <span>{{ getSummary('salesAmount') }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('refundsCount') }}</span>
            <span>{{ getSummary('refundsCount') }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('refundsAmount') }}</span>
            <span>{{ getSummary('refundsAmount') }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('actualSalesAmount') }}</span>
            <span>{{ getSummary('realSaleAmount') }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('income') }}</span>
            <span>{{ getSummary('income') }}</span>
        </t-list-item>
    </t-list>
</template>

<script setup>
import { getString } from "../../../i18n/index.js"

const props = defineProps({
    data: {
        type: Array,
        required: true
    }
})
const getSummary = (property) => {
    return parseFloat((props.data.reduce((acc, item) => acc + item[property], 0)).toFixed(2))
}
</script>

<style>
.sum-veri .t-list__inner li:first-child {
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: 5px;
}
.sum-veri .t-list__inner li:first-child::after {
    background: transparent;
}
</style>