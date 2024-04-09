<template>
    <t-card class="user-group-card" :bordered="false">
        <t-space style="margin-bottom: 12px;">
            <t-button
            @click="() => {
                if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/user/create') >= 0){
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
                {{ i18n['createUser'][i18n.language] }}
            </t-button>
            <t-button
            @click="getUsers()"
            variant="outline"
            >
                <template #icon>
                    <t-icon name="refresh" />
                </template>
                {{ i18n['refresh'][i18n.language] }}
            </t-button>
        </t-space>
        <t-table
        table-layout="auto"
        :data="identityData"
        :columns="columns"
        :loading="loading"
        :loading-props="{
            indicator: false,
            text: i18n['loading'][i18n.language]
        }"
        max-height="calc(100vh - 200px)"
        >
            <template #identitys="{ row }">
                <t-space :break-line="true" size="5px" v-if="true">
                    <t-select
                    size="small"
                    :disabled="row['create_by'].indexOf(user.inform['identity']) < 0"
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
                <t-space :break-line="true" size="5px" v-if="row['create_by'].indexOf(user.inform['identity']) >= 0">
                    <t-popconfirm
                    :content="i18n['removeConfirm'][i18n.language]"
                    theme="danger"
                    @confirm="removeUser(row.uid)"
                    >
                        <t-button
                        theme="danger"
                        size="small"
                        :loading="removeLoading === row.uid"
                        >
                            {{ i18n['removeUser'][i18n.language] }}
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
            {{ i18n['createUser'][i18n.language] }}
        </template>
        <div class="scrollbar">
            <CreateForm v-model:form="createForm" ref="createRef" :identity-options="identityOptions" />
        </div>
        <ConfirmBar :noreset="true" :confirm-loading="confirmLoading" @close="visible = false" @confirm="confirmForm()"/>
    </t-dialog>
</template>

<script setup>
import service from "../../../api/service.js"
import {getContent} from "../../../i18n/index.js"
import {tips} from "../../../hooks/tips.js"
import CreateForm from "./CreateForm.vue"
import ConfirmBar from '../../../components/confirmBar.vue'

const i18n = inject('i18n')
const user = inject('user')
const loading = ref(true)
const identityData = ref([])
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
        title:  getContent('username'),
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
        colKey: 'realname',
        title:  getContent('realname'),
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
        colKey: 'hiredate',
        title:  getContent('hiredate'),
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
        title:  getContent('birthday'),
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
        title:  getContent('phone'),
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
        title:  getContent('mail'),
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
        title: getContent('nickname'),
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
        title: getContent('userIdentity'),
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
        colKey: 'name',
        title: getContent('name'),
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
        title: getContent('operate'),
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
    let res = await service.api.userE.userView()
    if(res.result){
        identityData.value = res.content
    } else {
        tips(res.error.message, 'error')
    }
    await getIdentityData()
    loading.value = false
}

const identityOptions = ref([])
const getIdentityData = async () => {
    let res = await service.api.userM.identityView()
    if(res.result){
        identityOptions.value = []
        for (let i = 0; i < res.content.length; i++){
            identityOptions.value.push({
                label: res.content[i].name,
                value: res.content[i].identity,
                disabled: res.content[i]['create_by'].indexOf(user.inform['identity']) < 0
            })
        }
    } else {
        tips(res.error.message, 'error')
    }
}

const changeIdentity = async (uid, identity) => {
    let res = await service.api.userE.userChangeIdentity(uid, identity)
    if(res.result){
        tips('操作成功', 'success')
    } else {
        tips(res.error.message, 'error')
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

        let response = await service.api.userE.createUser(inform)
        if(!response.result){
            tips(response.error.message, 'error')
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
    let response = await service.api.userE.removeUser(id)
    if(response.result){
        tips('操作成功', 'success')
        await getUsers()
    } else {
        tips(response.error.message, 'error')
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