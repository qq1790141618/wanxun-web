<template>
    <div style="display: flex; position: relative;" id="goods-list">
        <ConditionBox
            ref="conditionBox"
            v-model:condition="condition"
            :loading="loading "
            @confirm="() => {
                pagination.current = 1
                selectKey = []
                getSearchGoods()
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
                :never-upload-goods-loading="neverUploadGoodsLoading"
                @never-upload-goods="getNeverUploadGoods"
                :export-create-loading="exportCreateLoading"
                @export-search-goods="exportSearchGoods"
            />
            <div class="result-container">
                <t-table
                    size="small"
                    :data="data"
                    :columns="columns"
                    :loading="loading"
                    :loading-props="{
                        text: getString('loading')
                    }"
                    max-height="calc(100vh - 200px)"
                    row-key="styleNumber"
                    v-model:selected-row-keys="selectKey"
                >
                    <template #image="{ row }">
                        <t-image-viewer
                            v-if="row.image"
                            :images="[row.image]"
                            :close-on-overlay="true"
                        >
                            <template #trigger="{ open }">
                                <t-image
                                    :src="row.image"
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
                                @click="goodsEdit.open(row)"
                            >
                                {{ getString('edit') }}
                            </t-button>
                            <t-button
                                variant="outline"
                                v-if="row.id"
                                @click="miaostreetGoodsLink(row)"
                            >
                                {{ getString('viewMiaostreetLink') }}
                            </t-button>
<!--                            <t-button-->
<!--                                variant="outline"-->
<!--                                @click="viewGoods.open(row)"-->
<!--                            >-->
<!--                                {{ getString('viewGoods') }}-->
<!--                            </t-button>-->
                            <t-button
                                variant="outline"
                                theme="primary"
                                v-if="row.id"
                                @click="copy(row.id, i18n.language)"
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
<!--    <BatchEdit-->
<!--        ref="be"-->
<!--        :selectKey="selectKey"-->
<!--        :supplierOptions="supplierOptions"-->
<!--        :categoryOptions="categoryOptions"-->
<!--        @reload="getSearchGoods()"-->
<!--    />-->
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
        :footer="false"
    >
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
    <t-dialog
        v-model:visible="neverUploadGoodsShow"
        :close-on-esc-keydown="false"
        :close-on-overlay-click="false"
        :footer="false"
    >
        <template #header>
            {{ getString('neverUploadGoods') }}
        </template>
        {{ getString('barcode') }}
        <t-button
            size="small"
            variant="outline"
            @click="copy(neverUploadGoods.join('\n'), i18n.language)"
        >
            <template #icon>
                <t-icon name="copy" />
            </template>
        </t-button>:
        <t-textarea
            :readonly="true"
            :modelValue="neverUploadGoods.join('\n')"
            :autosize="{
                minRows: 3,
                maxRows: 10
            }"
            style="margin-top: 5px;"
        >
        </t-textarea>
    </t-dialog>
</template>

<script setup>
import { copy, miaostreetGoodsLink } from '../../hooks'
import ConditionBox from './ConditionBox.vue'
import OperateBar from './OperateBar.vue'
// import BatchEdit from './BatchEdit.vue'
import SupplierMap from './SupplierMap.vue'
import ViewGoods from './ViewGoods.vue'
import EditGoods from './EditGoods.vue'
import {tips} from "../../hooks/tips.js"
import {getString} from "../../i18n/index.js"
import {request} from "../../api/request.js"
import dayjs from "dayjs";
import {Dialog, DialogPlugin} from "tdesign-vue-next";

const i18n = inject('i18n')
const shop = inject('shop')
const user = inject('user')

const conditionBox = ref()
const condition = ref({})

const categoryOptions = ref([])
const supplierOptions = ref([])

const getOptions = async () => {
    let c = await request('/product/categories')
    if(c.status === 'success'){
        initCategories(c.content)
    } else {
        tips(c.error.msg, 'error')
    }

    let s = await request('/product/suppliers', { brand: shop.brand })
    if(s.status === 'success'){
        supplierOptions.value = s.content
    } else {
        tips(s.error.msg, 'error')
    }
}

const initCategories = (list) => {
    categoryOptions.value = []
    for (let i = 0; i < list.length; i++) {
        let first = categoryOptions.value.find(item => item.label === list[i].first)
        if (!first) {
            first = {
                label: list[i].first,
                value: list[i].first,
                children: []
            }
            categoryOptions.value.push(first)
        }

        let second = first.children.find(item => item.label === list[i].second)
        if (!second) {
            second = {
                label: list[i].second,
                value: list[i].second,
                children: []
            }
            first.children.push(second)
        }

        let third = second.children.find(item => item.label === list[i].third)
        if (!third) {
            third = {
                label: list[i].third,
                value: list[i].id,
                isLeaf: true
            }
            second.children.push(third)
        }
    }
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
        colKey: 'styleNumber',
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
        className: 'goods-table-col',
        cell: (h, { row }) => {
            return getPrice(row, 'tagPrice')
        }
    },
    {
        title: getString('category'),
        colKey: 'category',
        width: 90,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('miaostreet-id'),
        colKey: 'id',
        width: 80,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('salesCount'),
        colKey: 'salesCount',
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
        colKey: 'supplierId',
        width: 110,
        align: 'center',
        className: 'goods-table-col'
    },
    {
        title: getString('price'),
        colKey: 'price',
        width: 90,
        align: 'center',
        className: 'goods-table-col',
        cell: (h, { row }) => {
            return getPrice(row, 'price')
        }
    },
    {
        title: getString('cost'),
        colKey: 'cost',
        width: 70,
        align: 'center',
        className: 'goods-table-col ' + costHighlight.value,
        cell: (h, { row }) => {
            return getPrice(row, 'cost')
        }
    },
    {
        title: getString('operate'),
        colKey: 'operate',
        width: 200,
        align: 'center',
        className: 'goods-table-col'
    }
])
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 20,
    pageSizeOptions: [20, 30, 50, 100],
    loading: false
})
const router = useRouter()

const initSearchParams = () => {
    let start = (pagination.value.current - 1) * pagination.value.pageSize
    let number = pagination.value.pageSize
    let params = {
        storeId: shop.store,
        brandId: shop.brand,
        skip: start,
        limit: number,
        category: condition.value.category,
        supplier: condition.value.supplier,
        neverUploaded: condition.value.unUpload
    }
    if (condition.value.content) {
        params[condition.value.type] = condition.value.content.replace("\n", ",").split(",")
    }
    return params
}
const getSearchGoods = async () => {
    loading.value = true
    pagination.value.loading = true
    data.value = []

    let params = initSearchParams()
    let result = await request('/product', params, 'POST')

    data.value = result.content.data
    pagination.value.total = result.content.total

    loading.value = false
    await getSalesCount()
}
const exportCreateLoading = ref(false)
const exportSearchGoods = async () => {
    exportCreateLoading.value = true

    let params = initSearchParams()
    await request('/product/export', params, 'POST')
    DialogPlugin({
        header: getString('exportCreateSuccess'),
        body: getString('exportCreateSuccessTip'),
        footer: false
    })

    exportCreateLoading.value = false
}
const getSalesCount = async () => {
    let styleNumbers = data.value.map(item => item['styleNumber'])
    let res = await request('/analysis/product', {
        store: shop.store,
        brand: shop.brand,
        startTime: '2021-09-01 00:00:00',
        endTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD') + ' 23:59:59',
        styleNumbers: styleNumbers.join(',')
    })
    if(res.status === 'success'){
        for (let i = 0; i < data.value.length; i++){
            data.value[i]['salesCount'] = 0
            for (let r = 0; r < res.content.length; r++){
                if(data.value[i]['styleNumber'] === res.content[r]['styleNumber']){
                    data.value[i]['salesCount'] = res.content[r]['salesCount']
                }
            }
        }
    } else {
        tips(res.error.msg, 'error')
    }
}

const neverUploadGoods = ref([])
const neverUploadGoodsShow = ref(false)
const neverUploadGoodsLoading = ref(false)
const getNeverUploadGoods = async () => {
    neverUploadGoodsLoading.value = true

    let res = await request('/product/unload', {
        storeId: shop.store,
        brandId: shop.brand
    })
    neverUploadGoods.value = res.content
    neverUploadGoodsShow.value = true

    neverUploadGoodsLoading.value = false
}

const openUrl = (url) => {
    window.open(url)
}

const selectKey = ref([])
const be = ref(null)
const spm = ref(null)
const viewGoods = ref(null)
const goodsEdit = ref(null)

let listenToShop = () => {
    conditionBox.value.reset()
    getOptions()
    getSearchGoods()
}

watch(() => shop.store, () => { listenToShop() })
watch(() => shop.brand, () => { listenToShop() })

const getPrice = (product, property) => {
    let min = 0
    let max = 0
    for (let i = 0; i < product.skus.length; i++) {
        const item = product.skus[i]
        if (min === 0 || item[property] < min) min = item[property]
        if (max === 0 || item[property] > max) max = item[property]
    }
    if (max === min) {
        return min
    } else {
        return min + "-" + max
    }
}

onMounted(listenToShop)
</script>

<style>
.content-box{
    position: relative;
    flex-grow: 1;
    margin: 10px;
    margin-left: 0;
    box-sizing: border-box;
}
.result-container{
    margin: 10px 0;
}
.result-container .t-table, .result-container tr{
    background-color: transparent;
}
.result-container .goods-table-col{
    background-color: #ffffff60;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}
.result-container .cost-col{
    background-color: #FEFFE8;
}
</style>