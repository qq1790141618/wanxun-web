<template>
    <t-table
    size="small"
    :data="data"
    :columns="columns"
    :loading="loading"
    max-height="calc(100vh - 240px)"
    style="max-width: 1200px; margin: 0 auto;"
    rowKey="id"
    :pagination="false"
    hover
    table-layout="auto"
    >
        <template #type-show="{ row }">
            <span v-if="row.type === 'morifySku'"><t-icon name="barcode"></t-icon>&nbsp;{{ getString('skuInformTable') }}</span>
            <span v-if="row.type === 'morifySpu'"><t-icon name="system-2"></t-icon>&nbsp;{{ getString('spuInformTable') }}</span>
            <span v-if="row.type === 'morifySupplier'"><t-icon name="transform-1"></t-icon>&nbsp;{{ getString('goodsOthersInformTable') }}</span>
            <span v-if="row.type === 'morifyOrderList'"><t-icon name="assignment"></t-icon>&nbsp;{{ getString('ordersListTable') }}</span>
            <span v-if="row.type === 'morifyOrderDetails'"><t-icon name="article"></t-icon>&nbsp;{{ getString('ordersDetailTable') }}</span>
            <span v-if="row.type === 'morifyOrderRefunds'"><t-icon name="browse-gallery"></t-icon>&nbsp;{{ getString('refundsInformTable') }}</span>
            <span v-if="row.type === 'morifyOrderBill'"><t-icon name="currency-exchange"></t-icon>&nbsp;{{ getString('orderBillsInformTable') }}</span>
        </template>
        <template #progress-show="{ row }">
            <div style="padding: 0 60px;">
                <t-progress size="small" theme="plump" :percentage="Math.round(row.progress * 10000) / 100" />
            </div>
        </template>
        <template #ope="{ row }">
            <t-popconfirm
            theme="danger"
            :content="getString('removeConfirm')"
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
                    {{ getString('removeTask') }}
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
                {{ getString('errorInform') }}
            </t-button>
        </template>
    </t-table>
    <ErrorDialog ref="errorDialog" />
</template>

<script setup>
import { translate } from '../../hooks'
import ErrorDialog from './ErrorDialog.vue'
import service from "../../api/service.js";
import {tips} from "../../hooks/tips.js";
import {NotifyPlugin} from "tdesign-vue-next";
import {getString, getStringAsync} from "../../i18n/index.js";

const props = defineProps(['data', 'loading'])
const user = inject('user')

const columns = [
    {
        title: getString('taskId'),
        colKey: 'id',
        align: 'center'
    },
    {
        title: getString('taskType'),
        colKey: 'type-show',
        align: 'center'
    },
    {
        title: getString('createUser'),
        colKey: 'user',
        align: 'center',
        cell: (h, { row }) => {
            if(row.user === user.inform.uid){
                return getString('currentAccount')
            }
            return row.user ?? getString('unknown')
        }
    },
    {
        title: getString('taskProgress'),
        colKey: 'progress-show',
        align: 'center',
        width: 300
    },
    {
        title: getString('taskStatus'),
        colKey: 'status',
        align: 'center'
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

    if(row.user !== user.inform.uid){
        await NotifyPlugin.error({
            title: getString('removeFail'),
            content: getString('canNotRemoveTaskNotCreateBySelf')
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

</script>

<style>

</style>