<template>
    <t-card
        class="condition-box"
        :bordered="false"
    >
        <template #header>
            <span>
                <t-icon name="search"></t-icon>
                {{ getString('condition') }}
            </span>
        </template>
        <t-form
            ref="formRef"
            label-width="0"
            :data="form"
            resetType="initial"
            style="height: calc(100vh - 250px); overflow-y: auto;"
        >
            <t-form-item name="type">
                <t-select
                    v-model="form.type"
                    :options="[
                        {
                            label: getString('stylenumber'),
                            value: 'styleNumber'
                        },
                        {
                            label: getString('productnumber'),
                            value: 'product'
                        },
                        {
                            label: 'SKU',
                            value: 'sku'
                        },
                        {
                            label: getString('miaostreet-id'),
                            value: 'id'
                        }
                    ]"
                >
                </t-select>
            </t-form-item>
            <t-form-item name="content">
                <t-textarea
                    v-model="form.content"
                    :placeholder="getString('tip1')"
                    :autosize="{ minRows: 5, maxRows: 15 }"
                >
                </t-textarea>
            </t-form-item>
            <t-form-item name="category">
                <t-cascader
                    v-model="form.category"
                    :options="categoryOptions"
                    :placeholder="getString('choose') + getString('category')"
                    :clearable="true"
                    :filterable="true"
                >
                </t-cascader>
            </t-form-item>
            <t-form-item name="supplier">
                <t-select
                    v-model="form.supplier"
                    :placeholder="getString('choose') + getString('supplier')"
                    :clearable="true"
                    :filterable="true"
                >
                    <t-option
                        v-for="item in supplierOptions"
                        :key="item"
                        :value="item"
                        :label="item"
                    />
                </t-select>
            </t-form-item>
            <t-form-item name="unUpload">
                <div>
                    {{ getString('unUpload') }}:
                    <t-check-tag-group
                        v-model="form.unUpload"
                        :options="[
                            {
                                label: getString('supplier'),
                                value: 'supplier'
                            },
                            {
                                label: getString('image'),
                                value: 'image'
                            },
                            {
                                label: getString('price'),
                                value: 'price'
                            },
                            {
                                label: getString('cost'),
                                value: 'cost'
                            }
                        ]"
                        :checked-props="{
                            theme: 'primary',
                            variant: 'outline',
                            size: 'large',
                            style: {
                                marginBottom: '5px'
                            }
                        }"
                        :unchecked-props="{
                            theme: 'default',
                            variant: 'outline',
                            size: 'large',
                            style: {
                                marginBottom: '5px'
                            }
                        }"
                        style="margin: 8px 0;"
                        :multiple="true"
                    >
                    </t-check-tag-group>
                </div>
            </t-form-item>
        </t-form>
        <confirm-bar
            :confirm-loading="loading || exportLoading"
            @confirm="$emit('confirm')"
            @reset="formRef.reset()"
            nocancel
        />
    </t-card>
</template>

<script setup>
import confirmBar from '../../components/confirmBar.vue'
import { getString } from "../../i18n/index.js"

const props = defineProps({
    condition: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    exportLoading: {
        type: Boolean,
        default: false
    },
    categoryOptions: {
        type: Array,
        required: true,
        default: []
    },
    supplierOptions: {
        type: Array,
        required: true,
        default: []
    }
})
const emit = defineEmits(['confirm', 'update:condition'])
const i18n = inject('i18n')
const formRef = ref()
const reset = () => {
    formRef.value.reset()
}
const form = reactive({
    type: 'styleNumber',
    content: null,
    unUpload: [],
    category: null,
    supplier: null
})
watch(form, (newVal) => {
    emit('update:condition', newVal)
})
watch(props.condition, (newVal) => {
    form.type = newVal.type
    form.content = newVal.content
    form.unUpload = newVal.unUpload
    form.category = newVal.category
    form.supplier = newVal.supplier
})
defineExpose({
    reset
})
</script>

<style>
.condition-box{
    position: sticky;
    top: 65px;
    left: 0;
    width: 300px;
    height: calc(100vh - 110px);
    margin: 10px;
    background: #fff url('../../assets/search.png') no-repeat 75% 96%;
    background-origin: -10px -10px;
    background-size: 80% auto;
}
</style>