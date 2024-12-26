<template>
    <div class="main-content" id="import-page">
        <t-card :bordered="false">
            <div class="headbar">
                <t-upload
                    v-model:files="fList"
                    :accept="allowType.join(',')"
                    :size-limit="{
                        size: allowSize,
                        unit: 'MB',
                        message: sizeLimit
                    }"
                    :auto-upload="false"
                    style="display: inline-block;"
                    @change="create"
                >
                    <template #file-list-display><div></div></template>
                    <t-button :loading="createLoading">
                        <template #icon>
                            <t-icon name="add" style="color: white;" />
                        </template>
                        {{ getString('addImportOrder') }}
                    </t-button>
                </t-upload>
                <t-button variant="outline" @click="initData">
                    <template #icon>
                        <t-icon name="refresh" />
                    </template>
                    {{ getString('refresh') }}
                </t-button>
                <t-dropdown
                    :options="[
                        { content: getString('skuImportTemplate'), value: 'https://cdn.fixeam.com/tw/SKU信息导入模板.xlsx' }
                    ]"
                    trigger="hover"
                    @click="(context) => {
                        saveFile(context.value)
                    }"
                    max-column-width="200"
                    placement="bottom"
                >
                    <t-button variant="outline">
                        <template #icon>
                            <t-icon name="download" />
                        </template>
                        {{ getString('templateDownload') }}
                        <template #suffix><t-icon name="chevron-down" size="16" /></template>
                    </t-button>
                </t-dropdown>
                <t-button
                    theme="danger"
                    @click="removeOrder.open()"
                >
                    <template #icon>
                        <t-icon name="clear" />
                    </template>
                    {{ getString('orderInformsRemove') }}
                </t-button>
                <t-popup placement="bottom" trigger="hover">
                    <t-button variant="text">
                        <template #icon>
                            <t-icon name="help-circle"></t-icon>
                        </template>
                        <span>
                            {{ getString('dataFrom') }}
                        </span>
                    </t-button>
                    <template #content>
                        <upload-tips />
                    </template>
                </t-popup>
            </div>
            <div id="content-table">
                <list-display
                    :data="data"
                    :loading="loading"
                    @reload="getData"
                />
                <t-pagination
                    size="small"
                    :disabled="loading"
                    v-model:current="pagination.current"
                    v-model:page-size="pagination.pageSize"
                    :total="pagination.total"
                    :page-size-options="pagination.pageSizeOptions"
                    @current-change="initData()"
                    @page-size-change="() => {
                        pagination.current = 1
                        initData()
                    }"
                    style="margin-top: 5px;"
                />
            </div>
        </t-card>
    </div>
    <t-dialog
        v-model:visible="resultDialog.show"
        :header="resultDialog.header"
        :body="resultDialog.body"
        :footer="false"
        placement="top"
    />
    <RemoveOrder
    ref="removeOrder"
    />
</template>

<script setup>
import UploadTips from './UploadTips.vue'
import ListDisplay from './ListDisplay.vue'
import RemoveOrder from './RemoveOrder.vue'
import { getString, getStringAsync } from "../../i18n/index.js"
import { request } from "../../api/request.js"
import { tips } from "../../hooks/tips.js"

const i18n = inject('i18n')
const user = inject('user')
const shop = inject('shop')
const removeOrder = ref(null)
const fList = ref([])

const data = ref([])
const loading = ref(false)
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 20,
    pageSizeOptions: [20, 30, 50, 100]
})
const getData = async () => {
    let response = await request('/import', {
        skip: (pagination.value.current - 1) * pagination.value.pageSize,
        limit: pagination.value.pageSize
    })
    if(response.status === 'success'){
        data.value = response.content.data
        pagination.value.total = response.content.total
    } else {
        tips(response.error.msg, 'error')
    }
}
const initData = async () => {
    loading.value = true
    await getData()
    loading.value = false
}
let timerRefresh = null
const autoFresh = () => {
    if (import.meta.env.PROD) {
        timerRefresh = setInterval(async () => {
            await getData()
        }, 2000)
    }
}
const clearFresh = () => {
    clearInterval(timerRefresh)
    timerRefresh = null
}

const saveFile = (url) => window.open(url)
const allowType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
const allowSize = 10
const sizeLimit = ref('')
const createSizeLimit = async () => {
    sizeLimit.value = await getStringAsync('文件大小' + allowSize + 'MB以内, 仅支持.xls, .xlsx, .xlsm等EXCEL文件')
}
createSizeLimit()

const createLoading = ref(false)
const resultDialog = ref({
    show: false,
    header: null,
    body: null
})
const create = async (files) => {
    createLoading.value = true

    let file = files[0].raw
    let f = new FormData
    f.append('name', file.name)
    f.append('file', file)

    let response = await request('/import', f, 'POST', false)
    if(response.status === 'success'){
        await initData()
        resultDialog.value.body = await getStringAsync(response.content)
        resultDialog.value.header = 'Success'
        resultDialog.value.show = true
    } else {
        resultDialog.value.body = await getStringAsync(response.error.msg)
        resultDialog.value.header = response.error.code
        resultDialog.value.show = true
    }

    fList.value = []
    createLoading.value = false
}

onMounted(initData)
onActivated(autoFresh)
onDeactivated(clearFresh)
</script>

<style>
.main-content .t-card{
    overflow: hidden;
    height: calc(100vh - 120px);
    margin: 15px;
}
.main-content .t-card__body{
    padding: 0;
}
.main-content .t-tabs__nav-item{
    padding: 0 12px;
}
.main-content .t-tabs__content{
    height: calc(100vh - 100px);
    overflow-y: auto;
    border-left: 1px solid #dfdfdf;
}
.main-content .headbar{
    width: 100%;
    padding: 12px;
    border-bottom: 1px solid #dfdfdf;
    background-color: #fff;
}
.main-content .headbar .t-button{
    margin-right: 8px;
}
.main-content .new-card-body{
    position: relative;
    width: 100%;
    padding: 15px 20px;
    box-sizing: border-box;
}
.main-content .box-center{
    position: absolute;
    top: 45vh;
    left: 50%;
    transform: translate(-50%, -50%);
}
.main-content .center-upload .t-upload__dragger{
    margin: 8px 0;
    width: 100%;
    height: calc(100vh - 350px);
}
.main-content #content-table{
    padding: 10px;
}
</style>