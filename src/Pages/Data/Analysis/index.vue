<template>
    <div class="datas-analysis">
        <t-dialog
        :visible="true"
        mode="modeless"
        :draggable="true"
        class="create-analysis"
        attach="datas-analysis"
        :show-in-attached-element="true"
        :footer="false"
        :close-btn="false"
        style="user-select: none;"
        >
            <template #header>
                <div style="font-size: 16px;">
                    <t-image
                    :src="$route.meta.avatar"
                    style="width: 32px; margin-right: 6px; background-color: transparent; display: inline-block;"
                    >
                    </t-image>
                    <span>
                        {{ getString($route.meta.title) }}
                    </span>
                </div>
            </template>
            <t-space
            direction="vertical"
            class="create-analysis-input"
            v-if="current === 1"
            >
                <div style="font-size: 14px;">
                    <t-icon name="shop-5" />
                    <span style="margin-left: 5px;">
                        {{ getString('choose') }}{{ getString('counter') }}
                    </span>
                    <t-button
                    v-if="lastTime"
                    @click="$router.push('/data/analysis-view')"
                    shape="square"
                    variant="text"
                    size="small"
                    >
                        <template #icon>
                            <t-icon name="history" />
                        </template>
                    </t-button>
                </div>
                <t-select
                :label="getString('store') + ': '"
                v-model="create.store"
                :options="shop.storeOptions"
                ></t-select>
                <t-select
                :label="getString('brand') + ': '"
                v-model="create.brand"
                :options="shop.brandOptions"
                ></t-select>
                <t-date-range-picker
                v-model="create.date"
                :presets="quickDateRangePicker"
                >
                    <template #prefix-icon>
                        <div style="width: 100%; text-align: right;" >
                            {{ getString('time') + ': ' }}
                        </div>
                    </template>
                </t-date-range-picker>
                <t-button
                :loading="create.loading"
                @click="create.confirm"
                shape="round"
                :block="true"
                >
                    {{ getString('nextStep') }}
                </t-button>
            </t-space>
            <div v-if="current === 2" style="padding: 20px 0;">
                <t-progress
                theme="circle"
                :percentage="create.percent"
                style="margin: 0 auto; width: 112px;"
                />
                <div style="text-align: center; margin: 6px;">
                    {{ getString('tip4') }}...
                </div>
            </div>
            <div v-if="current === 3" style="padding: 20px 0;">
                {{ getString('tip5') }}!
            </div>
        </t-dialog>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { getQuickDateRangePicker } from '../../../hooks'
import {MessagePlugin} from "tdesign-vue-next";
import {useRouter} from "vue-router";
import service from "../../../api/service.js";
import {tips} from "../../../hooks/tips.js";
import {getString} from "../../../i18n/index.js";

export default {
    methods: {getString},
    setup() {
        const shop = inject('shop')
        const i18n = inject('i18n')
        const router = useRouter()
        const current = ref(1)

        const create = reactive({
            store: 'HZ13',
            brand: '兔皇',
            date: [
                dayjs().subtract(8, 'day').format('YYYY-MM-DD'),
                dayjs().subtract(1, 'day').format('YYYY-MM-DD')
            ],
            initialization: () => {
                create.store = shop.store
                create.brand = shop.brand
            },
            loading: false,
            percent: 0,
            confirm: async () => {
                create.loading = true
                let task = await service.api.analysis.createTask(create.date)
                if(!task.result){
                    tips(task.error.message, 'error')
                    create.loading = false
                    return
                }

                create.loading = false
                current.value++

                let id = task.content.id
                service.api.analysis.startTask()

                let timer = setInterval(async () => {
                    let t = await service.api.analysis.queryProgress(id)
                    task = t.data
                    create.percent = Math.round(task.progress * 100)

                    if(task.progress === 1){
                        clearInterval(timer)
                        current.value++
                        localStorage.setItem('view-task', JSON.stringify(task))

                        await MessagePlugin.success(getString('tip5') + '! ' + getString('tip6') + '.')
                        setTimeout(() => {
                            router.push('/data/analysis-view')
                            create.initialization()
                            current.value = 1
                        }, 1000)
                    }
                }, 1500)
            }
        })
        const lastTime = ref(false)
        const quickDateRangePicker = ref({})

        onMounted(async () => {
            create.initialization()
            if(localStorage.getItem('view-task')){
                lastTime.value = true
            }

            quickDateRangePicker.value = await getQuickDateRangePicker(i18n.language)
        })
        watch(() => i18n.language,  async (newValue) => {
            quickDateRangePicker.value = await getQuickDateRangePicker(newValue)
        })

        return {
            shop,
            i18n,
            create,
            current,
            lastTime,
            quickDateRangePicker
        }
    }
}
</script>

<style>
.datas-analysis{
    width: 100%;
    height: 60vh;
}
.create-analysis{
    width: 520px;
    text-align: center;
}
.create-analysis-input{
    width: 100%;
    padding: 20px;
}
.create-analysis-input .t-input{
    border-radius: 16px;
    padding: 6px 20px;
}
.create-analysis-input .t-range-input .t-input{
    padding: 3px;
}
.create-analysis-input .t-range-input{
    border-radius: 16px;
}
.create-analysis-input .t-range-input__prefix{
    width: 120px;
}
</style>