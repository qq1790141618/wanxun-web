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
        <t-form-item :label="getString('brandBarcodePrefix')" name="suffix">
            <t-input
                v-model="formData.suffix"
                @change="$emit('update:form', formData)"
                style="width: 270px;"
                maxlength="2"
                :show-limit-number="true"
            />
        </t-form-item>
        <t-form-item :label="getString('brandLogo')" name="logo" >
            <div>
                <img :src="formData.logo" v-if="formData.logo" alt="" style="margin-bottom: 5px; max-height: 60px; max-width: 100px; object-fit: contain;" />
                <br>
                <t-upload
                    accept="image/*"
                    :request-method="imageUploadRequest"
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
import {apiSign, request} from "../../../api/request.js";
import host from "../../../api/host.js";
import {getToken} from "../../../hooks/user.js";
import {tips} from "../../../hooks/tips.js";

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
    id: [{ required: true, trigger: 'blur' }],
    name: [{ required: true, trigger: 'blur' }],
    suffix: [{ required: true, trigger: 'blur' }],
    logo: [{ required: true, trigger: 'blur' }]
}
const confirm = async () => {
    return await formRef.value.validate()
}
defineExpose({
    confirm
})

const imageUploadRequest = async (file) => {
    let f = new FormData
    f.append('name', file.name)
    f.append('file', file.raw)
    let response = await request('/file/upload', f, 'POST', false)
    if(response.status !== 'success'){
        tips(res.error.msg, 'error')
        return {
            status: 'fail',
            error: res.error.msg
        }
    } else {
        formData.logo = response.content
        emit('update:form', formData)
        return {
            status: 'success',
            response: {url: response.content}
        }
    }
}

watch(() => props.form, (newValue) => {
    formData.id = newValue.id
    formData.name = newValue.name
    formData.suffix = newValue.suffix
    formData.logo = newValue.logo
})
</script>

<style scoped>

</style>