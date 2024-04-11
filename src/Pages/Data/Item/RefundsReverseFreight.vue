<template>
    <t-list split v-if="data">
        <t-list-item>
            <span>{{ getString('reverseFreight') }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('allRefundsCount') }}</span>
            <span>{{ data.allRefundsCount }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('allRefundsFreight') }}</span>
            <span>{{ data.allRefundsFreight }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('allSalesCount') }}</span>
            <span>{{ data.allSalesCount }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ getString('aveShipBorneSales') }}</span>
            <span>{{ data.aveShipBorneSales }}</span>
        </t-list-item>
    </t-list>
</template>

<script>
import {getString} from "../../../i18n/index.js";

export default {
    methods: {getString},
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup() {
        const i18n = inject('i18n')

        return {
            i18n
        }
    }
}
</script>

<style>

</style>