<template>
    <t-table
    size="small"
    :data="data"
    :columns="columns"
    :loading="loading"
    max-height="calc(100vh - 240px)"
    rowKey="id"
    :pagination="false"
    table-layout="auto"
    :hover="true"
    class="task-display"
    >
        <template #typeshow="{ row }">
            <span v-if="row.type === 'import'"><t-icon name="file-import"></t-icon> {{ getString('import') }}</span>
            <span v-if="row.type === 'export'"><t-icon name="file-export"></t-icon> {{ getString('export') }}</span>
            <span v-if="row.type === 'analysis'"><t-icon name="bar-chart"></t-icon> {{ getString('analysis') }}</span>
        </template>
        <template #subtypeshow="{ row }">
            <span v-if="row.subType === 'SkuInfo'"><t-icon name="barcode"></t-icon>&nbsp;{{ getString('skuInformTable') }}</span>
            <span v-if="row.subType === 'SpuInfo'"><t-icon name="system-2"></t-icon>&nbsp;{{ getString('spuInformTable') }}</span>
            <span v-if="row.subType === 'OrderInfo'"><t-icon name="assignment"></t-icon>&nbsp;{{ getString('ordersListTable') }}</span>
            <span v-if="row.subType === 'SkuImport'"><t-icon name="article"></t-icon>&nbsp;{{ getString('ordersDetailTable') }}</span>
            <span v-if="row.subType === 'RefundInfo'"><t-icon name="browse-gallery"></t-icon>&nbsp;{{ getString('refundsInformTable') }}</span>
            <span v-if="row.subType === 'BalanceInfo'"><t-icon name="currency-exchange"></t-icon>&nbsp;{{ getString('orderBillsInformTable') }}</span>
        </template>
        <template #statusshow="{ row }">
            <span v-if="row.status === 'wait'">{{ getString('wait') }}</span>
            <span v-if="row.status === 'handle'">{{ getString('handle') }}</span>
            <span v-if="row.status === 'error'">{{ getString('error') }}</span>
            <span v-if="row.status === 'done'">{{ getString('done') }}</span>
        </template>
        <template #resultshow="{ row }">
            <span v-if="!row.result">{{ getString('evenDown') }}</span>
            <span v-if="row.result === 'success'">{{ getString('success') }}</span>
            <span v-if="row.result === 'fail'">{{ getString('fail') }}</span>
        </template>
        <template #progressshow="{ row }">
            <div style="padding: 0 12px;">
                <t-progress
                    size="small"
                    theme="plump"
                    :percentage="Math.round(row.percent * 10000) / 100"
                />
            </div>
        </template>
        <template #ope="{ row }">
            <t-space size="small">
                <t-button
                    v-if="row.file"
                    size="small"
                    @click="downloadFile(row.file)"
                >
                    <template #icon>
                        <t-icon name="download" />
                    </template>
                    {{ getString('downloadAboutFile') }}
                </t-button>
                <t-popconfirm
                    theme="danger"
                    :content="getString('removeConfirm')"
                    @confirm="removeTask(row)"
                >
                    <t-button
                        theme="danger"
                        size="small"
                    >
                        <template #icon>
                            <t-icon name="delete" />
                        </template>
                        {{ getString('removeTask') }}
                    </t-button>
                </t-popconfirm>
                <t-button
                    theme="warning"
                    size="small"
                    v-if="row.error != null"
                    @click="showError(row.error)"
                >
                    <template #icon>
                        <t-icon name="error-circle" />
                    </template>
                    {{ getString('errorInform') }}
                </t-button>
            </t-space>
        </template>
    </t-table>
    <ErrorDialog ref="errorDialog" />
</template>

<script setup>
import ErrorDialog from './ErrorDialog.vue'
import { tips } from "../../hooks/tips.js"
import { NotifyPlugin } from "tdesign-vue-next"
import { getString } from "../../i18n/index.js"
import { request } from "../../api/request.js"

const props = defineProps(['data', 'loading'])
const emit = defineEmits(['reload'])
const user = inject('user')

const columns = [
    {
        title: getString('taskId'),
        colKey: 'id',
        align: 'center'
    },
    {
        title: getString('taskType'),
        colKey: 'typeshow',
        align: 'center'
    },
    {
        title: getString('taskSubType'),
        colKey: 'subtypeshow',
        align: 'center'
    },
    {
        title: getString('taskContentCount'),
        colKey: 'count',
        align: 'center'
    },
    {
        title: getString('taskContentRead'),
        colKey: 'read',
        align: 'center'
    },
    {
        title: getString('taskProgress'),
        colKey: 'progressshow',
        align: 'center',
        width: 220
    },
    {
        title: getString('taskStatus'),
        colKey: 'statusshow',
        align: 'center'
    },
    {
        title: getString('useTime') + '/s',
        colKey: 'seconds',
        align: 'center'
    },
    {
        title: getString('result'),
        colKey: 'resultshow',
        align: 'center'
    },
    {
        title: getString('createUser'),
        colKey: 'user',
        align: 'center',
        cell: (h, { row }) => {
            if(row.creator === user.inform.uid){
                return getString('currentAccount')
            }
            return row.creator ?? getString('unknown')
        }
    },
    {
        title: getString('operate'),
        colKey: 'ope',
        align: 'center'
    }
]

const removeTask = async (row) => {
    if(row.progress > 0 && row.progress < 1){
        await NotifyPlugin.error({
            title: getString('removeFail'),
            content: getString('canNotRemoveTaskOfProgressing')
        })
        return
    }

    if(row.creator !== user.inform.uid){
        await NotifyPlugin.error({
            title: getString('removeFail'),
            content: getString('canNotRemoveTaskNotCreateBySelf')
        })
        return
    }

    let res = await request('/import', { id: row.id }, 'DELETE')
    if(res.status === 'success'){
        emit('reload')
        tips('移除成功', 'success')
    } else {
        tips(res.error.msg, 'error')
    }
}

const errorDialog = ref(null)
const showError = (error) => {
    errorDialog.value.open(error)
}

const downloadFile = (file) => {
    for (const fileKey in file) {
        window.open(file[fileKey])
    }
}
</script>

<style>
.task-display .t-icon {
    position: relative;
    top: -1.5px;
    left: -1.5px;
}
</style>