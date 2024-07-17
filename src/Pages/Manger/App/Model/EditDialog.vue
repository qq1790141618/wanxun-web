<template>
    <t-dialog
        v-model:visible="visible"
        placement="center"
        width="700"
        :header="getString('editPackage')"
        :footer="null"
        :close-btn="false"
        :close-on-esc-keydown="false"
        :close-on-overlay-click="false"
        @closed="clearAllInfo"
    >
        <t-form
            :data="formData"
            :rules="rules"
            :label-width="200"
            :colon="true"
            resetType="initial"
            @submit="onSubmit"
            style="max-height: 80vh; overflow-y: auto;"
            scroll-to-first-error="smooth"
            layout="inline"
        >
            <t-form-item :label="getString('platform')" name="platform">
                <t-select v-model="formData.platform" :options="Controller.platformOptions" style="width: 270px;"  @change="getSuffix" />
            </t-form-item>
            <t-form-item :label="getString('version')" name="version">
                <t-input v-model="formData.version" style="width: 270px;" />
            </t-form-item>
            <t-form-item :label="getString('versionId')" name="versionId">
                <t-input-number v-model="formData.versionId"  style="width: 270px;" />
            </t-form-item>
            <t-form-item :label="getString('versionType')" name="versionId">
                <t-select v-model="formData.type" :options="Controller.versionTypeOptions" style="width: 270px;" />
            </t-form-item>
            <t-form-item :label="getString('packageUpload')" name="resource">
                <t-upload
                    v-model:files="files"
                    theme="file"
                    :accept="suffix"
                    :draggable="true"
                    :request-method="requestMethod"
                    @success="handleSuccess"
                >
                </t-upload>
            </t-form-item>
            <t-form-item :label="getString('updateInfo')" name="info" style="width: 100%;">
                <t-textarea v-model="formData.info" />
            </t-form-item>
            <t-form-item>
                <confirm-bar :confirm-loading="submitRun" @close="clearAllInfo" />
            </t-form-item>
        </t-form>
    </t-dialog>
</template>

<script setup>
import dayjs from 'dayjs'
import Controller from '../Controller'
import { tips } from "../../../../hooks/tips.js"
import confirmBar from "../../../../components/confirmBar.vue"
import { apiSign, request } from "../../../../api/request.js"
import { getString } from "../../../../i18n/index.js"

const visible = ref(false)
const user = inject('user')
const props = defineProps({
    data: {
        type: Array,
        require: true
    }
})
const emit = defineEmits(['reload'])

const uploadSign = ref('')
const getUploadSign = async () => {
    uploadSign.value = await apiSign('/app/package/upload')
}
getUploadSign()

const isAddNew = ref(false)
const formData = ref({})
const lastData = ref({})
const files = ref([])
const open = (info) => {
    visible.value = true
    if(info){
        formData.value = info
        lastData.value = info
        const name = (info.resource.split('/')).pop()
        files.value = [
            {
                lastModified: dayjs(info.publish).duration,
                name: name,
                percent: 100,
                response: {
                    result: true,
                    name: name,
                    href: info.resource
                },
                size: info.size,
                status: "success",
                type: "",
                uploadTime: info.publish,
                url: undefined
            }
        ]
    } else {
        isAddNew.value = true
    }
}
const clearAllInfo = () => {
    files.value = []
    formData.value = {}
    lastData.value = {}
    isAddNew.value = false
    visible.value = false
}
const suffix = ref(null)
const getSuffix = () => {
    const platform = Controller.platformOptions.find((item) => item.value === formData.value.platform);
    if(platform && platform.suffix){
        suffix.value = platform.suffix
    }
}
const handleSuccess = (context) => {
    formData.value.resource = context.file.response.url
    formData.value.size = context.file.size
}
const versionIdCheck = async (val) => {
    if(formData.value.id){
        return { result: true }
    }
    for (let i = 0; i < props.data.length; i++) {
        if(props.data[i].versionId === val){
            return { result: false, message: '不可于已存在的软件包版本号一致', type: 'error' }
        }
        if(props.data[i].platform === formData.value.platform && props.data[i].versionId > val){
            return { result: false, message: '不可于相同平台下小于已发布版本的版本编号', type: 'error' }
        }
    }
    return { result: true }
}
const rules = {
    platform: [{ required: true, type: 'error', trigger: 'change' }],
    version: [{ required: true, type: 'error', trigger: 'blur' }],
    versionId: [
        { required: true, type: 'error', trigger: 'blur' },
        { validator: versionIdCheck }
    ],
    type: [{ required: true, type: 'error', trigger: 'blur' }],
    resource: [{ required: true, message: '必须上传软件包', type: 'error', trigger: 'blur' }]
}
const submitRun = ref(false)
const onSubmit = async ({ validateResult, firstError }) => {
    if (validateResult === true) {
        submitRun.value = true
        let res = await request('/app', formData.value, 'PUT')
        if(res.status === 'success'){
            tips('操作成功', 'success')
            emit('reload')
            clearAllInfo()
        } else {
            tips(res.error.msg, 'error')
        }
        submitRun.value = false
    } else {
        tips(firstError, 'error')
    }
}
const requestMethod = (files) => {
    return new Promise(async (resolve, reject) => {
        const file = files.raw
        let f = new FormData
        f.append('name', file.name)
        f.append('file', file)
        let response = await request('/file/upload', f, 'POST', false)
        if(response.status !== 'success'){
            reject({
                status: 'fail',
                error: response.error.msg
            })
        } else {
            resolve({
                status: 'success',
                response: {
                    url: response.content
                }
            })
        }
    })
}

defineExpose({ open })
</script>

<style>

</style>