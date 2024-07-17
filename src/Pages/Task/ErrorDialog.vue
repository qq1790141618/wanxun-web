<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    :header="getString('errorInform')"
    width="50vw"
    >
        <t-table :data="data" :columns="columns" max-height="50vh"></t-table>
    </t-dialog>
</template>

<script setup>
import {getString} from "../../i18n/index.js";

const visible = ref(false)
const open = (error) => {
    data.value = error
    visible.value = true
}
const data = ref([])
const columns = ref([
    {
        colKey: 'item',
        title: getString('stackInform'),
        width: 160
    },
    {
        colKey: 'reason',
        title: getString('errorInform')
    }
])

defineExpose({ open })
</script>

<style>

</style>