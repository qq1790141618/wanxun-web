<template>
    <t-form
    ref="formRef"
    :colon="true"
    :data="formData"
    :rules="FORM_RULES"
    @submit="onSubmit"
    >
        <t-form-item :label="i18n['username'][i18n.language]" name="username">
            <t-input
                v-model="formData.username"
                @change="$emit('update:form', formData)"
                style="width: 270px;">
            </t-input>
        </t-form-item>
        <t-form-item :label="i18n['realname'][i18n.language]" name="realname">
            <t-input
            v-model="formData.realname"
            @change="$emit('update:form', formData)"
            style="width: 270px;">
            </t-input>
        </t-form-item>
        <t-form-item :label="i18n['userIdentity'][i18n.language]" name="identity">
            <t-select
            :options="identityOptions"
            v-model="formData.identity"
            @change="$emit('update:form', formData)"
            style="width: 180px;"
            ></t-select>
        </t-form-item>
        <t-form-item :label="i18n['phone'][i18n.language]" name="phone">
            <t-input-number
            v-model="formData.phone"
            @change="$emit('update:form', formData)"
            theme="normal"
            :max="19999999999"
            style="width: 240px;"
            ></t-input-number>
        </t-form-item>
        <t-form-item :label="i18n['mail'][i18n.language]" name="mail">
            <t-input
            v-model="formData.mail"
            @change="$emit('update:form', formData)"
            style="width: 270px;"
            ></t-input>
        </t-form-item>
        <t-form-item :label="i18n['nickname'][i18n.language]" name="nickname">
            <t-input
            v-model="formData.nickname"
            @change="$emit('update:form', formData)"
            style="width: 270px;"
            ></t-input>
        </t-form-item>
        <t-form-item :label="i18n['password'][i18n.language]" name="nickname">
            <t-input
            v-model="formData.nickname"
            @change="$emit('update:form', formData)"
            type="password"
            style="width: 270px;"
            ></t-input>
        </t-form-item>
        <t-form-item :label="i18n['hiredate'][i18n.language]" name="hiredate">
            <t-date-picker v-model="formData.hiredate" @change="$emit('update:form', formData)" ></t-date-picker>
        </t-form-item>
        <t-form-item :label="i18n['birthday'][i18n.language]" name="birthday">
            <t-date-picker v-model="formData.birthday" @change="$emit('update:form', formData)" ></t-date-picker>
        </t-form-item>
    </t-form>
</template>

<script setup>

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

const i18n = inject('i18n')
const formRef = ref(null)
const formData = ref({
    username: null,
    phone: null,
    mail: null,
    identity: "user",
    nickname: null,
    realname: null,
    hiredate: null,
    birthday: null,
    password: null
})
const FORM_RULES = {
    username: [{ required: true }],
    identity: [{ required: true }],
    realname: [{ required: true }],
    phone: [{ required: true }]
}
const confirm = async () => {
    return await formRef.value.validate()
}
defineExpose({
    confirm
})

watch(() => props.form, (newValue) => {
    for (const newValueKey in newValue) {
        if(formData[newValueKey] || formData[newValueKey] == null){
            formData[newValueKey] = newValue[newValueKey]
        }
    }
})
</script>

<style scoped>

</style>