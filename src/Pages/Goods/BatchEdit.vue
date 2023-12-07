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
            {{ i18n.batch[i18n.language] }}{{ i18n.edit[i18n.language] }}
        </template>
        <t-row :gutter="[12, 12]" style="width: 100%;">
            <t-col :span="6">
                <t-auto-complete
                v-model="data.supplier"
                :options="supplierOptions.map(obj => obj.value)"
                :input-props="{
                    label: i18n.supplier[i18n.language] + ': '
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
                :label="i18n.category[i18n.language] + ': '"
                :placeholder="i18n.choose[i18n.language] + i18n.category[i18n.language]"
                >
                </t-cascader>
            </t-col>
            <t-col :span="6">
                <t-select
                v-model="data['miaostreet-listing-status']"
                :options="[
                    {
                        label: i18n.listing[i18n.language],
                        value: 1
                    },
                    {
                        label: i18n.unlist[i18n.language],
                        value: 0
                    }
                ]"
                clearable
                filterable
                :label="i18n.miaostreetListingStatus[i18n.language] + ': '"
                >
                </t-select>
            </t-col>
            <t-col :span="6">
                <t-select
                v-model="data['tmall-listing-status']"
                :options="[
                    {
                        label: i18n.listing[i18n.language],
                        value: 1
                    },
                    {
                        label: i18n.unlist[i18n.language],
                        value: 0
                    }
                ]"
                clearable
                filterable
                :label="i18n.tmallListingStatus[i18n.language] + ': '"
                >
                </t-select>
            </t-col>
            <t-col :span="8">
                <t-space size="13px">
                    <span style="line-height: 32px;">
                        {{ i18n.firstListingTime[i18n.language] + ': ' }}
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

export default {
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
    setup(){
        const i18n = inject('i18n')
        const serve = inject('serve')

        const visible = ref(false)
        const data = ref({})
        const loading = ref(false)
        const uploadData = async (stylenumbers, content) => {
            return fetch(serve + '/goods/batch-edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'store-id': shop.store,
                    brand: shop.brand,
                    stylenumbers,
                    content
                })
            })
            .then(res => {
                return Promise.resolve(res.json())
            })
            .catch(() => {
                MessagePlugin.error(i18n.httpFail[i18n.language])
            })
        }
        const done = async () => {
            if(JSON.stringify(data.value) == "{}"){
                value.visible = false
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

            let res = await uploadData(stylenumber, content)
            if(res.result){
                MessagePlugin.success(i18n.batchEdited(res.vol)[i18n.language])
                // getSearchGoods()
            } else {
                MessagePlugin.info(i18n.batchEdited(0)[i18n.language])
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
            data,
            visible,
            uploadData,
            done,
            open,
            dayjs
        }
    }
}
</script>

<style>

</style>