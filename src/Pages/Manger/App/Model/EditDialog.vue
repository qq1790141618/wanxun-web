<template>
    <t-dialog
    v-model:visible="visible"
    placement="center"
    width="600"
    :header="i18n['editPackage'][i18n.language]"
    :footer="null"
    :close-btn="false"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    @closed="clearAllInfo"
    >
        <t-form
        :data="formData"
        :rules="rules"
        label-width="100px"
        :colon="true"
        resetType="initial"
        @submit="onSubmit"
        style="max-height: 80vh; overflow-y: auto;"
        scroll-to-first-error="smooth"
        layout="inline"
        >
            <t-form-item :label="i18n['platform'][i18n.language]" name="platform">
                <t-select v-model="formData.platform" :options="Controller.platformOptions" style="width: 270px;"  @change="getSuffix" />
            </t-form-item>
            <t-form-item :label="i18n['version'][i18n.language]" name="version">
                <t-input v-model="formData.version" style="width: 270px;" />
            </t-form-item>
            <t-form-item :label="i18n['versionId'][i18n.language]" name="version_id">
                <t-input-number v-model="formData.version_id"  style="width: 270px;" />
            </t-form-item>
            <t-form-item :label="i18n['versionType'][i18n.language]" name="version_type">
                <t-select v-model="formData.version_type" :options="Controller.versionTypeOptions" style="width: 270px;" />
            </t-form-item>
            <t-form-item :label="i18n['packageUpload'][i18n.language]" name="package_resource">
                <t-upload
                v-model:files="files"
                theme="file"
                :action="`${host}/app/package/upload?api_sign=${uploadSign}&access_token=${getToken()}`"
                :accept="suffix"
                :draggable="true"
                @success="handleSuccess"
                >
                </t-upload>
            </t-form-item>
            <t-form-item :label="i18n['updateInfo'][i18n.language]" name="package_update_information" style="width: 100%;">
                <t-textarea v-model="formData.package_update_information" />
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
import service from "../../../../api/service.js"
import host from "../../../../api/host.js"
import {apiSign} from "../../../../api/request.js"
import {getToken} from "../../../../hooks/user.js"

const visible = ref(false)
const user = inject('user')
const i18n = inject('i18n')
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
        const name = (info.package_resource.split('/')).pop();
        files.value = [
            {
                lastModified: dayjs(info.publish).duration,
                name: name,
                percent: 100,
                response: {
                    result: true,
                    name: name,
                    href: info.package_resource
                },
                size: info.package_size,
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
    formData.value.package_resource = context.file.response.href
    formData.value.package_size = context.file.size
}

const versionIdCheck = (val) => {
    if(formData.value.package_id){
        return { result: true }
    }
    for (let i = 0; i < props.data.length; i++) {
        if(props.data[i].version_id === val){
            return { result: false, message: '不可于已存在的软件包版本号一致', type: 'error' }
        }
        if(props.data[i].platform === formData.value.platform && props.data[i].version_id > val){
            return { result: false, message: '不可于相同平台下小于已发布版本的版本编号', type: 'error' }
        }
    }
    return { result: true }
}
const rules = {
    platform: [{ required: true, type: 'error' }],
    version: [{ required: true, type: 'error', trigger: 'blur' }],
    version_id: [
        { required: true, type: 'error', trigger: 'blur' },
        { validator: versionIdCheck }
    ],
    version_type: [{ required: true, type: 'error', trigger: 'blur' }],
    package_resource: [{ required: true, message: '必须上传软件包', type: 'error', trigger: 'blur' }]
}
const submitRun = ref(false)
const onSubmit = async ({ validateResult, firstError }) => {
    if (validateResult === true) {
        submitRun.value = true
        let res = await service.api.app.appPublish(formData.value)
        if(res.result){
            tips('操作成功', 'success')
            clearAllInfo()
        } else {
            tips(res.error.message, 'error')
        }
        submitRun.value = false
    } else {
        tips(firstError, 'error')
    }
}

defineExpose({ open })
</script>

<style>

</style>