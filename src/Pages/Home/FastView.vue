<template>
    <t-card :bordered="false">
        <template #title>
            <img :src="shop.brandOptions.filter(item => item.id === shop.brand)[0].logo" height="20"  alt="">
        </template>
        <template #actions>
            {{ dayjs().subtract(1, 'day').format('YYYY-MM-DD') }}
        </template>
        <t-alert v-if="data['salesCount'] === 0 && data['refundsCount'] === 0" :message="getString('salesDataOfYetNotUpload')" >
            <template #operation>
                <span @click="$router.push('/import')">{{ getString('upload') }}</span>
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
import {getString} from "../../i18n/index.js";

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
        title: getString('salesCount'),
        value: props.data['salesCount'],
        unit: getString('piece')
    })
    matchData.value.push({
        title: getString('salesAmount'),
        value: props.data['salesAmount'],
        unit: getString('yuan')
    })
    matchData.value.push({
        title: getString('refundsCount'),
        value: props.data['refundsCount'],
        unit: getString('piece')
    })
    matchData.value.push({
        title: getString('refundsAmount'),
        value: props.data['refundsAmount'],
        unit: getString('yuan')
    })
    matchData.value.push({
        title: getString('actualSalesAmount'),
        value: Math.round((props.data['salesAmount'] - props.data['refundsAmount']) * 100) / 100,
        unit: getString('yuan')
    })
    matchData.value.push({
        title: getString('income'),
        value: props.data['income'],
        unit: getString('yuan')
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