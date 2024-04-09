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
import service from "../../api/service.js";
import {tips} from "../../hooks/tips.js";
import {MessagePlugin} from "tdesign-vue-next";

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

        const visible = ref(false)
        const loading = ref(false)
        const data = ref({
            from: null,
            to: null,
            onlyStore: true
        })
        const done = async () => {
            if(data.value.to === null || data.value.to === ''){
                MessagePlugin.error(i18n.supplierMapToEmpty[i18n.language])
                return
            }
            if(data.value.from === null || data.value.from === ''){
                let confirm = DialogPlugin.confirm({
                    header: i18n.tip[i18n.language],
                    body: i18n.tip2[i18n.language],
                    okText: i18n.confirm[i18n.language],
                    cancelText: i18n.cancel[i18n.language],
                    onConfirm: async () => {
                        confirm.hide()

                        loading.value = true
                        let res1 = await service.api.goods.supplierMap(null, data.value.to, data.value.onlyStore)
                        let res2 = await service.api.goods.supplierMap('', data.value.to, data.value.onlyStore)
                        let count = 0

                        if(res1.result){
                            count += res1.vol
                        } else {
                            tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
                        }
                        if(res2.result){
                            count += res2.vol
                        } else {
                            tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
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
                let res = await service.api.goods.supplierMap(data.value.from, data.value.to, data.value.onlyStore)
                if(res.result){
                    await MessagePlugin.success(i18n.batchEdited(res.vol)[i18n.language])
                    emit('reload')
                } else {
                    tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
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