<template>
    <div style="display: flex; position: relative;">
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
                    pagination.current = 1;
                    getSearchGoods()
                }"
                :disabled="loading"
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
            <t-alert style="padding: 5px; position: sticky; top: 65px;">
                <template #icon><div></div></template>
                <t-button variant="text" theme="primary">
                    Button
                </t-button>
            </t-alert>
            <div class="result-containter">

            </div>
            <t-pagination
            size="small"
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
</template>

<script>
import { getCategoryOptions, getSupplierOptions, getGoods } from '../../hooks'
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
        const categoryOptions = ref([])
        const supplierOptions = ref([])
        const getOptions = async () => {
            categoryOptions.value = await getCategoryOptions(serve)
            supplierOptions.value = await getSupplierOptions(serve)
            supplierOptions.value.splice(0, 1)
        }

        const loading = ref(false)
        const data = ref([])
        const pagination = ref({
            total: 0,
            current: 1,
            pageSize: 10,
            pageSizeOptions: [10, 20, 30, 50]
        })
        const getSearchGoods = async () => {
            loading.value = true

            let con = new Object
            if(condition.value.content != null && condition.value.content != ''){
                con[condition.value.type] = []
                let content1 = condition.value.content.split(',')
                for (let i = 0; i < content1.length; i++) {
                    let content2 = content1[i].split('\n')
                    con[condition.value.type] = con[condition.value.type].concat(content2)
                }
            }
            if(condition.value.category != null && condition.value.category != ''){
                con.category = condition.value.category
            }
            if(condition.value.supplier != null && condition.value.supplier != ''){
                con.supplier = condition.value.supplier
            }
            if(condition.value.unUpload.length > 0){
                for (let i = 0; i < condition.value.unUpload.length; i++) {
                    con[condition.value.unUpload[i]] = null
                }
            }
            
            let start = (pagination.value.current - 1) * pagination.value.pageSize
            let number = pagination.value.pageSize
            let result = await getGoods(shop.store, shop.brand, con, start, number)
            data.value = result.data
            pagination.value.total = result.total
            
            loading.value = false
        }

        onMounted(() => {
            getOptions()
            getSearchGoods()
        })

        return {
            local,
            localString,
            condition,
            categoryOptions,
            supplierOptions,

            getSearchGoods,
            loading,
            data,
            pagination
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
</style>