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
    table-layout="auto"
    >
        <template #type-show="{ row }">
            <span v-if="row.type === 'morifySku'"><t-icon name="barcode"></t-icon>&nbsp;导入SKU信息</span>
            <span v-if="row.type === 'morifySpu'"><t-icon name="system-2"></t-icon>&nbsp;导入SPU/款信息</span>
            <span v-if="row.type === 'morifySupplier'"><t-icon name="transform-1"></t-icon>&nbsp;导入商品额外信息</span>
            <span v-if="row.type === 'morifyOrderList'"><t-icon name="assignment"></t-icon>&nbsp;导入订单列表</span>
            <span v-if="row.type === 'morifyOrderDetails'"><t-icon name="article"></t-icon>&nbsp;导入订单明细</span>
            <span v-if="row.type === 'morifyOrderRefunds'"><t-icon name="browse-gallery"></t-icon>&nbsp;导入退款信息</span>
            <span v-if="row.type === 'morifyOrderBill'"><t-icon name="currency-exchange"></t-icon>&nbsp;导入销售对账单</span>
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
                :disabled="user.inform['need_auth'] && user.inform['api_p'].indexOf('api/v1/import/task/remove') < 0"
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
import service from "../../api/service.js";
import {tips} from "../../hooks/tips.js";
import {NotifyPlugin} from "tdesign-vue-next";

export default {
    props: ['data', 'loading'],
    components: {
        ErrorDialog
    },
    setup(){
        const user = inject('user')
        const columns = [
            {
                title: '任务编号',
                colKey: 'id',
                align: 'center'
            },
            {
                title: '任务类型',
                colKey: 'type-show',
                align: 'center'
            },
            {
                title: '创建用户',
                colKey: 'user',
                align: 'center',
                cell: (h, { row }) => {
                    if(row.user === user.inform.uid){
                        return '当前帐号'
                    }
                    return row.user ?? '未知'
                }
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
                align: 'center'
            },
            {
                title: '操作',
                colKey: 'ope',
                align: 'center'
            }
        ]

        const removeTask = async (row) => {
            if(row.progress > 0 && row.progress < 1){
                NotifyPlugin.error({
                    title: '移除失败',
                    content: '不可以移除正在进行中的任务'
                })
                return
            }

            if(row.user !== user.inform.uid){
                NotifyPlugin.error({
                    title: '移除失败',
                    content: '只能移除自己创建的任务'
                })
                return
            }

            let res = await service.api.imports.remove(row.id)
            if(res.result){
                tips('移除成功', 'success')
            } else {
                tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
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
            errorDialog,
            user
        }
    }
}
</script>

<style>

</style>