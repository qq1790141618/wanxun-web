<template>
    <t-table
    size="small"
    :data="data"
    :columns="columns"
    :loading="loading"
    max-height="calc(100vh - 240px)"
    style="max-width: 1000px; margin: 0 auto;"
    rowKey="id"
    :pagination="false"
    hover
    >
        <template #type-show="{ row }">
            <span v-if="row.type == 'morifySku'"><t-icon name="barcode"></t-icon>&nbsp;导入SKU信息</span>
            <span v-if="row.type == 'morifySpu'"><t-icon name="system-2"></t-icon>&nbsp;导入SPU/款信息</span>
            <span v-if="row.type == 'morifySupplier'"><t-icon name="transform-1"></t-icon>&nbsp;导入商品额外信息</span>
            <span v-if="row.type == 'morifyOrderList'"><t-icon name="assignment"></t-icon>&nbsp;导入订单列表</span>
            <span v-if="row.type == 'morifyOrderDetails'"><t-icon name="article"></t-icon>&nbsp;导入订单明细</span>
            <span v-if="row.type == 'morifyOrderRefunds'"><t-icon name="browse-gallery"></t-icon>&nbsp;导入退款信息</span>
            <span v-if="row.type == 'morifyOrderBill'"><t-icon name="currency-exchange"></t-icon>&nbsp;导入销售对账单</span>
        </template>
        <template #progress-show="{ row }">
            <div style="padding: 0 60px;">
                <t-progress size="small" theme="plump" :percentage="Math.round(row.progress * 10000) / 100" />
            </div>
        </template>
        <template #ope="{ row }">
            <t-popconfirm
            theme="danger"
            content="确定要移除该任务吗？删除后不可恢复！"
            @confirm="removeTask(row)"
            >
                <t-button
                theme="danger"
                shape="round"
                size="small"
                >
                    <template #icon>
                        <t-icon name="delete" />
                    </template>
                    移除任务
                </t-button>
            </t-popconfirm>
            <t-button
            theme="warning"
            shape="round"
            size="small"
            style="margin-top: 5px;"
            v-if="row.error != null"
            @click="showError(row.error)"
            >
                <template #icon>
                    <t-icon name="error-circle" />
                </template>
                错误信息
            </t-button>
        </template>
    </t-table>
    <ErrorDialog ref="errorDialog" />
</template>

<script>
import { translate } from '../../hooks'
import ErrorDialog from './ErrorDialog.vue'

export default {
    props: ['data', 'loading'],
    components: {
        ErrorDialog
    },
    setup(){
        const serve = inject('serve')
        const i18n = inject('i18n')
        const columns = [
            {
                title: '任务编号',
                colKey: 'id',
                align: 'center',
                width: 150
            },
            {
                title: '任务类型',
                colKey: 'type-show',
                align: 'center',
                width: 180
            },
            {
                title: '任务进度',
                colKey: 'progress-show',
                align: 'center',
                width: 300
            },
            {
                title: '任务状态',
                colKey: 'status',
                align: 'center',
                width: 150
            },
            {
                title: '操作',
                colKey: 'ope',
                align: 'center',
                width: 150
            }
        ]

        const startRemove = async (id) => {
            return fetch(serve + `/import/task/remove?id=${ id }`)
            .then(response => {
                return Promise.resolve(response.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const removeTask = async (row) => {
            if(row.progress > 0 && row.progress < 1){
                NotifyPlugin.warning({
                    title: '移除失败',
                    content: '不可以移除正在进行中的任务'
                })
                return
            }

            let res = await startRemove(row.id)
            if(res.result){
                MessagePlugin.success(i18n.editSuccess[i18n.language])
            } else {
                let f = translate(res.error, i18n.language)
                MessagePlugin.error(f.trans_result[0].dst)
            }
        }

        const errorDialog = ref(null)
        const showError = (error) => {
            var error = JSON.parse(error)
            errorDialog.value.open(error)
        }

        return {
            columns,
            removeTask,
            showError,
            errorDialog
        }
    }
}
</script>

<style>

</style>