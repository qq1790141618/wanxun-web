<template>
    <t-form
    ref="formRef"
    :colon="true"
    :data="formData"
    :rules="FORM_RULES"
    :label-width="150"
    >
        <t-form-item :label="getString('brandId')" name="id">
            <t-input-number
            v-model="formData.id"
            @change="$emit('update:form', formData)"
            style="width: 270px;"
            theme="normal"
            :max="999999"
            :disabled="type === 'edit'"
            />
        </t-form-item>
        <t-form-item :label="getString('brandName')" name="name">
            <t-input
            v-model="formData.name"
            @change="$emit('update:form', formData)"
            style="width: 270px;"
            maxlength="50"
            />
        </t-form-item>
        <t-form-item :label="getString('brandKeyword')" name="keyword">
            <t-input
            v-model="formData.keyword"
            @change="$emit('update:form', formData)"
            style="width: 270px;"
            maxlength="12"
            />
        </t-form-item>
        <t-form-item :label="getString('brandBarcodePrefix')" name="suffix">
            <t-input
            v-model="formData.suffix"
            @change="$emit('update:form', formData)"
            style="width: 270px;"
            maxlength="3"
            :show-limit-number="true"
            />
        </t-form-item>
        <t-form-item :label="getString('brandLogo')" name="logo" >
            <div>
                <img :src="formData.logo" v-if="formData.logo" alt="" style="margin-bottom: 5px; max-height: 60px; max-width: 100px; object-fit: contain;" />
                <br>
                <t-upload
                    :action="`${host}/import/upload/image?api_sign=${uploadSign}&access_token=${getToken()}`"
                    @success="imageSuccess"
                >
                    <template #file-list-display>
                        <div></div>
                    </template>
                </t-upload>
            </div>
        </t-form-item>
    </t-form>
</template>

<script setup>
import {getString} from "../../../i18n/index.js";
import {apiSign} from "../../../api/request.js";
import host from "../../../api/host.js";
import {getToken} from "../../../hooks/user.js";

const props = defineProps({
    type: {
        type: String,
        default: 'create'
    },
    form: {
        type: Object,
        default: []
    }
})
const emit = defineEmits(['update:form'])

const shop = inject('shop')
const formRef = ref(null)
let formData = reactive({})
const FORM_RULES = {
    id: [{ required: true }],
    name: [{ required: true }],
    suffix: [{ required: true }],
    logo: [{ required: true }],
    keyword: [{ required: true }]
}
const confirm = async () => {
    return await formRef.value.validate()
}
defineExpose({
    confirm
})

const uploadSign = ref('')
const getUploadSign = async () => {
    uploadSign.value = await apiSign('/import/upload/image')
}
getUploadSign()
const imageSuccess = (value) => {
    formData.logo = value.file.response.content.href
    emit('update:form', formData)
}

watch(() => props.form, (newValue) => {
    formData.id = newValue.id
    formData.name = newValue.name
    formData.suffix = newValue.suffix
    formData.logo = newValue.logo
    formData.keyword = newValue.keyword
})

let timer
onActivated(() => {
    timer = setInterval(() => {
        getUploadSign()
    }, 1000)
})
onDeactivated(() => {
    clearInterval(timer)
    timer = null
})
</script>

<style scoped>

</style>