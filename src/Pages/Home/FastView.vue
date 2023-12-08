<template>
    <t-card :bordered="false">
        <template #title>
            <img :src="shop.brandOptions.filter(item => item.value === shop.brand)[0].logo" height="20" >
        </template>
        <template #actions>
            {{ dayjs().subtract(1, 'day').format('YYYY-MM-DD') }}
        </template>
        <t-alert v-if="data.sales.count == 0 && data.refunds.count == 0" >
            {{ i18n.unUpload[i18n.language] }}
            <template #operation>
                <span @click="$router.push('/import')">{{ i18n.upload[i18n.language] }}</span>
            </template>
        </t-alert>
        <div class="day-sales" v-if="data.sales.count != 0 || data.refunds.count != 0">
            <t-statistic
            v-for="item, index in computData"
            :key="index"
            :animation-start="true"
            :animation="{ duration: 2, valueFrom: 0 }"
            :title="item.title"
            :value="item.value"
            :unit="item.unit"
            />
        </div>
    </t-card>
</template>

<script>
import dayjs from 'dayjs'

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup(props){
        const i18n = inject('i18n')
        const shop = inject('shop')
        const computData = ref([])

        const initData = () => {
            if(!props.data){
                return
            }

            computData.value = []
            computData.value.push({
                title: i18n.salesCount[i18n.language],
                value: props.data.sales.count,
                unit: i18n.piece[i18n.language]
            })
            computData.value.push({
                title: i18n.salesAmount[i18n.language],
                value: props.data.sales.amount,
                unit: i18n.yuan[i18n.language]
            })
            computData.value.push({
                title: i18n.refundsCount[i18n.language],
                value: props.data.refunds.count,
                unit: i18n.piece[i18n.language]
            })
            computData.value.push({
                title: i18n.refundsAmount[i18n.language],
                value: props.data.refunds.amount,
                unit: i18n.yuan[i18n.language]
            })
            computData.value.push({
                title: i18n.actualSalesAmount[i18n.language],
                value: Math.round((props.data.sales.amount - props.data.refunds.amount) * 100) / 100,
                unit: i18n.yuan[i18n.language]
            })
            computData.value.push({
                title: i18n.income[i18n.language],
                value: Math.round((props.data.sales.income - props.data.refunds.income) * 100) / 100,
                unit: i18n.yuan[i18n.language]
            })
        }

        watch(() => i18n.language, () => {
            initData()
        })

        onMounted(() => {
            initData()
        })

        return {
            i18n,
            shop,
            dayjs,
            computData
        }
    }
}
</script>

<style>
.day-sales{
    display: flex;
    padding: 20px 5%;
}
.day-sales .t-statistic{
    flex: 1;
    flex-grow: 1;
}
</style>