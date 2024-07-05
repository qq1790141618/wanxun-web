<template>
    <div>
        <h3>
            {{ getString('brandManage') }}
            <t-button
            @click="() => {
                if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/shop/create-brand') >= 0){
                    visible = 'create'
                    form = {}
                } else {
                    tips('权限不足', 'error')
                }
            }"
                variant="outline"
                shape="square"
                size="small"
            >
                <template #icon>
                    <t-icon name="add" />
                </template>
            </t-button>
        </h3>
        <t-table
        table-layout="auto"
        :data="shop.brandOptions"
        :columns="columns"
        :loading="loading"
        :loading-props="{
        indicator: false,
        text: getString('loading')
        }"
            max-height="calc(100vh - 270px)"
        >
            <template #operate="{ row }">
                <t-space :break-line="true" size="5px">
                    <t-button
                    size="small"
                    :disabled="user.inform['need_auth'] && user.inform['api_p'].indexOf('api/v1/shop/set-brand') < 0"
                    @click="() => {
                        visible = 'edit'
                        form = row
                    }"
                    >
                        {{ getString('brandInfoEdit') }}
                    </t-button>
                    <t-popconfirm
                    :content="getString('removeConfirm')"
                    theme="danger"
                    @confirm="remove(row.id)"
                    >
                        <t-button
                        theme="danger"
                        size="small"
                        :loading="removeLoading === row.id"
                        :disabled="user.inform['need_auth'] && user.inform['api_p'].indexOf('api/v1/shop/remove-brand') < 0"
                        >
                            {{ getString('removeBrand') }}
                        </t-button>
                    </t-popconfirm>
                </t-space>
            </template>
        </t-table>
        <t-dialog
        v-model:visible="visible"
        :footer="false"
        width="600"
        placement="center"
        :close-on-overlay-click="false"
        >
            <template #header>
                {{ visible === 'create' ? getString('createBrand') : getString('brandInfoEdit') }}
            </template>
            <div class="scrollbar">
                <BrandForm v-model:form="form" ref="createRef" :type="visible" />
            </div>
            <ConfirmBar :noreset="true" :confirm-loading="confirmLoading" @close="visible = null" @confirm="confirmForm()"/>
        </t-dialog>
    </div>
</template>

<script setup>
import {getString} from "../../../i18n/index.js";
import {tips} from "../../../hooks/tips.js";
import {createBrand, removeBrand, setBrandInfo} from "../../../api/shop.js";
import ConfirmBar from "../../../components/confirmBar.vue";
import BrandForm from "./BrandForm.vue";
import {request} from "../../../api/request.js";

const emit = defineEmits(['reload'])

const user = inject('user')
const shop = inject('shop')
const loading = ref(false)
const columns = [
    {
        colKey: 'id',
        title:  getString('brandId'),
        align: 'center'
    },
    {
        colKey: 'name',
        title:  getString('brandName'),
        align: 'center'
    },
    {
        colKey: 'suffix',
        title:  getString('brandBarcodePrefix'),
        align: 'center'
    },
    {
        colKey: 'operate',
        title: getString('operate'),
        align: 'center'
    }
]

const visible = ref(null)
const form = ref({})
const createRef = ref(null)

const confirmLoading = ref(false)
const confirmForm = async () => {
    confirmLoading.value = true

    let val = await createRef.value.confirm()
    if(JSON.stringify(val) !== '{}'){
        for (const key in val) {
            confirmLoading.value = false
            tips(val[key][0].message, 'warning')
            return
        }
    }

    let response = await request('/shop/brand', form.value, 'PUT')
    if(response.status !== 'success'){
        tips(response.error.msg, 'error')
        confirmLoading.value = false
    } else {
        tips('操作成功', 'success')
    }

    visible.value = false
    confirmLoading.value = false

    emit('reload')
}

const removeLoading = ref(null)
const remove = async (id) => {
    removeLoading.value = id
    let response = await request('/shop/brand', { id }, 'DELETE')
    if(response.status !== 'success'){
        tips(res.error.msg, 'error')
    } else {
        tips('操作成功', 'success')
        emit('reload')
    }
    removeLoading.value = null
}
</script>

<style scoped>
.scrollbar {
    max-height: 60vh;
    overflow-x: visible;
    overflow-y: auto;
    margin-bottom: 20px;
}
</style>