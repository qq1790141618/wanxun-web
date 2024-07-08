<template>
    <t-dialog
    v-model:visible="show"
    header="订单信息移除"
    :footer="false"
    :close-on-esc-keydown="!loading"
    :close-on-overlay-click="!loading"
    :close-btn="!loading"
    >
        <t-date-picker
        v-model="dateFrom"
        allow-input
        style="width: 100%;"
        ></t-date-picker>
        <t-space size="8px" style="margin: 8px 0;">
            <t-popconfirm
            theme="danger"
            :content="`${ getString('removeConfirmOf') }( ${ shop.store } / ${ shop.brand } )${ getString('removeOrdersAfterDate') }`"
            @confirm="removeOrder()"
            >
                <t-button
                theme="danger"
                :loading="loading"
                >
                    {{ getString('removeAboutOrders') }}
                </t-button>
            </t-popconfirm>
            <t-button
            @click="show = false"
            variant="outline"
            :disabled="loading"
            >
                {{ getString('cancel') }}
            </t-button>
        </t-space>
    </t-dialog>
</template>

<script setup>
import dayjs from 'dayjs'
import {NotifyPlugin} from "tdesign-vue-next";
import service from "../../api/service.js";
import {tips} from "../../hooks/tips.js";
import {getString} from "../../i18n/index.js";
import {request} from "../../api/request.js";

const show = ref(false)
const dateFrom = ref(null)
const serve = inject('serve')
const i18n = inject('i18n')
const shop = inject('shop')
const loading = ref(false)

const open = () => {
    dateFrom.value = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
    show.value = true
}

const removeOrder = async () => {
    loading.value = true
    let res = await request('/order', {
        storeId: shop.store,
        branId: shop.brand,
        from: dateFrom.value + ' 00:00:00',
        to: dayjs().format('YYYY-MM-DD') + ' 23:59:59'
    }, 'DELETE')
    if(res.status === 'success'){
        tips(`删除成功, 总计删除${ res.content.affect }个订单记录`, 'success')
    } else {
        tips(res.error.msg, 'error')
    }
    loading.value = false
    show.value = false
}

defineExpose({ open })
</script>

<style>

</style>