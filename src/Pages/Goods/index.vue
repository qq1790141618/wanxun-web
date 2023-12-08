<template>
    <div style="display: flex; position: relative;" id="goods-list">
        <ConditionBox
        :condition="condition"
        :loading="loading "
        :export-loading="exportLoading"
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
            :export-loading="exportLoading"
            @exportToFiles="exportToFiles"
            @costHightLightChange="(value) => { columns[10].className = 'goods-table-col ' + value }"
            @supplierMap="spm.open()"
            />
            <div class="result-containter">
                <t-table
                size="small"
                :data="data"
                :columns="columns"
                :loading="loading"
                :loading-props="{
                    text: i18n.loading[i18n.language]
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
                            <t-button
                            theme="primary"
                            @click="goodsEdit.open(row)"
                            >
                                {{ i18n.edit[i18n.language] }}
                            </t-button>
                            <t-button
                            variant="outline"
                            v-if="row['miaostreet-id'] && row['miaostreet-id'] != null && row['miaostreet-id'] != ''"
                            @click="miaostreetGoodsLink(row)"
                            >
                                {{ i18n.viewMiaostreetLink[i18n.language] }}
                            </t-button>
                            <t-button
                            variant="outline"
                            @click="viewGoods.open(row)"
                            >
                                {{ i18n.viewGoods[i18n.language] }}
                            </t-button>
                            <t-button
                            variant="outline"
                            theme="primary"
                            v-if="row['miaostreet-id'] && row['miaostreet-id'] != null && row['miaostreet-id'] != ''"
                            @click="copy(row['miaostreet-id'], i18n.language)"
                            >
                                {{ i18n.copy[i18n.language] }}{{ i18n['miaostreet-id'][i18n.language] }}
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
    />
</template>

<script>
import dayjs from 'dayjs'
import { getCategoryOptions, getSupplierOptions, getGoods, copy, miaostreetGoodsLink } from '../../hooks'
import confirmBar from '../../components/confirmBar.vue'
import ConditionBox from './ConditionBox.vue'
import OperateBar from './OperateBar.vue'
import BatchEdit from './BatchEdit.vue'
import SupplierMap from './SupplierMap.vue'
import ViewGoods from './ViewGoods.vue'
import EditGoods from './EditGoods.vue'

export default {
    components: {
        confirmBar,
        ConditionBox,
        OperateBar,
        BatchEdit,
        SupplierMap,
        ViewGoods,
        EditGoods
    },
    setup(){
        const i18n = inject('i18n')
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
                title: i18n.stylenumber[i18n.language],
                colKey: 'stylenumber',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n.image[i18n.language],
                colKey: 'image',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n.goodName[i18n.language],
                colKey: 'name',
                width: 260,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n.category[i18n.language],
                colKey: 'category',
                width: 190,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n['miaostreet-id'][i18n.language],
                colKey: 'miaostreet-id',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n.salesCount[i18n.language],
                colKey: 'sales-count',
                width: 90,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n.supplier[i18n.language],
                colKey: 'supplier',
                width: 100,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n.supplier[i18n.language] + ' ' + i18n.stylenumber[i18n.language],
                colKey: 'supplier-id',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n.price[i18n.language],
                colKey: 'price',
                width: 90,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: i18n.cost[i18n.language],
                colKey: 'cost',
                width: 70,
                align: 'center',
                className: 'goods-table-col ' + costHighlight.value
            },
            {
                title: i18n.operate[i18n.language],
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
        const exportLoading = ref(false)
        const exportToFiles = async () => {
            exportLoading.value = true

            let res = await getSearchGoods(true)
            MessagePlugin.success(i18n.exportSuccess[i18n.language])
            window.open(serve + '/download?filename=' + res)

            exportLoading.value = false
        }
        
        const selectKey = ref([])
        const be = ref(null)
        const spm = ref(null)
        const viewGoods = ref(null)
        const goodsEdit = ref(null)
        const route = useRoute()

        onMounted(() => {
            getOptions()

            if(route.query.stylenumber){
                condition.value.type = 'stylenumber'
                condition.value.content = route.query.stylenumber
            }
            getSearchGoods()
        })
        watch(() => shop.store, () => {
            getSearchGoods()
        })
        watch(() => shop.brand, () => {
            getSearchGoods()
        })
        watch(() => route.query.stylenumber, (newValue) => {
            condition.value.type = 'stylenumber'
            condition.value.content = newValue
            getSearchGoods()
        })

        return {
            dayjs,
            shop,

            i18n,
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

            exportLoading,
            exportToFiles,

            selectKey,

            costHighlight,

            viewGoods,
            goodsEdit,
            be,
            spm
        }
    }
}
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