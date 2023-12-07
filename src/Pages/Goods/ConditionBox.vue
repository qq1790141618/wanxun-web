<template>
    <t-card
    class="condition-box"
    :bordered="false"
    >
        <template #header>
            <span>
                <t-icon name="search"></t-icon>
                {{ i18n.condition[i18n.language] }}
            </span>
        </template>
        <t-form label-width="0" style="height: calc(100vh - 250px); overflow-y: auto;">
            <t-form-item>
                <t-select
                v-model="condition.type"
                :options="[
                    {
                        label: i18n.stylenumber[i18n.language],
                        value: 'stylenumber'
                    },
                    {
                        label: i18n.productnumber[i18n.language],
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
                        label: i18n['miaostreet-id'][i18n.language],
                        value: 'miaostreet-id'
                    }
                ]"
                >
                </t-select>
            </t-form-item>
            <t-form-item>
                <t-textarea
                v-model="condition.content"
                :placeholder="i18n.tip1[i18n.language]"
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
                :placeholder="i18n.choose[i18n.language] + i18n.category[i18n.language]"
                >
                </t-cascader>
            </t-form-item>
            <t-form-item>
                <t-select
                v-model="condition.supplier"
                :options="supplierOptions"
                clearable
                filterable
                :placeholder="i18n.choose[i18n.language] + i18n.supplier[i18n.language]"
                >
                </t-select>
            </t-form-item>
            <t-form-item>
                <div>
                    {{ i18n.unUpload[i18n.language] }}:
                    <t-check-tag-group
                    v-model="condition.unUpload"
                    :options="[
                        {
                            label: i18n.supplier[i18n.language],
                            value: 'supplier'
                        },
                        {
                            label: i18n.mainImage[i18n.language],
                            value: 'main-image'
                        },
                        {
                            label: i18n.price[i18n.language],
                            value: 'price'
                        },
                        {
                            label: i18n.cost[i18n.language],
                            value: 'cost'
                        },
                        {
                            label: i18n.firstListingTime[i18n.language],
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
        :confirm-loading="loading"
        @confirm="$emit('confirm')"
        @reset="$emit('reset')"
        nocancel
        />
    </t-card>
</template>

<script>
import confirmBar from '../../components/confirmBar.vue'

export default {
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