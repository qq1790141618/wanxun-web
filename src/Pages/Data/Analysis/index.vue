<template>
    <div class="datas-analysis">
        <t-dialog
        visible
        mode="modeless"
        draggable
        class="create-analysis"
        attach="datas-analysis"
        show-in-attached-element
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
                        {{ i18n[$route.meta.title][i18n.language] }}
                    </span>
                </div>
            </template>
            <t-space
            direction="vertical"
            class="create-analysis-input"
            v-if="current == 1"
            >
                <div style="font-size: 14px;">
                    <t-icon name="shop-5" />
                    <span style="margin-left: 5px;">
                        {{ i18n.choose[i18n.language] }}{{ i18n.counter[i18n.language] }}
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
                :label="i18n.store[i18n.language] + ': '"
                v-model="create.store"
                :options="shop.storeOptions"
                ></t-select>
                <t-select
                :label="i18n.brand[i18n.language] + ': '"
                v-model="create.brand"
                :options="shop.brandOptions"
                ></t-select>
                <t-date-range-picker
                v-model="create.date"
                :presets="quickDateRangePicker"
                >
                    <template #prefix-icon>
                        <div style="width: 100%; text-align: right;" >
                            {{ i18n.time[i18n.language] + ': ' }}
                        </div>
                    </template>
                </t-date-range-picker>
                <t-button
                :loading="create.loading"
                @click="create.confirm"
                shape="round"
                block
                >
                    {{ i18n.nextStep[i18n.language] }}
                </t-button>
            </t-space>
            <div v-if="current == 2" style="padding: 20px 0;">
                <t-progress
                theme="circle"
                :percentage="create.percent"
                style="margin: 0 auto; width: 112px;"
                />
                <div style="text-align: center; margin: 6px;">
                    {{ i18n.tip4[i18n.language] }}...
                </div>
            </div>
            <div v-if="current == 3" style="padding: 20px 0;">
                {{ i18n.tip5[i18n.language] }}!
            </div>
        </t-dialog>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { getQuickDateRangePicker } from '../../../hooks'

export default {
    setup() {
        const serve = inject('serve')
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
            createTask: async () => {
                return fetch(serve + '/analysis/sales/create?store-id=' + create.store + '&brand=' + create.brand + '&date=' + JSON.stringify(create.date))
                .then(response => {
                    return Promise.resolve(response.json())
                })
                .catch(() => {
                    MessagePlugin.error(i18n.httpFail[i18n.language])
                })
            },
            startTask: () => {
                fetch(serve + '/analysis/sales/task')
                .then(response => {
                    return response.json()
                })
                .catch(() => {
                    MessagePlugin.error(i18n.httpFail[i18n.language])
                })
            },
            queryProgress: async (id) => {
                return fetch(serve + '/analysis/sales/task/result?id=' + id)
                .then(response => {
                    return Promise.resolve(response.json())
                })
                .catch(() => {
                    MessagePlugin.error(i18n.httpFail[i18n.language])
                })
            },
            confirm: async () => {
                create.loading = true
                let task = await create.createTask()
                create.loading = false
                current.value++

                let id = task.id
                create.startTask()

                let timer = setInterval(async () => {
                    let t = await create.queryProgress(id)
                    task = t.data
                    create.percent = Math.round(task.progress * 100)

                    if(task.progress == 1){
                        clearInterval(timer)
                        current.value++
                        localStorage.setItem('view-task', JSON.stringify(task))

                        MessagePlugin.success(i18n.tip5[i18n.language] + '! ' + i18n.tip6[i18n.language] + '.')
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