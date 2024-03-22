<template>
    <t-dialog
    v-model:visible="visible"
    width="850px"
    top="10vh"
    :footer="false"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    destroy-on-close
    @close="resourse = null"
    >
        <template #header>
            <t-icon name="user-avatar" />
            {{ i18n.edit[i18n.language] }}
            {{ i18n.avatar[i18n.language] }}
        </template>
        <t-upload
        style="margin: 10px 3px; "
        ref="uploader"
        @change="async (value) => {
            resourse = await imageFileToBase(value)
        }"
        :auto-upload="false"
        accept="image/*"
        >
            <template #file-list-display><div></div></template>
        </t-upload>
        <t-space align="start" style="padding: 3px;">
            <VuePictureCropper
            v-if="resourse != null"
            :style="{
                margin: '0 auto',
                width: '360px',
                height: '360px'
            }"
            :img="resourse"
            :options="{
                viewMode: 1,
                dragMode: 'fixedRatioWithFixedSize',
                aspectRatio: 1 / 1,
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
            resourse = null
            isImage = null
        }"
        noreset
        />
    </t-dialog>
</template>

<script>
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import confirmBar from '../../components/confirmBar.vue'
import { imageFileToBase, updateUserInfo } from '../../hooks'

export default {
    components: {
        VuePictureCropper,
        confirmBar
    },
    emits: ['done'],
    setup(props, { emit }){
        const i18n = inject('i18n')
        const user = inject('user')
        const serve = inject('serve')

        const visible = ref(false)
        const resourse = ref(null)
        const isImage = ref(null)
        const files = ref([])
        const uploader = ref(null)

        const showResult = () => {
            isImage.value = cropper.getDataURL()
        }

        const open = (url) => {
            visible.value = true
            if(url && url !== ''){
                resourse.value = url
            } else {
                setTimeout(() => {
                    uploader.value.triggerUpload()
                }, 300)
            }
        }
        const loading = ref(false)
        const fileUpload = async (file) => {
            let formData = new FormData
            formData.append('file', file)

            return fetch(serve + '/import/upload/image', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return Promise.resolve(response.json())
                } else {
                    MessagePlugin.error(i18n.httpFail[i18n.language])
                }
            })
        }
        const confirm = async () => {
            loading.value = true

            let file = await cropper.getFile()
            let fileUploaded = await fileUpload(file)
            let res = await updateUserInfo({
                uid: user.inform.uid,
                headsrc: fileUploaded.href
            })
            if(res.result){
                user.inform.headsrc = fileUploaded.href
                MessagePlugin.success(i18n.editSuccess[i18n.language])
                visible.value = false
                emit('done')
            }
            
            loading.value = false
        }
        
        return {
            i18n,
            visible,
            resourse,
            isImage,
            showResult,
            open,
            confirm,
            loading,
            files,
            imageFileToBase,
            uploader
        }
    }
}
</script>

<style>

</style>