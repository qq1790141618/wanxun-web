<template>
    <header class="header" >
        <t-button variant="text" @click="$router.push('/datas/analysis')">
            <template #icon>
                <t-icon name="chevron-left" />
            </template>
            {{ getString($route.meta.title) }}
        </t-button>
        <span v-if="parameter">
            <t-icon name="leaderboard" style="margin-right: 6px;" />
            {{ shop.storeOptions.filter(item => item.value === parameter.storeId)[0].label }}
            /
            {{ parameter.brand }}
            /
            {{ parameter.from }}
            -
            {{ parameter.to }}
        </span>
    </header>
    <t-tabs
    v-model="tabId"
    class="analysis-tab"
    v-if="data"
    >
        <t-tab-panel
        :value="1"
        :label="getString('summary')"
        destroy-on-hide
        v-if="data.summary"
        >
            <div class="analysis-view-item">
                <Summary :data="data.summary" />
            </div>
        </t-tab-panel>
        <t-tab-panel
        :value="2"
        :label="getString('trend')"
        destroy-on-hide
        v-if="data.trend"
        >
            <div class="analysis-view-item">
                <Trend :data="data.trend" />
            </div>
        </t-tab-panel>
        <t-tab-panel
        :value="3"
        :label="getString('time')"
        destroy-on-hide
        v-if="data.timepoint"
        >
            <div class="analysis-view-item">
                <TimePoint :data="data.timepoint" />
            </div>
        </t-tab-panel>
        <t-tab-panel
        :value="4"
        :label="getString('contrast')"
        destroy-on-hide
        v-if="data.summary && data.contrast"
        >
            <div class="analysis-view-item">
                <Contrust :base="data.summary" :yet="data.contrast" />
            </div>
        </t-tab-panel>
        <t-tab-panel
        :value="5"
        :label="getString('category')"
        destroy-on-hide
        v-if="data.category"
        >
            <div class="analysis-view-item">
                <Category :data="data.category" />
            </div>
        </t-tab-panel>
        <t-tab-panel
        :value="6"
        :label="getString('channel')"
        destroy-on-hide
        v-if="data.channel"
        >
            <div class="analysis-view-item">
                <Channel :data="data.channel" />
            </div>
        </t-tab-panel>
        <t-tab-panel
        :value="7"
        :label="getString('sex')"
        destroy-on-hide
        v-if="data.sex"
        >
            <div class="analysis-view-item">
                <Sex :data="data.sex" />
            </div>
        </t-tab-panel>
        <t-tab-panel
        :value="8"
        :label="getString('season')"
        destroy-on-hide
        v-if="data.season"
        >
            <div class="analysis-view-item">
                <Season :data="data.season" />
            </div>
        </t-tab-panel>
        <t-tab-panel
        :value="9"
        :label="getString('supplier')"
        destroy-on-hide
        v-if="data.supplier"
        >
            <div class="analysis-view-item">
                <Supplier :data="data.supplier" />
            </div>
        </t-tab-panel>
    </t-tabs>
</template>

<script>
import Summary from './Summary.vue'
import Trend from './Trend.vue'
import TimePoint from './TimePoint.vue'
import Contrust from './Contrust.vue'
import Category from './Category.vue'
import Channel from './Channel.vue'
import Sex from './Sex.vue'
import Season from './Season.vue'
import Supplier from './Supplier.vue'
import {useRouter} from "vue-router";
import {getString} from "../../../../i18n/index.js";

export default {
    methods: {getString},
    components: {
        Summary,
        Trend,
        TimePoint,
        Contrust,
        Category,
        Channel,
        Sex,
        Season,
        Supplier
    },
    setup(){
        const i18n = inject('i18n')
        const shop = inject('shop')
        const data = ref(false)
        const parameter = ref(false)
        const router = useRouter()
        const tabId = ref(1)

        const initData = () => {
            if(localStorage.getItem('view-task')){
                try {
                    let parse = ['parameter', 'summary', 'trend', 'contrast', 'supplier', 'category', 'sex', 'season', 'timepoint', 'channel']
                    let viewTask = JSON.parse(localStorage.getItem('view-task'))

                    data.value = new Object
                    for (let i = 0; i < parse.length; i++) {
                        data.value[parse[i]] = JSON.parse(viewTask[parse[i]])
                    }

                    parameter.value = data.value.parameter
                } catch (error) {
                    console.log(error)
                    router.push('/datas/analysis')
                }
            } else {
                router.push('/datas/analysis')
            }
        }

        onMounted(() => {
            initData()
        })

        return {
            i18n,
            shop,
            parameter,
            data,
            tabId
        }
    }
}
</script>

<style>
.analysis-tab{
    border-radius: 10px;
    width: 1500px;
    max-width: calc(100vw - 20px);
    margin: 10px auto;
    --chart-cas-margin-top-bottom: 50px;
}
.analysis-view-item{
    padding: 15px;
}
.cas-chart{
    height: 450px;
    margin: var(--chart-cas-margin-top-bottom) 0;
    width: 100%;
}
</style>