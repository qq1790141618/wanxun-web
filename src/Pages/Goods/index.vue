<template>
    <div style="display: flex; position: relative;" id="goods-list">
        <ConditionBox
        :condition="condition"
        :loading="loading "
        @confirm="() => {
            pagination.current = 1
            selectKey = []
            getSearchGoods()
        }"
        @reset="condition = {
            type: 'stylenumber',
            content: null,
            unUpload: [],
            category: null,
            supplier: null
        }"
        :categoryOptions="categoryOptions"
        :supplierOptions="supplierOptions"
        />
        <div class="content-box">
            <OperateBar
            :data="data"
            :selectKey="selectKey"
            :categoryOptions="categoryOptions"
            :supplierOptions="supplierOptions"
            @batchEdit="be.open()"
            :loading="loading"
            @costHightLightChange="(value) => { columns[11].className = 'goods-table-col ' + value }"
            @supplierMap="spm.open()"
            />
            <div class="result-containter">
                <t-table
                size="small"
                :data="data"
                :columns="columns"
                :loading="loading"
                :loading-props="{
                    text: getString('loading')
                }"
                max-height="calc(100vh - 200px)"
                row-key="stylenumber"
                v-model:selected-row-keys="selectKey" >
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
                            <t-button
                            theme="primary"
                            @click="() => {
                                if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/goods/item/get') >= 0){
                                    goodsEdit.open(row)
                                } else {
                                    tips('权限不足', 'error')
                                }
                            }"
                            >
                                {{ getString('edit') }}
                            </t-button>
                            <t-button
                            variant="outline"
                            v-if="row['miaostreet-id'] && row['miaostreet-id'] != null && row['miaostreet-id'] != ''"
                            @click="miaostreetGoodsLink(row)"
                            >
                                {{ getString('viewMiaostreetLink') }}
                            </t-button>
                            <t-button
                            variant="outline"
                            @click="() => {
                                if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/goods/item/get') >= 0){
                                    viewGoods.open(row)
                                } else {
                                    tips('权限不足', 'error')
                                }
                            }">
                                {{ getString('viewGoods') }}
                            </t-button>
                            <t-button
                            variant="outline"
                            theme="primary"
                            v-if="row['miaostreet-id'] && row['miaostreet-id'] != null && row['miaostreet-id'] != ''"
                            @click="copy(row['miaostreet-id'], i18n.language)"
                            >
                                {{ getString('copy') }}{{ getString('miaostreet-id') }}
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
            @page-size-change="() => {
                pagination.current = 1
                getSearchGoods()
            }"
            style="position: sticky; bottom: 10px;"
            />
        </div>
    </div>
    <BatchEdit
    ref="be"
    :selectKey="selectKey"
    :supplierOptions="supplierOptions"
    :categoryOptions="categoryOptions"
    @reload="getSearchGoods()"
    />
    <SupplierMap
    ref="spm"
    :supplierOptions="supplierOptions"
    @reload="getSearchGoods()"
    />
    <ViewGoods
    ref="viewGoods"
    />
    <EditGoods
    ref="goodsEdit"
    :categoryOptions="categoryOptions"
    :supplierOptions="supplierOptions"
    @reload="getSearchGoods()"
    />
    <t-dialog
    v-model:visible="exportDialogShow"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :close-btn="false"
    :footer="false">
        <template #header>
            {{ getString('exportQueryGoods') }}
        </template>
        <div style="margin-bottom: 8px">
            <t-icon name="check-double" />
            {{ getString('goods') }}{{ getString('data') }}{{ getString('exportSuccess') }}!
        </div>
        <t-space size="8px">
            <t-button size="small" theme="primary" @click="openUrl(exportFileUrl)">
                <template #icon>
                    <t-icon name="download" />
                </template>
                {{ getString('download') }}
            </t-button>
            <t-button size="small" variant="outline" @click="exportDialogShow = false">
                <template #icon>
                    <t-icon name="close" />
                </template>
                {{ getString('close') }}
            </t-button>
        </t-space>
    </t-dialog>
</template>

<script setup>
import { copy, miaostreetGoodsLink } from '../../hooks'
import ConditionBox from './ConditionBox.vue'
import OperateBar from './OperateBar.vue'
import BatchEdit from './BatchEdit.vue'
import SupplierMap from './SupplierMap.vue'
import ViewGoods from './ViewGoods.vue'
import EditGoods from './EditGoods.vue'
import service from "../../api/service.js";
import {tips} from "../../hooks/tips.js";
import {getString} from "../../i18n/index.js";
import {useRoute} from "vue-router";

const i18n = inject('i18n')
const shop = inject('shop')
const user = inject('user')

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
const conditionIsChanged = ref(true)
watch(() => condition.value, () => {
    conditionIsChanged.value = true
})

const getOptions = async () => {
    let c = await service.api.goods.categoryOptions()
    if(c.result){
        categoryOptions.value = c.content
    } else {
        tips(c.error.message, 'error')
    }

    let s = await service.api.goods.supplierOptions()
    if(s.result){
        supplierOptions.value = s.content
    } else {
        tips(s.error.message, 'error')
    }

    supplierOptions.value.splice(0, 1)
}

const costHighlight = ref('cost-col')

const loading = ref(false)
const data = ref([])
const columns = ref([
    {
        colKey: 'row-select',
        type: 'multiple',
        width: 50
    },
    {
        title: getString('stylenumber'),
        colKey: 'stylenumber',
        width: 100,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('image'),
        colKey: 'image',
        width: 120,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('goodName'),
        colKey: 'name',
        width: 240,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('tagPrice'),
        colKey: 'tagprice',
        width: 70,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('category'),
        colKey: 'category',
        width: 180,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('miaostreet-id'),
        colKey: 'miaostreet-id',
        width: 120,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('salesCount'),
        colKey: 'sales-count',
        width: 90,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('supplier'),
        colKey: 'supplier',
        width: 90,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('supplier') + ' ' + getString('stylenumber'),
        colKey: 'supplier-id',
        width: 110,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('price'),
        colKey: 'price',
        width: 90,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('cost'),
        colKey: 'cost',
        width: 70,
        align: 'center',
        className: 'goods-table-col ' + costHighlight.value
    },
    {
        title: getString('operate'),
        colKey: 'operate',
        width: 200,
        align: 'center',
        className: 'goods-table-col'
    },
])
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 20,
    pageSizeOptions: [20, 30, 50, 100],
    loading: false
})
const router = useRouter()

const getSearchGoods = async () => {
    let con = {}
    let recon = condition.value
    loading.value = true
    pagination.value.loading = true
    data.value = []

    if(recon.content != null && recon.content !== ''){
        con[recon.type] = []
        let content1 = recon.content.split(',')
        for (let i = 0; i < content1.length; i++) {
            let content2 = content1[i].split('\n')
            con[recon.type] = con[recon.type].concat(content2)
        }
    }
    if(recon.category != null && recon.category !== ''){
        con['category-id'] = recon.category
    }
    if(recon.supplier != null && recon.supplier !== ''){
        con.supplier = recon.supplier
    }
    if(recon.unUpload.length > 0){
        for (let i = 0; i < recon.unUpload.length; i++) {
            con[recon.unUpload[i]] = null
        }
    }

    router.push({ query: { page: pagination.value.current } })
    let start = (pagination.value.current - 1) * pagination.value.pageSize
    let number = pagination.value.pageSize
    let result = await service.api.goods.get(con, start, number)

    frozenCondition.value = JSON.parse(JSON.stringify(condition.value))
    data.value = result.content

    loading.value = false
    await getSalesCount()
    if(conditionIsChanged.value){
        await getGoodsTotal(con)
    }
}
const getSalesCount = async () => {
    let res = await service.api.goods.getSales(data.value.map(item => item['stylenumber']))
    if(res.result){
        for (let i = 0; i < data.value.length; i++){
            data.value[i]['sales-count'] = 0
            for (let r = 0; r < res.content.length; r++){
                if(data.value[i]['stylenumber'] === res.content[r]['stylenumber']){
                    data.value[i]['sales-count'] = res.content[r]['sales-count']
                }
            }
        }
    } else {
        tips(res.error.message, 'error')
    }
}

const getGoodsTotal = async (condition = {}) => {
    let res = await service.api.goods.getTotal(condition)
    if(res.result){
        pagination.value.total = res.content.total
        conditionIsChanged.value = false
    } else {
        tips(res.error.message, 'error')
    }
    pagination.value.loading = false
}

const exportDialogShow = ref(false)
const exportFileUrl = ref(null)
const openUrl = (url) => {
    window.open(url)
}

const selectKey = ref([])
const be = ref(null)
const spm = ref(null)
const viewGoods = ref(null)
const goodsEdit = ref(null)
const route = useRoute()

let listenToShop = () => {
    condition.value = {
        type: 'stylenumber',
        content: null,
        unUpload: [],
        category: null,
        supplier: null
    }
    getSearchGoods()
}

watch(() => route.query.stylenumber, async (newValue) => {
    condition.value.type = 'stylenumber'
    condition.value.content = newValue

    await getSearchGoods()
})
watch(() => shop.store, () => { listenToShop() })
watch(() => shop.brand, () => { listenToShop() })

onMounted(() => {
    getOptions()

    setTimeout(() => {
        if(route.query.stylenumber){
            condition.value.type = 'stylenumber'
            condition.value.content = route.query.stylenumber
        }
        if(route.query.page){
            pagination.value.current = route.query.page * 1
        }
        getSearchGoods()
    }, 300)
})
</script>

<style>
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
.result-containter .goods-table-col{
    background-color: #ffffff60;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}
.result-containter .cost-col{
    background-color: #FEFFE8;
}
</style>