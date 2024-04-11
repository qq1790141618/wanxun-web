<template>
    <t-dialog
    v-model:visible="visible"
    width="850px"
    top="10vh"
    :footer="false"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :destroy-on-close="false"
    @close="resource = null"
    >
        <template #header>
            <t-icon name="user-avatar" />
            {{ getString('edit') }}
            {{ getString('avatar') }}
        </template>
        <t-upload
        style="margin: 10px 3px; "
        ref="uploader"
        @change="async (value) => {
            resource = await imageFileToBase(value)
        }"
        :auto-upload="false"
        accept="image/*"
        >
            <template #file-list-display><div></div></template>
        </t-upload>
        <t-space align="start" style="padding: 3px;">
            <VuePictureCropper
            v-if="resource !== null"
            :style="{
                margin: '0 auto',
                width: '360px',
                height: '360px'
            }"
            :img="resource"
            :options="{
                viewMode: 1,
                dragMode: 'fixedRatioWithFixedSize',
                aspectRatio: 1,
                autoCropArea: 1,
                cropBoxResizable: false,
                cropBoxMovable: true
            }"
            :presetMode="{
                mode: 'move',
                width: 1000,
                height: 1000
            }"
            @ready="showResult"
            @cropstart="showResult"
            @cropmove="showResult"
            @zoom="showResult"
            />
            <div v-for="item in [200, 100, 50]" :key="item">
                <t-image :src="isImage" :style="{ width: item + 'px', height: item + 'px' }">
                    <template #loading><div></div></template>
                    <template #error><div></div></template>
                </t-image>
                <p>{{ item + 'px' }}</p>
            </div>
        </t-space>
        <confirmBar
        style="margin: 10px 3px;"
        :confirm-loading="loading"
        @confirm="confirm"
        @close="() => {
            visible = false
            resource = null
            isImage = null
        }"
        :noreset="true"
        />
    </t-dialog>
</template>

<script setup>
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import confirmBar from '../../components/confirmBar.vue'
import { imageFileToBase } from '../../hooks'
import service from "../../api/service.js"
import {MessagePlugin} from "tdesign-vue-next"
import {getString} from "../../i18n/index.js"
import {tips} from "../../hooks/tips.js"

const emit = defineEmits(['done'])
const user = inject('user')
const serve = inject('serve')

const visible = ref(false)
const resource = ref(null)
const isImage = ref(null)
const files = ref([])
const uploader = ref(null)
const loading = ref(false)

const showResult = () => {
    isImage.value = cropper.getDataURL()
}

const open = (url) => {
    visible.value = true
    if(url && url !== ''){
        resource.value = url
    } else {
        setTimeout(() => {
            uploader.value.triggerUpload()
        }, 300)
    }
}

const confirm = async () => {
    loading.value = true

    let file = await cropper.getFile()
    let fileUploaded = await service.api.user.imageUpload(file)
    if(!fileUploaded.result){
        loading.value = false
        tips(fileUploaded.error.message, 'error')
        return
    }

    let res = await service.api.user.saveUserInform({
        headsrc: fileUploaded.content.href
    })

    if(res.result){
        user.inform.headsrc = fileUploaded.content.href
        visible.value = false
        emit('done')
        await MessagePlugin.success(getString('editSuccess'))
    } else {
        tips(res.error.message, 'error')
    }

    loading.value = false
}

defineExpose({ open })
</script>

<style>

</style>