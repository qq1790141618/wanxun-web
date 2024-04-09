<template>
    <t-card class="user-group-card" :bordered="false">
        <action-bar @add-new="createItem" @reload="getData()" />
        <data-table :loading="loading" :data="data" @edit="editItem" />
        <edit-dialog :data="data" ref="editDialog" @reload="getData()" />
    </t-card>
</template>

<script setup>
import DataTable from './Model/DataTable.vue'
import EditDialog from './Model/EditDialog.vue'
import ActionBar from './Model/ActionBar.vue'
import service from "../../../api/service.js";
import {tips} from "../../../hooks/tips.js";

const data = ref([])
const loading = ref(false)
const editDialog = ref(null)
const editItem = (index) => {
    editDialog.value.open(data.value[index])
}
const createItem = () => {
    editDialog.value.open()
}
const getData = async () => {
    loading.value = true
    let res = await service.api.app.appView()
    if(res.result){
        data.value = res.content
    } else {
        tips(res.error.message, 'error')
    }
    loading.value = false
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