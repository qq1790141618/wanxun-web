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
            :content="`确定要移除( ${ shop.store } / ${ shop.brand } )在该日期之后的订单吗？删除后不可恢复！`"
            @confirm="removeOrder()"
            >
                <t-button
                theme="danger"
                :loading="loading"
                >
                    移除相关订单
                </t-button>
            </t-popconfirm>
            <t-button
            @click="show = false"
            variant="outline"
            :disabled="loading"
            >
                取消
            </t-button>
        </t-space>
    </t-dialog>
</template>

<script>
import dayjs from 'dayjs'

export default {
    setup(){
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
        const startRemove = async (dateFrom) => {
            return fetch(serve + `/order/remove?brand=${ shop.brand }&store-id=${ shop.store }&date-from=${ dateFrom }`)
            .then(response => {
                return Promise.resolve(response.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const removeOrder = async () => {
            loading.value = true
            let res = await startRemove(dateFrom.value)
            if(res.result){
                MessagePlugin.success(`删除成功, 总计删除${ affected }个订单记录`)
            } else {
                NotifyPlugin.error({
                    title: '移除失败',
                    content: res.message,
                    duration: 10000,
                    closeBtn: true
                })
            }
            loading.value = false
            show.value = false
        }

        return {
            show,
            open,
            dateFrom,
            shop,
            removeOrder,
            loading
        }
    }
}
</script>

<style>

</style>