<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    header="错误信息"
    width="50vw"
    >
        <t-table :data="data" :columns="columns" max-height="50vh"></t-table>
    </t-dialog>
</template>

<script>
export default {
    setup() {
        const visible = ref(false)
        const open = (error) => {
            data.value = error
            visible.value = true
        }
        const data = ref([])
        const columns = ref([
            {
                colKey: 'reason',
                title: '错误信息',
                width: 200
            },
            {
                colKey: 'item',
                title: '堆栈信息'
            }
        ])

        return {
            visible,
            open,
            data,
            columns
        }
    }
}
</script>

<style>

</style>