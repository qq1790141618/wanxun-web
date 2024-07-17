<template>
    <div style="padding: 12px;" class="item-ana">
        <t-card
            :bordered="false"
            size="small"
            :header-bordered="true"
        >
            <template #header>
                <span>
                    {{ shop.storeOptions.find(item => item.id === shop.store).name }}
                    {{ shop.store }}
                    /
                    {{ shop.brandOptions.find(item => item.id === shop.brand).name }}
                    {{ shop.brand }}
                </span>
                <span>
                    <span style="margin-right: 6px;">
                        {{ getString('choose') }}{{ getString('time') }}:
                    </span>
                    <t-date-range-picker
                        size="small"
                        v-model="date"
                        :presets="quickDateRangePicker"
                        @change="matchData"
                    ></t-date-range-picker>
                    <t-button
                        size="small"
                        variant="outline"
                        :loading="loading"
                        @click="matchData"
                        style="margin-left: 6px;"
                    >
                        <template #icon>
                            <t-icon name="refresh" />
                        </template>
                        {{ getString('refresh') }}
                    </t-button>
                </span>
            </template>
            <t-loading
                v-if="loading"
                style="width: 100%; min-height: 50vh;"
                size="small"
                :text="getString('loading')"
            ></t-loading>
            <t-row
                :gutter="[18, 12]"
                style="width: 100%;"
                v-if="!loading"
            >
                <t-col :span="5">
                    <Reasons :data="data.reasons" />
                    <AppReasons :data="data.appReasons" />
                </t-col>
                <t-col :span="7">
                    <Tags :data="data.tags" />
                    <Notes :data="data.appReasons" />
                </t-col>
            </t-row>
        </t-card>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { getQuickDateRangePicker } from '../../../hooks'
import { tips } from "../../../hooks/tips.js"
import { getString } from "../../../i18n/index.js"
import { request } from "../../../api/request.js"
import Reasons from "./Reasons.vue"
import Tags from "./Tags.vue"
import AppReasons from "./AppReasons.vue"
import Notes from "./Notes.vue"

const i18n = inject('i18n')
const shop = inject('shop')

const date = ref([
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
])
const loading = ref(true)
const data = ref({
    appReasons: [],
    reasons: [],
    tags: []
})

const matchData = async () => {
    loading.value = true

    let d = await request('/analysis/refund-reason', {
        store: shop.store,
        brand: shop.brand,
        startTime: date.value[0] + ' 00:00:00',
        endTime: date.value[1] + ' 23:59:59'
    })
    if(d.status === 'success'){
        data.value = d.content
    } else {
        tips(d.error.msg, 'error')
    }

    loading.value = false
}

const quickDateRangePicker = ref({})
const initQuickDate = async (newValue) => {
    quickDateRangePicker.value = await getQuickDateRangePicker(newValue)
}
watch(() => i18n.language,  initQuickDate)
initQuickDate()

watch(() => shop.store, matchData)
watch(() => shop.brand, matchData)
onMounted(matchData)
</script>

<style>
.item-ana .t-anchor{
    background-color: transparent;
}
.item-ana .chart{
    width: 100%;
    height: 36vh;
    margin: 20px 12px;
}
</style>