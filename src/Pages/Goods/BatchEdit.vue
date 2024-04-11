<template>
    <t-dialog
    :close-btn="false"
    v-model:visible="visible"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :footer="false"
    width="600px"
    attach="#goods-list"
    show-in-attached-element
    >
        <template #header>
            <t-icon name="edit" style="margin-right: 5px;" />
            {{ getString('batch') }}{{ getString('edit') }}
        </template>
        <t-row :gutter="[12, 12]" style="width: 100%;">
            <t-col :span="6">
                <t-auto-complete
                v-model="data.supplier"
                :options="supplierOptions.map(obj => obj.value)"
                :input-props="{
                    label: getString('supplier') + ': '
                }"
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="6">
                <t-cascader
                v-model="data['category-id']"
                :options="categoryOptions"
                clearable
                filterable
                :label="getString('category') + ': '"
                :placeholder="getString('choose') + getString('category')"
                >
                </t-cascader>
            </t-col>
            <t-col :span="6">
                <t-select
                v-model="data['miaostreet-listing-status']"
                :options="[
                    {
                        label: getString('listing'),
                        value: 1
                    },
                    {
                        label: getString('unlist'),
                        value: 0
                    }
                ]"
                clearable
                filterable
                :label="getString('miaostreetListingStatus') + ': '"
                >
                </t-select>
            </t-col>
            <t-col :span="6">
                <t-select
                v-model="data['tmall-listing-status']"
                :options="[
                    {
                        label: getString('listing'),
                        value: 1
                    },
                    {
                        label: getString('unlist'),
                        value: 0
                    }
                ]"
                clearable
                filterable
                :label="getString('tmallListingStatus') + ': '"
                >
                </t-select>
            </t-col>
            <t-col :span="8">
                <t-space size="13px">
                    <span style="line-height: 32px;">
                        {{ getString('firstListingTime') + ': ' }}
                    </span>
                    <t-date-picker
                    v-model="data['first-listing-time']"
                    :disable-date="(current) => dayjs(current).isAfter(dayjs())"
                    >
                    </t-date-picker>
                </t-space>
            </t-col>
            <t-col :span="12">
                <confirm-bar
                :confirm-loading="loading"
                @confirm="done"
                @close="() => {
                    visible = false
                    loading = false
                    data = {}
                }"
                @reset="data = {}"
                />
            </t-col>
        </t-row>
    </t-dialog>
</template>

<script>
import dayjs from 'dayjs'
import confirmBar from '../../components/confirmBar.vue'
import service from "../../api/service.js";
import {MessagePlugin} from "tdesign-vue-next";
import {getString} from "../../i18n/index.js";

export default {
    methods: {getString},
    components: {
        confirmBar
    },
    props: {
        selectKey: {
            type: Array,
            default: []
        },
        supplierOptions: {
            type: Array,
            default: []
        },
        categoryOptions: {
            type: Array,
            required: true,
            default: []
        },
    },
    emits: ['reload'],
    setup(props, { emit }){
        const i18n = inject('i18n')
        const shop = inject('shop')

        const visible = ref(false)
        const data = ref({})
        const loading = ref(false)
        const done = async () => {
            if(JSON.stringify(data.value) === "{}"){
                visible.value = false
                return
            }

            loading.value = true
            let stylenumber = props.selectKey
            let content = {}

            for (const key in data.value) {
                if (data.value[key] !== null && data.value[key] !== '') {
                    content[key] = data.value[key]
                }
            }

            let res = await service.api.goods.batchEdit(stylenumber, content)
            if(res.result){
                await MessagePlugin.success(i18n.batchEdited(res.vol)[i18n.language])
                emit('reload')
            } else {
                await MessagePlugin.info(i18n.batchEdited(0)[i18n.language])
            }

            loading.value = false
            visible.value = false
            data.value = {}
        }
        const open = () => {
            data.value = {}
            visible.value = true
        }

        return {
            i18n,
            shop,
            data,
            loading,
            visible,
            done,
            open,
            dayjs
        }
    }
}
</script>

<style>

</style>