<template>
    <t-list
        size="small"
        :split="true"
        v-if="data"
        class="refunds-freight"
    >
        <t-list-item>
            <span>{{ getString('reverseFreight') }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('allRefundsCount') }}</span>
            <span>{{ data.undertaken }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('allRefundsFreight') }}</span>
            <span>{{ data.undertakenAmount }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('allSalesCount') }}</span>
            <span>{{ data.realSaleCount }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('aveShipBorneSales') }}</span>
            <span>{{ data.avgUndertakenAmount }}</span>
        </t-list-item>
    </t-list>
</template>

<script setup>
import { getString } from "../../../i18n/index.js"

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
</script>

<style>
.refunds-freight .t-list__inner li:first-child {
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: 5px;
}
.refunds-freight .t-list__inner li:first-child::after {
    background: transparent;
}
</style>