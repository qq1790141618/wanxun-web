<template>
    <t-form
    ref="formRef"
    :colon="true"
    :data="formData"
    :rules="FORM_RULES"
    >
        <t-form-item label="ID" name="identity">
            <t-input v-model="formData.identity" @change="$emit('update:form', formData)"></t-input>
        </t-form-item>
        <t-form-item :label="getString('identityName')" name="identity">
            <t-input v-model="formData.name" @change="$emit('update:form', formData)"></t-input>
        </t-form-item>
        <t-form-item :label="getString('createBy')" name="createByIdentity">
            <t-select
                v-model="formData.createByIdentity"
                @change="$emit('update:form', formData)"
                :placeholder="user.inform.identity"
                :clearable="true"
            >
                <t-option
                v-for="item in identityOptions"
                :value="item.identity"
                :label="item.name"
                :disabled="item.createBy.indexOf(user.inform.identity) < 0"
                >
                </t-option>
            </t-select>
        </t-form-item>
    </t-form>
</template>

<script setup>
import {getString} from "../../../i18n/index.js"

const props = defineProps({
    form: {
        type: Object,
        default: []
    },
    identityOptions: {
        type: Array,
        required: true
    }
})
const emit = defineEmits(['update:form'])

const user = inject('user')
const formRef = ref(null)
const formData = ref({
    identity: null,
    name: null,
    createByIdentity: null
})
const FORM_RULES = {
    identity: [{ required: true }],
    name: [{ required: true }]
}
const confirm = async () => {
    return await formRef.value['validate']()
}
defineExpose({
    confirm
})

watch(() => props.form, (newValue) => {
    formData.value.identity = newValue.identity
    formData.value.name = newValue.name
    if(newValue.createByIdentity){
        formData.value.createByIdentity = newValue.createByIdentity
    } else {
        formData.value.createByIdentity = null
    }
})
</script>

<style scoped>

</style>