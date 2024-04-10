<template>
    <t-card :bordered="false">
        <template #title>
            <img :src="shop.brandOptions.filter(item => item.value === shop.brand)[0].logo" height="20"  alt="">
        </template>
        <template #actions>
            {{ dayjs().subtract(1, 'day').format('YYYY-MM-DD') }}
        </template>
        <t-alert v-if="data['salesCount'] === 0 && data['refundsCount'] === 0" :message="i18n['salesDataOfYetNotUpload'][i18n.language]" >
            <template #operation>
                <span @click="$router.push('/import')">{{ i18n['upload'][i18n.language] }}</span>
            </template>
        </t-alert>
        <div class="day-sales" v-if="data['salesCount'] !== 0 || data['refundsCount'] !== 0">
            <t-statistic
            v-for="(item, index) in matchData"
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

<script setup>
import dayjs from 'dayjs'

const i18n = inject('i18n')
const shop = inject('shop')
const matchData = ref([])

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const initData = () => {
    if(!props.data){
        return
    }

    matchData.value = []
    matchData.value.push({
        title: i18n.salesCount[i18n.language],
        value: props.data['salesCount'],
        unit: i18n.piece[i18n.language]
    })
    matchData.value.push({
        title: i18n.salesAmount[i18n.language],
        value: props.data['salesAmount'],
        unit: i18n.yuan[i18n.language]
    })
    matchData.value.push({
        title: i18n.refundsCount[i18n.language],
        value: props.data['refundsCount'],
        unit: i18n.piece[i18n.language]
    })
    matchData.value.push({
        title: i18n.refundsAmount[i18n.language],
        value: props.data['refundsAmount'],
        unit: i18n.yuan[i18n.language]
    })
    matchData.value.push({
        title: i18n.actualSalesAmount[i18n.language],
        value: Math.round((props.data['salesAmount'] - props.data['refundsAmount']) * 100) / 100,
        unit: i18n.yuan[i18n.language]
    })
    matchData.value.push({
        title: i18n.income[i18n.language],
        value: props.data['income'],
        unit: i18n.yuan[i18n.language]
    })
}

watch(() => i18n.language, () => {
    initData()
})

onMounted(() => {
    initData()
})
</script>

<style>
.day-sales{
    display: flex;
    padding: 20px 5%;
}
.day-sales .t-statistic{
    flex: 1;
}
</style>