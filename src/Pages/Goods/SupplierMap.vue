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
            {{ getString('supplier') }}{{ getString('mapping') }}
        </template>
        <t-row :gutter="[12, 12]" style="width: 100%;">
            <t-col :span="6">
                <t-auto-complete
                    v-model="data.from"
                    :options="supplierOptions"
                    :input-props="{
                        label: getString('original') + getString('supplier') + ': '
                    }"
                    clearable
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="6">
                <t-auto-complete
                    v-model="data.to"
                    :options="supplierOptions"
                    :input-props="{
                        label: getString('target') + getString('supplier') + ': '
                    }"
                    clearable
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="12">
                <confirm-bar
                    :confirm-loading="loading"
                    @confirm="done"
                    @close="close"
                    @reset="data = {
                        from: null,
                        to: null
                    }"
                />
            </t-col>
        </t-row>
    </t-dialog>
</template>

<script setup>
import confirmBar from '../../components/confirmBar.vue'
import service from "../../api/service.js";
import {tips} from "../../hooks/tips.js";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
import {getString} from "../../i18n/index.js";
import {request} from "../../api/request.js";

const props = defineProps({
    supplierOptions: {
        type: Array,
        default: []
    }
})
const emit = defineEmits(['reload'])

const i18n = inject('i18n')
const shop = inject('shop')

const visible = ref(false)
const loading = ref(false)
const data = ref({
    from: null,
    to: null
})

const done = async () => {
    if(data.value.to === null || data.value.to === ''){
        MessagePlugin.error(getString('supplierMapToEmpty')).then()
        return
    }
    if (data.value.from === null) {
        data.value.from = ''
    }
    loading.value = true
    let res = await request('/product/supplier/mapping', {
        store: shop.store,
        brand: shop.brand,
        original: data.value.from,
        target: data.value.to
    })
    if(res.status === 'success'){
        await MessagePlugin.success(i18n.batchEdited(res.content['affect'])[i18n.language])
        emit('reload')
    } else {
        tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
    }

    close()
}
const close =  () => {
    loading.value = false
    visible.value = false
    data.value = {
        from: null,
        to: null
    }
}
const open = () => {
    visible.value = true
}

defineExpose({
    open
})
</script>

<style>

</style>