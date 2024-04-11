<template>
    <div>
        <h3>
            {{ getString('storeManage') }}
            <t-button
            @click="() => {
                if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/shop/create-store') >= 0){
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
        :data="shop.storeOptions"
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
                    :disabled="user.inform['need_auth'] && user.inform['api_p'].indexOf('api/v1/shop/set-store') < 0"
                    @click="() => {
                        visible = 'edit'
                        form = row
                    }"
                    >
                        {{ getString('storeInfoEdit') }}
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
                        :disabled="user.inform['need_auth'] && user.inform['api_p'].indexOf('api/v1/shop/remove-store') < 0"
                        >
                            {{ getString('removeStore') }}
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
                {{ visible === 'create' ? getString('createStore') : getString('storeInfoEdit') }}
            </template>
            <div class="scrollbar">
                <StoreForm v-model:form="form" ref="createRef" :type="visible" />
            </div>
            <ConfirmBar :noreset="true" :confirm-loading="confirmLoading" @close="visible = null" @confirm="confirmForm()"/>
        </t-dialog>
    </div>
</template>

<script setup>
import {getString} from "../../../i18n/index.js";
import {tips} from "../../../hooks/tips.js";
import ConfirmBar from "../../../components/confirmBar.vue";
import StoreForm from "./StoreForm.vue";
import {createStore, removeStore, setStoreInfo} from "../../../api/shop.js";

const emit = defineEmits(['reload'])

const user = inject('user')
const shop = inject('shop')
const loading = ref(false)
const columns = [
    {
        colKey: 'id',
        title:  getString('storeId'),
        align: 'center'
    },
    {
        colKey: 'name',
        title:  getString('storeName'),
        align: 'center'
    },
    {
        colKey: 'brand',
        title:  getString('storeBrand'),
        align: 'center',
        cell: (h, { row }) => {
            let supportBrand = []
            for (let i = 0; i< shop.brandOptions.length; i++){
                if(row.brand.indexOf(shop.brandOptions[i].id) >= 0){
                    supportBrand.push(shop.brandOptions[i].name)
                }
            }
            return supportBrand.join(', ')
        }
    },
    {
        colKey: 'location',
        title:  getString('storeLocation'),
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

    let response
    if(visible.value === 'create') {
        response = await createStore(form.value['id'], form.value['name'], form.value['brand'], form.value['location'])
    }
    if(visible.value === 'edit') {
        response = await setStoreInfo(form.value['id'], form.value['name'], form.value['brand'], form.value['location'])
    }

    if(!response.result){
        tips(response.error.message, 'error')
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
    let res = await removeStore(id)
    if(!res.result){
        tips(res.error.message, 'error')
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