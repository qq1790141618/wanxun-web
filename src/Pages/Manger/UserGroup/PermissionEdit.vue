<template>
    <t-loading
        style="width: 100%; height: 160px; "
        size="small"
        :text="getString('loading')"
        :loading="loading"
    />
    <t-collapse
        v-if="!loading"
        :default-expand-all="true"
    >
        <t-collapse-panel
            v-for="(group, key) in apiData"
            :value="key"
            :header="key"
        >
            <template #headerRightContent>
                <t-space size="small">
                    <t-checkbox
                        @change="(value) => {
                            addAllPermission(value, key)
                        }"
                        :checked="apiSelected[key].length === apiData[key].map(item => item.id).length"
                    >
                        {{ getString('openAll') }}
                    </t-checkbox>
                </t-space>
            </template>
            <t-checkbox-group
                v-model="apiSelected[key]"
                @change="$emit('update:permission', sumPermissions())"
            >
                <t-checkbox
                v-for="item in group"
                :value="item.id"
                >
                    {{ item['name'] }}
                </t-checkbox>
            </t-checkbox-group>
        </t-collapse-panel>
    </t-collapse>
</template>

<script setup>
import {tips} from "../../../hooks/tips.js"
import {getString} from "../../../i18n/index.js"
import {request} from "../../../api/request.js"

const i18n = inject('i18n')
const user = inject('user')
const apiData = ref({})
const apiSelected = ref({})
const apiAllData = ref([])
const props = defineProps({
    permission: {
        type: Array,
        default: []
    }
})
const emit = defineEmits(['update:permission'])

const loading = ref(true)
const getApiData = async () => {
    apiData.value = {}
    apiAllData.value = []

    let res = await request('/user/apis')
    if(res.status === 'success'){
        apiAllData.value = res.content
        for (let i = 0; i < res.content.length; i++){
            let item = res.content[i]
            if(item.needAuth && (!user.inform.needAuth || user.inform.permissions.indexOf(res.content[i].id) >= 0)){
                let key = item.groupName
                apiData.value[key] = apiData.value[key] ?? []
                apiSelected.value[key] = apiSelected.value[key] ?? []
                apiData.value[key].push(res.content[i])
            }
        }
    } else {
        tips(res.error.msg, 'error')
    }

    initPermissionProps()
    loading.value = false
}
const initPermissionProps = () => {
    if(apiAllData.value.length === 0){
        return
    }
    for (const key in apiSelected.value) {
        apiSelected.value[key] = []
    }
    for (let i = 0; i < props.permission.length; i++){
        let p = props.permission[i]
        let api = apiAllData.value.find(item => item.id === p)
        let key = api.groupName
        apiSelected.value[key] = apiSelected.value[key] ?? []
        if(apiSelected.value[key].indexOf(api.id) < 0){
            apiSelected.value[key].push(api.id)
        }
    }
}
watch(() => props.permission, () => {
    initPermissionProps()
})
const addAllPermission = (status, key) => {
    if(status){
        apiSelected.value[key] = apiData.value[key].map(item => item.id)
    } else {
        apiSelected.value[key] = []
    }
    emit('update:permission', sumPermissions())
}
const sumPermissions = () => {
    let mergeArray = []
    for (const key in apiSelected.value) {
        mergeArray = mergeArray.concat(apiSelected.value[key])
    }
    return mergeArray
}

onMounted(() => {
    getApiData()
})
</script>

<style scoped>

</style>