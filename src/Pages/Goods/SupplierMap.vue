<template>
    <t-dialog
    :close-btn="false"
    v-model:visible="visible"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :footer="false"
    width="600px"
    attach="#goods-list"
    show-in-attached-element
    >
        <template #header>
            <t-icon name="arrow-up-down-2" style="margin-right: 5px;" />
            {{ i18n.supplier[i18n.language] }}{{ i18n.mapping[i18n.language] }}
        </template>
        <t-row :gutter="[12, 12]" style="width: 100%;">
            <t-col :span="6">
                <t-auto-complete
                v-model="data.from"
                :options="supplierOptions.map(obj => obj.value)"
                :input-props="{
                    label: i18n.original[i18n.language] + i18n.supplier[i18n.language] + ': '
                }"
                clearable
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="6">
                <t-auto-complete
                v-model="data.to"
                :options="supplierOptions.map(obj => obj.value)"
                :input-props="{
                    label: i18n.target[i18n.language] + i18n.supplier[i18n.language] + ': '
                }"
                clearable
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="12">
                <t-checkbox v-model="data.onlyStore">
                    {{ i18n.onlyStore[i18n.language] }}
                </t-checkbox>
            </t-col>
            <t-col :span="12">
                <confirm-bar
                :confirm-loading="loading"
                @confirm="done"
                @close="close"
                @reset="data = {
                    from: null,
                    to: null,
                    onlyStore: true
                }"
                />
            </t-col>
        </t-row>
    </t-dialog>
</template>

<script>
import confirmBar from '../../components/confirmBar.vue'

export default {
    components: {
        confirmBar
    },
    props: {
        supplierOptions: {
            type: Array,
            default: []
        }
    },
    emits: ['reload'],
    setup(props, { emit }){
        const i18n = inject('i18n')
        const shop = inject('shop')
        const serve = inject('serve')

        const visible = ref(false)
        const loading = ref(false)
        const data = ref({
            from: null,
            to: null,
            onlyStore: true
        })
        const uploadData = async (from, to, brand) => {
            let url = serve + '/goods/supplier/map?from=' + from + '&to=' + to + '&brand=' + brand
            if(data.value.onlyStore){
                url += '&store=' + shop.store
            }

            return fetch(url)
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const done = async () => {
            if(data.value.to === null || data.value.to === ''){
                MessagePlugin.error(i18n.supplierMapToEmpty[i18n.language])
                return
            }
            if(data.value.from === null || data.value.from === ''){
                let confirm = DialogPlugin.confirm({
                    title: i18n.tip[i18n.language],
                    content: i18n.tip2[i18n.language],
                    okText: i18n.confirm[i18n.language],
                    cancelText: i18n.cancel[i18n.language],
                    onConfirm: async () => {
                        confirm.hide()

                        loading.value = true
                        let res1 = await uploadData(null, data.value.to, shop.brand)
                        let res2 = await uploadData('', data.value.to, shop.brand)
                        let count = 0

                        if(res1.result){
                            count += res1.vol
                        }
                        if(res2.result){
                            count += res2.vol
                        }

                        MessagePlugin.success(i18n.batchEdited(count)[i18n.language])
                        close()
                        if(res1.result || res2.result){
                            emit('reload')
                        }

                        confirm.destroy()
                    },
                    onCancel: () => {
                        confirm.destroy()
                        close()
                    }
                })
            } else {
                loading.value = true
                let res = await uploadData(data.value.from, data.value.to, shop.brand)
                if(res.result){
                    MessagePlugin.success(i18n.batchEdited(res.vol)[i18n.language])
                    emit('reload')
                } else {
                    MessagePlugin.info(i18n.batchEdited(0)[i18n.language])
                }

                close()
            }
        }
        const close =  () => {
            loading.value = false
            visible.value = false
            data.value = {
                from: null,
                to: null,
                onlyStore: true
            }
        }
        const open = () => {
            visible.value = true
        }

        return {
            i18n,
            data,
            shop,
            loading,
            visible,
            done,
            close,
            open
        }
    }
}
</script>

<style>

</style>