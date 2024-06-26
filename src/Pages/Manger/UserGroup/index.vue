<template>
    <t-card class="user-group-card" :bordered="false">
        <t-space style="margin-bottom: 12px;">
            <t-button
            @click="() => {
                if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/manage/create_identity') >= 0){
                    visible = 'create'
                    createForm = {}
                    editPermission = []
                } else {
                    tips('权限不足', 'error')
                }
            }"
            >
                <template #icon>
                    <t-icon name="add" />
                </template>
                {{ getString('createIdentity') }}
            </t-button>
            <t-button
            @click="getIdentity()"
            variant="outline"
            >
                <template #icon>
                    <t-icon name="refresh" />
                </template>
                {{ getString('refresh') }}
            </t-button>
        </t-space>
        <t-table
        table-layout="auto"
        :data="identityData"
        :columns="columns"
        :loading="loading"
        :loading-props="{
            indicator: false,
            text: getString('loading')
        }"
        max-height="calc(100vh - 200px)"
        >
            <template #operate="{ row }">
                <t-space :break-line="true" size="5px" v-if="JSON.parse(row['create_by']).indexOf(user.inform['identity']) >= 0">
                    <t-button
                    theme="primary"
                    size="small"
                    @click="() => {
                        visible = 'edit'
                        editId = row.identity
                        editPermission = JSON.parse(row['api_p'])
                    }"
                    >
                        {{ getString('permissionConfig') }}
                    </t-button>
                    <t-popconfirm
                    :content="getString('removeConfirm')"
                    theme="danger"
                    @confirm="removeIdentity(row.identity)"
                    >
                        <t-button
                        theme="danger"
                        size="small"
                        :loading="removeLoading === row.identity"
                        >
                            {{ getString('removeIdentity') }}
                        </t-button>
                    </t-popconfirm>
                </t-space>
            </template>
        </t-table>
    </t-card>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    width="600"
    placement="center"
    >
        <template #header>
            <span v-if="visible === 'edit'">
                {{ getString('permissionConfig') }}
            </span>
            <span v-if="visible === 'create'">
                {{ getString('createIdentity') }}
            </span>
        </template>
        <div class="scrollbar">
            <h3 v-if="visible === 'create'">
                {{ getString('baseInfo') }}
            </h3>
            <CreateForm v-if="visible === 'create'" v-model:form="createForm" :identity-options="identityData" ref="createRef" />
            <h3 v-if="visible === 'create'">
                {{ getString('permissionConfig') }}
            </h3>
            <PermissionEdit v-model:permission="editPermission" />
        </div>
        <ConfirmBar :noreset="true" :confirm-loading="confirmLoading" @close="visible = null" @confirm="confirmForm()"/>
    </t-dialog>
</template>

<script setup>
import service from "../../../api/service.js"
import {getString} from "../../../i18n/index.js"
import {tips} from "../../../hooks/tips.js"
import PermissionEdit from "./PermissionEdit.vue"
import CreateForm from "./CreateForm.vue"
import ConfirmBar from '../../../components/confirmBar.vue'

const i18n = inject('i18n')
const user = inject('user')
const loading = ref(true)
const identityData = ref([])
const columns = [
    {
        colKey: 'identity',
        title: 'ID',
        align: 'center'
    },
    {
        colKey: 'name',
        title: getString('identityName'),
        align: 'center'
    },
    {
        colKey: 'api_p',
        title: getString('permissionCount'),
        cell: (h, {row}) => {
            if(row['need_auth']){
                return JSON.parse(row['api_p']).length
            } else {
                return 'all'
            }
        },
        align: 'center'
    },
    {
        colKey: 'create_by',
        title: getString('createBy'),
        cell: (h, {row}) => {
            return JSON.parse(row['create_by']).join(' -> ')
        },
        align: 'center'
    },
    {
        colKey: 'operate',
        title: getString('operate'),
        align: 'center'
    }
]
const getIdentity = async () => {
    loading.value = true
    let res = await service.api.userM.identityView()
    if(res.result){
        identityData.value = res.content
    } else {
        tips(res.error.message, 'error')
    }
    loading.value = false
}

const visible = ref(null)
const editId = ref(null)
const editPermission = ref([])
const createForm = ref({})
const createRef = ref(null)

const confirmLoading = ref(false)
const confirmForm = async () => {
    confirmLoading.value = true

    if(visible.value === 'create'){
        let val = await createRef.value.confirm()
        if(JSON.stringify(val) !== '{}'){
            for (const key in val) {
                confirmLoading.value = false
                tips(val[key][0].message, 'warning')
                return
            }
        }

        let response0 = await service.api.userM.createIdentity(createForm.value.identity, createForm.value.name, createForm.value['create_by_identity'])
        if(!response0.result){
            tips(response0.error.message, 'error')
            confirmLoading.value = false
            return
        }
        editId.value = createForm.value.identity
        if(editPermission.value.length === 0){
            tips('操作成功', 'success')
            visible.value = null
            confirmLoading.value = false
            await getIdentity()
            return
        }
    }

    let response = await service.api.userM.setIdentityApiPermissions(editId.value, editPermission.value)
    if(response.result){
        tips('操作成功', 'success')
        visible.value = null
        await getIdentity()
    } else {
        tips(response.error.message, 'error')
    }

    confirmLoading.value = false
}
const removeLoading = ref(null)
const removeIdentity = async (id) => {
    removeLoading.value = id
    let response = await service.api.userM.removeIdentity(id)
    if(response.result){
        tips('操作成功', 'success')
        await getIdentity()
    } else {
        tips(response.error.message, 'error')
    }
    removeLoading.value = null
}

onMounted(() => {
    getIdentity()
})
</script>

<style scoped>
.user-group-card {
    max-width: 1000px;
    margin: 15px auto;
}
.scrollbar {
    max-height: 60vh;
    overflow-x: visible;
    overflow-y: auto;
    margin-bottom: 10px;
}
</style>