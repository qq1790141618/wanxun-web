<template>
    <t-list split v-if="data">
        <t-list-item>
            <span>{{ i18n.reverseFreight[i18n.language] }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ i18n.allRefundsCount[i18n.language] }}</span>
            <span>{{ data.allRefundsCount }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ i18n.allRefundsFreight[i18n.language] }}</span>
            <span>{{ data.allRefundsFreight }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ i18n.allSalesCount[i18n.language] }}</span>
            <span>{{ data.allSalesCount }}</span>
        </t-list-item>
        <t-list-item>
            <span>{{ i18n.aveShipBorneSales[i18n.language] }}</span>
            <span>{{ data.aveShipBorneSales }}</span>
        </t-list-item>
    </t-list>
</template>

<script>
export default {
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