<template>
    <t-card class="user-group-card" :bordered="false">
        <t-space style="margin-bottom: 12px;">
            <t-button
            @click="() => {
                if(!user.inform.needAuth || user.inform.permissions.indexOf('api/v1/user/create') >= 0){
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
                {{ getString('createUser') }}
            </t-button>
            <t-button
            @click="getUsers()"
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
            <template #identitys="{ row }">
                <t-space :break-line="true" size="5px" v-if="true">
                    <t-select
                    size="small"
                    :disabled="row.createBy.indexOf(user.inform.identity) < 0"
                    :options="identityOptions"
                    v-model="row.identity"
                    style="width: 120px;"
                    @change="(value) => {
                        changeIdentity(row.uid, value)
                    }"
                    ></t-select>
                </t-space>
            </template>
            <template #operate="{ row }">
                <t-space :break-line="true" size="5px" v-if="row.createBy.indexOf(user.inform.identity) >= 0">
                    <t-button
                    size="small"
                    @click="shopPermissionSet.open(row)"
                    >
                        {{ getString('changeUserShopPermissions') }}
                    </t-button>
                    <t-popconfirm
                    :content="getString('removeConfirm')"
                    theme="danger"
                    @confirm="removeUser(row.uid)"
                    >
                        <t-button
                        theme="danger"
                        size="small"
                        :loading="removeLoading === row.uid"
                        >
                            {{ getString('removeUser') }}
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
    :close-on-overlay-click="false"
    >
        <template #header>
            {{ getString('createUser') }}
        </template>
        <div class="scrollbar">
            <CreateForm v-model:form="createForm" ref="createRef" :identity-options="identityOptions" />
        </div>
        <ConfirmBar :noreset="true" :confirm-loading="confirmLoading" @close="visible = false" @confirm="confirmForm()"/>
    </t-dialog>
    <ShopPermissionSet ref="shopPermissionSet" @reload="getUsers" />
</template>

<script setup>
import service from "../../../api/service.js"
import {getString} from "../../../i18n/index.js"
import {tips} from "../../../hooks/tips.js"
import CreateForm from "./CreateForm.vue"
import ConfirmBar from '../../../components/confirmBar.vue'
import ShopPermissionSet from "./ShopPermissionSet.vue"
import {request} from "../../../api/request.js";

const user = inject('user')
const loading = ref(true)
const identityData = ref([])
const shopPermissionSet = ref(null)
const columns = [
    {
        colKey: 'uid',
        title:  'ID',
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'username',
        title:  getString('username'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'realName',
        title:  getString('realname'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'hireDate',
        title:  getString('hiredate'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'birthday',
        title:  getString('birthday'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'phone',
        title:  getString('phone'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'mail',
        title:  getString('mail'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'nickname',
        title: getString('nickname'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'identitys',
        title: getString('userIdentity'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    },
    {
        colKey: 'operate',
        title: getString('operate'),
        align: 'center',
        attrs: ({ row }) => {
            if (row.uid === user.inform.uid) {
                return {
                    style: {
                        backgroundColor: 'var(--td-error-color-light)'
                    }
                }
            }
        }
    }
]
const getUsers = async () => {
    loading.value = true
    let res = await request('/user', { skip: 0, limit: 30 })
    if(res.status === 'success'){
        identityData.value = res.content
    } else {
        tips(res.error.msg, 'error')
    }
    await getIdentityData()
    loading.value = false
}

const identityOptions = ref([])
const getIdentityData = async () => {
    let res = await request('/identity')
    if(res.status === 'success'){
        identityOptions.value = []
        for (let i = 0; i < res.content.length; i++){
            identityOptions.value.push({
                label: res.content[i].name,
                value: res.content[i].identity,
                disabled: res.content[i].createBy.indexOf(user.inform.identity) < 0
            })
        }
    } else {
        tips(res.error.msg, 'error')
    }
}

const changeIdentity = async (uid, identity) => {
    let res = await request('/user/identity', { uid, identity }, 'PUT')
    if(res.status === 'success'){
        tips('操作成功', 'success')
    } else {
        tips(res.error.msg, 'error')
    }
}

const visible = ref(false)
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

        let inform = {}
        for (const informKey in createForm.value) {
            if(createForm.value[informKey]){
                inform[informKey] = createForm.value[informKey]
            }
        }

        let response = request('/user', inform, 'PUT')
        if(response.status === 'success'){
            tips(response.error.msg, 'error')
            confirmLoading.value = false
        } else {
            tips('操作成功', 'success')
        }
    }

    visible.value = false
    confirmLoading.value = false

    await getUsers()
}

const removeLoading = ref(null)
const removeUser = async (id) => {
    removeLoading.value = id
    let response = await request('/user', { uid: id }, 'DELETE')
    if(response.status === 'success'){
        tips('操作成功', 'success')
        await getUsers()
    } else {
        tips(response.error.msg, 'error')
    }
    removeLoading.value = null
}

onMounted(() => {
    getUsers()
})
</script>

<style scoped>
.user-group-card {
    max-width: calc(100vw - 30px);
    margin: 15px auto;
}
.scrollbar {
    max-height: 60vh;
    overflow-x: visible;
    overflow-y: auto;
    margin-bottom: 20px;
}
</style>