<template>
    <t-form
    ref="formRef"
    :colon="true"
    :data="formData"
    :rules="FORM_RULES"
    :label-width="150"
    >
        <t-form-item :label="getString('storeId')" name="id">
            <t-input
                v-model="formData.id"
                @change="$emit('update:form', formData)"
                style="width: 270px;"
                maxlength="10"
                :disabled="type === 'edit'"
            />
        </t-form-item>
        <t-form-item :label="getString('storeName')" name="name">
            <t-input
                v-model="formData.name"
                @change="$emit('update:form', formData)"
                style="width: 270px;"
                maxlength="20"
            />
        </t-form-item>
        <t-form-item :label="getString('storeBrand')" name="brand">
            <t-checkbox-group v-model="formData.brand" @change="$emit('update:form', formData)">
                <t-checkbox
                    v-for="item in shop.brandOptions"
                    :value="item['id']"
                >
                    {{ item['name'] }}
                </t-checkbox>
            </t-checkbox-group>
        </t-form-item>
        <t-form-item :label="getString('storeLocation')" name="location">
            <t-textarea
                v-model="formData.location"
                @change="$emit('update:form', formData)"
                maxlength="120"
            />
        </t-form-item>
    </t-form>
</template>

<script setup>
import {getString} from "../../../i18n/index.js";

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
let formData = reactive({
    id: null,
    name: null,
    brand: [],
    location: null
})
const FORM_RULES = {
    id: [{ required: true }],
    name: [{ required: true }]
}
const confirm = async () => {
    return await formRef.value.validate()
}
defineExpose({
    confirm
})

watch(() => props.form, (newValue) => {
    formData.id = newValue.id
    formData.name = newValue.name
    formData.brand = newValue.brand
    formData.location = newValue.location
})
</script>

<style scoped>

</style>