<template>
    <div style="display: flex; position: relative;" id="goods-list">
        <t-card
        class="condition-box"
        :bordered="false"
        >
            <template #header>
                <span>
                    <t-icon name="search"></t-icon>
                    {{ localString.condition[local.name] }}
                </span>
            </template>
            <t-form label-width="0" style="height: calc(100vh - 250px); overflow-y: auto;">
                <t-form-item>
                    <t-select
                    v-model="condition.type"
                    :options="[
                        {
                            label: localString.stylenumber[local.name],
                            value: 'stylenumber'
                        },
                        {
                            label: localString.productnumber[local.name],
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
                            label: localString['miaostreet-id'][local.name],
                            value: 'miaostreet-id'
                        }
                    ]"
                    >
                    </t-select>
                </t-form-item>
                <t-form-item>
                    <t-textarea
                    v-model="condition.content"
                    :placeholder="localString.tip1[local.name]"
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
                    :placeholder="localString.choose[local.name] + localString.category[local.name]"
                    >
                    </t-cascader>
                </t-form-item>
                <t-form-item>
                    <t-select
                    v-model="condition.supplier"
                    :options="supplierOptions"
                    clearable
                    filterable
                    :placeholder="localString.choose[local.name] + localString.supplier[local.name]"
                    >
                    </t-select>
                </t-form-item>
                <t-form-item>
                    <div>
                        {{ localString.unUpload[local.name] }}:
                        <t-check-tag-group
                        v-model="condition.unUpload"
                        :options="[
                            {
                                label: localString.supplier[local.name],
                                value: 'supplier'
                            },
                            {
                                label: localString.mainImage[local.name],
                                value: 'main-image'
                            },
                            {
                                label: localString.price[local.name],
                                value: 'price'
                            },
                            {
                                label: localString.cost[local.name],
                                value: 'cost'
                            },
                            {
                                label: localString.firstListingTime[local.name],
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
            <t-space size="8px">
                <t-button
                @click="() => {
                    pagination.current = 1
                    selectKey = []
                    getSearchGoods()
                }"
                :disabled="loading || exportLoading"
                :loading="loading"
                >
                    {{ localString.confirm[local.name] }}
                </t-button>
                <t-button variant="outline" @click="condition = {
                    type: 'stylenumber',
                    content: null,
                    unUpload: [],
                    category: null,
                    supplier: null
                }">
                    {{ localString.reset[local.name] }}
                </t-button>
            </t-space>
        </t-card>
        <div class="content-box">
            <t-alert style="padding: 5px 12px; position: sticky; top: 65px;">
                <template #icon><div></div></template>
                <t-space size="12px">
                    <span style="line-height: 32px;">
                        <t-icon name="check-rectangle" />
                        {{ localString.selected(selectKey.length)[local.name] }}
                    </span>
                    <t-button
                    variant="text"
                    theme="primary"
                    @click="exportToFiles"
                    :disabled="loading || exportLoading"
                    :loading="exportLoading"
                    >
                        <template #icon>
                            <t-icon name="file-export" />
                        </template>
                        {{ confirmButton }}
                    </t-button>
                    <t-button
                    variant="text"
                    theme="primary"
                    @click="() => {
                        batchEdit.data = {}
                        batchEdit.visible = true
                    }"
                    :disabled="selectKey.length == 0"
                    >
                        <template #icon>
                            <t-icon name="edit" />
                        </template>
                        {{ localString.batch[local.name] }}{{ localString.edit[local.name] }}
                    </t-button>
                </t-space>
            </t-alert>
            <div class="result-containter">
                <t-table
                size="small"
                :data="data"
                :columns="columns"
                :loading="loading"
                :loading-props="{
                    text: localString.loading[local.name]
                }"
                max-height="calc(100vh - 200px)"
                row-key="stylenumber"
                v-model:selected-row-keys="selectKey"
                >
                    <template #image="{ row }">
                        <t-image-viewer
                        v-if="row['main-image'] !== null"
                        :images="JSON.parse(row['main-image'])"
                        close-on-overlay
                        >
                            <template #trigger="{ open }">
                                <t-image
                                :src="JSON.parse(row['main-image'])[0] || false"
                                style="width: 90px; margin: 0 auto;"
                                @click.stop="open"
                                shape="round"
                                ></t-image>
                            </template>
                        </t-image-viewer>
                    </template>
                    <template #operate="{ row }">
                        <t-space break-line size="5px">
                            <!-- <t-button
                            theme="primary"
                            >
                                {{ localString.edit[local.name] }}
                            </t-button> -->
                            <t-button
                            variant="outline"
                            theme="primary"
                            v-if="row['miaostreet-id'] && row['miaostreet-id'] != null && row['miaostreet-id'] != ''"
                            @click="copy(row['miaostreet-id'], local.name)"
                            >
                                {{ localString.copy[local.name] }}{{ localString['miaostreet-id'][local.name] }}
                            </t-button>
                            <t-button
                            variant="outline"
                            v-if="row['miaostreet-id'] && row['miaostreet-id'] != null && row['miaostreet-id'] != ''"
                            @click="miaostreetGoodsLink(row)"
                            >
                                {{ localString.viewGoods[local.name] }}
                            </t-button>
                        </t-space>
                    </template>
                </t-table>
            </div>
            <t-pagination
            size="small"
            :disabled="loading"
            v-model:current="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-size-options="pagination.pageSizeOptions"
            @current-change="getSearchGoods()"
            @page-size-change="getSearchGoods()"
            style="position: sticky; bottom: 10px;"
            />
        </div>
    </div>
    <t-dialog
    :close-btn="false"
    :visible="batchEdit.visible"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :footer="false"
    width="600px"
    attach="#goods-list"
    show-in-attached-element
    >
        <template #header>
            <t-icon name="edit" style="margin-right: 5px;" />
            {{ localString.batch[local.name] }}{{ localString.edit[local.name] }}
        </template>
        <t-row :gutter="[12, 12]" style="width: 100%;">
            <t-col :span="6">
                <t-auto-complete
                v-model="batchEdit.data.supplier"
                :options="supplierOptions.map(obj => obj.value)"
                :input-props="{
                    label: localString.supplier[local.name] + ': '
                }"
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="6">
                <t-cascader
                v-model="batchEdit.data['category-id']"
                :options="categoryOptions"
                clearable
                filterable
                :label="localString.category[local.name] + ': '"
                :placeholder="localString.choose[local.name] + localString.category[local.name]"
                >
                </t-cascader>
            </t-col>
            <t-col :span="6">
                <t-select
                v-model="batchEdit.data['miaostreet-listing-status']"
                :options="[
                    {
                        label: localString.listing[local.name],
                        value: 1
                    },
                    {
                        label: localString.unlist[local.name],
                        value: 0
                    }
                ]"
                clearable
                filterable
                :label="localString.miaostreetListingStatus[local.name] + ': '"
                >
                </t-select>
            </t-col>
            <t-col :span="6">
                <t-select
                v-model="batchEdit.data['tmall-listing-status']"
                :options="[
                    {
                        label: localString.listing[local.name],
                        value: 1
                    },
                    {
                        label: localString.unlist[local.name],
                        value: 0
                    }
                ]"
                clearable
                filterable
                :label="localString.tmallListingStatus[local.name] + ': '"
                >
                </t-select>
            </t-col>
            <t-col :span="8">
                <t-space size="13px">
                    <span style="line-height: 32px;">
                        {{ localString.firstListingTime[local.name] + ': ' }}
                    </span>
                    <t-date-picker
                    v-model="batchEdit.data['first-listing-time']"
                    :disable-date="(current) => dayjs(current).isAfter(dayjs())"
                    >
                    </t-date-picker>
                </t-space>
            </t-col>
            <t-col :span="12">
                <t-space size="8px">
                    <t-button
                    @click="batchEdit.done"
                    :disabled="batchEdit.loading"
                    :loading="batchEdit.loading"
                    >
                        {{ localString.confirm[local.name] }}
                    </t-button>
                    <t-button theme="danger" @click="() => {
                        batchEdit.visible = false
                        batchEdit.loading = false
                        batchEdit.data = {}
                    }">
                        {{ localString.cancel[local.name] }}
                    </t-button>
                    <t-button variant="outline" @click="batchEdit.data = {}">
                        {{ localString.reset[local.name] }}
                    </t-button>
                </t-space>
            </t-col>
        </t-row>
    </t-dialog>
</template>

<script>
import dayjs from 'dayjs'
import { getCategoryOptions, getSupplierOptions, getGoods, copy, miaostreetGoodsLink } from '../../hooks'
import localString from './local'

export default {
    setup(){
        const local = inject('local')
        const serve = inject('serve')
        const shop = inject('shop')

        const condition = ref({
            type: 'stylenumber',
            content: null,
            unUpload: [],
            category: null,
            supplier: null
        })
        const frozenCondition = ref({})
        const categoryOptions = ref([])
        const supplierOptions = ref([])
        const getOptions = async () => {
            categoryOptions.value = await getCategoryOptions(serve)
            supplierOptions.value = await getSupplierOptions(serve)
            supplierOptions.value.splice(0, 1)
        }

        const loading = ref(false)
        const data = ref([])
        const columns = [
            {
                colKey: 'row-select',
                type: 'multiple',
                width: 50
            },
            {
                title: localString.stylenumber[local.name],
                colKey: 'stylenumber',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.image[local.name],
                colKey: 'image',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.goodName[local.name],
                colKey: 'name',
                width: 260,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.category[local.name],
                colKey: 'category',
                width: 190,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString['miaostreet-id'][local.name],
                colKey: 'miaostreet-id',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.salesCount[local.name],
                colKey: 'sales-count',
                width: 90,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.supplier[local.name],
                colKey: 'supplier',
                width: 100,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.supplier[local.name] + ' ' + localString.stylenumber[local.name],
                colKey: 'supplier-id',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.price[local.name],
                colKey: 'price',
                width: 90,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.cost[local.name],
                colKey: 'cost',
                width: 90,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.operate[local.name],
                colKey: 'operate',
                width: 180,
                align: 'center',
                className: 'goods-table-col'
            },
        ]
        const pagination = ref({
            total: 0,
            current: 1,
            pageSize: 20,
            pageSizeOptions: [20, 30, 50, 100]
        })
        const getSearchGoods = async (isExport) => {
            let con = new Object
            let recon
            if(!isExport){
                loading.value = true
                recon = condition.value
                data.value = []
            } else {
                recon = frozenCondition.value
            }

            if(recon.content != null && recon.content != ''){
                con[recon.type] = []
                let content1 = recon.content.split(',')
                for (let i = 0; i < content1.length; i++) {
                    let content2 = content1[i].split('\n')
                    con[recon.type] = con[recon.type].concat(content2)
                }
            }
            if(recon.category != null && recon.category != ''){
                con['category-id'] = recon.category
            }
            if(recon.supplier != null && recon.supplier != ''){
                con.supplier = recon.supplier
            }
            if(recon.unUpload.length > 0){
                for (let i = 0; i < recon.unUpload.length; i++) {
                    con[recon.unUpload[i]] = null
                }
            }
            
            let start = (pagination.value.current - 1) * pagination.value.pageSize
            let number = pagination.value.pageSize
            let result = await getGoods(shop.store, shop.brand, con, start, number, isExport)

            if(isExport){
                return Promise.resolve(result)
            } else {
                frozenCondition.value = JSON.parse(JSON.stringify(condition.value))
            }

            data.value = result.data
            for (let i = 0; i < data.value.length; i++) {
                if(!data.value[i]['sales-count']){
                    data.value[i]['sales-count'] = 0
                }
            }
            pagination.value.total = result.total
            
            loading.value = false
        }
        const confirmButton = ref(localString.exportQueryGoods[local.name])
        const exportLoading = ref(false)
        const exportToFiles = async () => {
            confirmButton.value = localString.exporting[local.name]
            exportLoading.value = true

            let res = await getSearchGoods(true)
            MessagePlugin.success(localString.exportSuccess[local.name])
            window.open(serve + '/download?filename=' + res)

            confirmButton.value = localString.exportQueryGoods[local.name]
            exportLoading.value = false
        }
        
        const selectKey = ref([])
        const batchEdit = ref({
            visible: false,
            data: {},
            loading: false,
            uploadData: async (stylenumbers, content) => {
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
                    MessagePlugin.error(localString.httpFail[local.name])
                })
            },
            done: async () => {
                if(JSON.stringify(batchEdit.value.data) == "{}"){
                    batchEdit.value.visible = false
                    return
                }

                batchEdit.value.loading = true
                let stylenumber = selectKey.value
                let content = {}

                for (const key in batchEdit.value.data) {
                    if (batchEdit.value.data[key] !== null && batchEdit.value.data[key] !== '') {
                        content[key] = batchEdit.value.data[key]
                    }
                }

                let res = await batchEdit.value.uploadData(stylenumber, content)
                console.log(res)
                if(res.result){
                    MessagePlugin.success(localString.batchEdited(res.vol)[local.name])
                } else {
                    MessagePlugin.info(localString.batchEdited(0)[local.name])
                }

                batchEdit.value.loading = false
                batchEdit.value.visible = false
                batchEdit.value.data = {}
            }
        })

        onMounted(() => {
            getOptions()
            getSearchGoods()
        })
        watch(() => shop.store, () => {
            getSearchGoods()
        })
        watch(() => shop.brand, () => {
            getSearchGoods()
        })

        return {
            dayjs,

            local,
            localString,
            condition,
            categoryOptions,
            supplierOptions,

            getSearchGoods,
            loading,
            data,
            columns,
            pagination,

            copy,
            miaostreetGoodsLink,

            confirmButton,
            exportLoading,
            exportToFiles,

            batchEdit,
            selectKey
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
.content-box{
    position: relative;
    flex-grow: 1;
    margin: 10px;
    margin-left: 0;
    box-sizing: border-box;
}
.result-containter{
    margin: 10px 0;
}
.result-containter .t-table, .result-containter tr{
    background-color: transparent;
}
.result-containter .t-table__header tr{
    background-color: #fff;
    border-radius: 5px;
}
.result-containter .t-table th{
    color: #333;
    border: none;
}
.result-containter .t-table th:first-child{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
.result-containter .t-table th:last-child{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}
.goods-table-col{
    background-color: #ffffff60!important;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}
</style>