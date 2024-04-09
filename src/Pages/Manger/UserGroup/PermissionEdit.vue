<template>
    <t-loading style="width: 100%; height: 160px; " size="small" :text="i18n['loading'][i18n.language]" :loading="loading" />
    <t-collapse v-if="!loading" :default-expand-all="true">
        <t-collapse-panel
        v-for="(group, key) in apiData"
        :value="key"
        :header="keyTitle[key]"
        >
            <template #headerRightContent>
                <t-space size="small">
                    <t-checkbox @change="(value) => {
                        addAllPermission(value, key)
                    }" :checked="apiSelected[key].length === apiData[key].map(item => item['route']).length">
                        {{ i18n['openAll'][i18n.language] }}
                    </t-checkbox>
                </t-space>
            </template>
            <t-checkbox-group v-model="apiSelected[key]" @change="$emit('update:permission', sumPermissions())">
                <t-checkbox
                v-for="item in group"
                :value="item['route']"
                >
                    {{ item['name'] }}
                </t-checkbox>
            </t-checkbox-group>
        </t-collapse-panel>
    </t-collapse>
</template>

<script setup>
import service from "../../../api/service.js"
import {tips} from "../../../hooks/tips.js"
import {translate} from "../../../hooks/index.js"
import {getLanguage} from "../../../i18n/index.js"

const i18n = inject('i18n')
const user = inject('user')
const apiData = ref({})
const apiAllData = ref([])
const apiSelected = ref([])
const keyTitle = ref({})
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

    let res = await service.api.userM.apiView()
    if(res.result){
        apiAllData.value = res.content
        for (let i = 0; i < res.content.length; i++){
            if(res.content[i]['need_auth'] && (!user.inform['need_auth'] || user.inform['api_p'].indexOf(res.content[i].route) >= 0)){
                let key = res.content[i].group

                apiData.value[key] = apiData.value[key] ?? []
                apiSelected.value[key] = apiSelected.value[key] ?? []
                apiData.value[key].push(res.content[i])

                if(!keyTitle.value[key]){
                    let res = await translate(key, getLanguage())
                    keyTitle.value[key] = res['trans_result'][0]['dst']
                }
            }
        }
    } else {
        tips(res.error.message, 'error')
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
        let api = apiAllData.value.find(item => item['route'] === p)
        apiSelected.value[api['group']] = apiSelected.value[api['group']] ?? []
        if(apiSelected.value[api['group']].indexOf(api['route']) < 0){
            apiSelected.value[api['group']].push(api['route'])
        }
    }
}
watch(() => props.permission, () => {
    initPermissionProps()
})

const addAllPermission = (status, key) => {
    if(status){
        apiSelected.value[key] = apiData.value[key].map(item => item['route'])
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