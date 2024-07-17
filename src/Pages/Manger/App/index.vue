<template>
    <t-card class="user-group-card" :bordered="false">
        <action-bar @add-new="createItem" @reload="getData()" />
        <data-table :loading="loading" :data="data" @edit="editItem" @delete="removePackage" />
        <t-pagination
            size="small"
            :disabled="loading"
            v-model:current="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-size-options="pagination.pageSizeOptions"
            @current-change="getData()"
            @page-size-change="() => {
                pagination.current = 1
                getData()
            }"
            style="margin-top: 10px;"
        />
        <edit-dialog :data="data" ref="editDialog" @reload="getData()" />
    </t-card>
</template>

<script setup>
import DataTable from './Model/DataTable.vue'
import EditDialog from './Model/EditDialog.vue'
import ActionBar from './Model/ActionBar.vue'
import {tips} from "../../../hooks/tips.js"
import {request} from "../../../api/request.js"

const data = ref([])
const loading = ref(false)
const editDialog = ref(null)
const pagination = ref({
    current: 1,
    pageSize: 30,
    pageSizeOptions: [30, 50, 100],
    total: 0
})
const editItem = (index) => {
    editDialog.value.open(data.value[index])
}
const createItem = () => {
    editDialog.value.open()
}
const getData = async () => {
    loading.value = true
    let res = await request('/app', {
        skip: (pagination.value.current - 1) * pagination.value.pageSize,
        limit: pagination.value.pageSize
    })
    if(res.status === 'success'){
        data.value = res.content
        pagination.value.total = res.content.length
    } else {
        tips(res.error.msg, 'error')
    }
    loading.value = false
}
const removePackage = async (id) => {
    let res = await request('/app', {
        id
    }, 'DELETE')
    if(res.status === 'success'){
        tips('删除成功', 'success')
        await getData()
    } else {
        tips(res.error.msg, 'error')
    }
}

onMounted(() => {
    getData()
})
</script>

<style>
.user-group-card {
    max-width: calc(100vw - 30px);
    margin: 15px auto;
}
</style>