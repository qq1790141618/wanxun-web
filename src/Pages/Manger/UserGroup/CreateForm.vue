<template>
    <t-form
    ref="formRef"
    :colon="true"
    :data="formData"
    :rules="FORM_RULES"
    @submit="onSubmit"
    >
        <t-form-item label="ID" name="identity">
            <t-input v-model="formData.identity" @change="$emit('update:form', formData)"></t-input>
        </t-form-item>
        <t-form-item :label="i18n['identityName'][i18n.language]" name="identity">
            <t-input v-model="formData.name" @change="$emit('update:form', formData)"></t-input>
        </t-form-item>
    </t-form>
</template>

<script setup>
const props = defineProps({
    form: {
        type: Object,
        default: []
    }
})
const emit = defineEmits(['update:form'])

const i18n = inject('i18n')
const formRef = ref(null)
const formData = ref({
    identity: null,
    name: null
})
const FORM_RULES = {
    identity: [{ required: true }],
    name: [{ required: true }]
}
const confirm = async () => {
    const result = await formRef.value.validate()
    return result
}
defineExpose({
    confirm
})

watch(() => props.form, (newValue) => {
    formData.value.identity = newValue.identity
    formData.value.name = newValue.name
})
</script>

<style scoped>

</style>