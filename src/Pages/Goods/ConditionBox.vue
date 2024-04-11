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
        <t-form label-width="0" style="height: calc(100vh - 250px); overflow-y: auto;">
            <t-form-item>
                <t-select
                v-model="condition.type"
                :options="[
                    {
                        label: getString('stylenumber'),
                        value: 'stylenumber'
                    },
                    {
                        label: getString('productnumber'),
                        value: 'productnumber'
                    },
                    {
                        label: 'SKU',
                        value: 'SKU'
                    },
                    {
                        label: 'SPU ID',
                        value: 'spuid'
                    },
                    {
                        label: getString('miaostreet-id'),
                        value: 'miaostreet-id'
                    }
                ]"
                >
                </t-select>
            </t-form-item>
            <t-form-item>
                <t-textarea
                v-model="condition.content"
                :placeholder="getString('tip1')"
                :autosize="{ minRows: 5, maxRows: 15 }"
                >
                </t-textarea>
            </t-form-item>
            <t-form-item>
                <t-cascader
                v-model="condition.category"
                :options="categoryOptions"
                clearable
                filterable
                :placeholder="getString('choose') + getString('category')"
                >
                </t-cascader>
            </t-form-item>
            <t-form-item>
                <t-select
                v-model="condition.supplier"
                :options="supplierOptions"
                clearable
                filterable
                :placeholder="getString('choose') + getString('supplier')"
                >
                </t-select>
            </t-form-item>
            <t-form-item>
                <div>
                    {{ getString('unUpload') }}:
                    <t-check-tag-group
                    v-model="condition.unUpload"
                    :options="[
                        {
                            label: getString('supplier'),
                            value: 'supplier'
                        },
                        {
                            label: getString('mainImage'),
                            value: 'main-image'
                        },
                        {
                            label: getString('price'),
                            value: 'price'
                        },
                        {
                            label: getString('cost'),
                            value: 'cost'
                        },
                        {
                            label: getString('firstListingTime'),
                            value: 'first-listing-time'
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
                    multiple
                    >
                    </t-check-tag-group>
                </div>
            </t-form-item>
        </t-form>
        <confirm-bar
        :confirm-loading="loading || exportLoading"
        @confirm="$emit('confirm')"
        @reset="$emit('reset')"
        nocancel
        />
    </t-card>
</template>

<script>
import confirmBar from '../../components/confirmBar.vue'
import {getString} from "../../i18n/index.js";

export default {
    methods: {getString},
    components: {
        confirmBar
    },
    props: {
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
    },
    emits: ['confirm', 'reset'],
    setup(){
        const i18n = inject('i18n')

        return {
            i18n
        }
    }
}
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