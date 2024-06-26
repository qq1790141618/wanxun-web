<template>
    <div class="main-content" id="import-page">
        <t-card :bordered="false">
            <t-tabs v-model="tab" placement="left" size="medium">
                <t-tab-panel :value="0" :label="getString('dataImportQuery')">
                    <div class="headbar">
                        <t-button @click="() => {
                            if(
                                !user.inform['need_auth']
                                || user.inform['api_p'].indexOf('api/v1/import/task/create') >= 0
                            ){
                                addTab()
                            } else {
                                tips('权限不足', 'error')
                            }
                        }" shape="round">
                            <template #icon>
                                <t-icon name="add" />
                            </template>
                            {{ getString('addImportOrder') }}
                        </t-button>
                        <t-button variant="outline" @click="initData" shape="round">
                            <template #icon>
                                <t-icon name="refresh" />
                            </template>
                            {{ getString('refresh') }}
                        </t-button>
                        <t-dropdown
                        :options="[
                            { content: getString('skuImportTemplate'), value: 'https://cdn.fixeam.com/tw/template/SKU信息导入模板.xlsx' }
                        ]"
                        trigger="hover"
                        @click="(context) => {
                            saveFile(context.value)
                        }"
                        max-column-width="200"
                        placement="bottom"
                        >
                            <t-button variant="outline" shape="round">
                                <template #icon>
                                    <t-icon name="download" />
                                </template>
                                {{ getString('templateDownload') }}
                                <template #suffix><t-icon name="chevron-down" size="16" /></template>
                            </t-button>
                        </t-dropdown>
                        <t-button
                        theme="warning"
                        v-if="tabPanels.length > 0"
                        @click="tabPanels = []"
                        shape="round"
                        >
                            <template #icon>
                                <t-icon name="close" />
                            </template>
                            {{ getString('closeAllTabs') }}
                        </t-button>
                        <t-button
                        theme="danger"
                        shape="round"
                        @click="() => {
                            if(
                                !user.inform['need_auth']
                                || user.inform['api_p'].indexOf('api/v1/order/remove') >= 0
                            ){
                                removeOrder.open()
                            } else {
                                tips('权限不足', 'error')
                            }
                        }"
                        >
                            <template #icon>
                                <t-icon name="clear" />
                            </template>
                            {{ getString('orderInformsRemove') }}
                        </t-button>
                        <t-popup placement="bottom" trigger="hover">
                            <t-button variant="text" shape="round">
                                <template #icon>
                                    <t-icon name="help-circle"></t-icon>
                                </template>
                                <span>
                                    {{ getString('dataFrom') }}
                                </span>
                            </t-button>
                            <template #content>
                                <upload-tips />
                            </template>
                        </t-popup>
                    </div>
                    <div id="content-table">
                        <list-display :data="res" :loading="loading" />
                        <t-pagination
                            size="small"
                            :disabled="loading"
                            v-model:current="pagination.current"
                            v-model:page-size="pagination.pageSize"
                            :total="pagination.total"
                            :page-size-options="pagination.pageSizeOptions"
                            @current-change="initData()"
                            @page-size-change="() => {
                                pagination.current = 1
                                initData()
                            }"
                            style="max-width: 1000px; margin: 12px auto;" />
                    </div>
                </t-tab-panel>
                <t-tab-panel
                v-for="item in tabPanels"
                :key="item.key"
                :value="item.value"
                :label="getString('addImportOrder') + '-' + item.value"
                >
                    <div class="new-card-body">
                        <t-steps theme="dot" v-model:current="item.current" style="margin: 20px 0;" readonly>
                            <t-step-item :title="getString('tableUpload')" :content="getString('tableUploadTip')"></t-step-item>
                            <t-step-item :title="getString('dataParse')" :content="getString('dataParseTip')"></t-step-item>
                            <t-step-item :title="getString('dataConfirm')" :content="getString('dataConfirmTip')"></t-step-item>
                            <t-step-item :title="getString('createSuccess')" :content="getString('createSuccessTip')"></t-step-item>
                        </t-steps>
                        <div v-if="item.current === 0">
                            <div style="">
                                <t-icon name="upload"></t-icon>
                                {{ getString('tableUpload') }}:
                                ({{ sizeLimit }})
                            </div>
                            <t-upload
                            v-model:files="item.filelist"
                            action="https://table-parse.fixeam.com/"
                            :accept="allowType.join(',')"
                            :size-limit="allowSize * 1024"
                            @beforeUpload="() => {
                                item.filelist = []
                            }"
                            @success="(file) => {
                                loading = false
                                let res = file.file.response
                                if(res['result']){
                                    item.data = res['data']
                                    item.filelist = []
                                    item.current++
                                    parseTable(item.value - 1)
                                } else {
                                    tips('文件上传或读取失败', 'error')
                                }
                            }"
                            @error="() => {
                                tips('文件上传或读取失败', 'error')
                                item.filelist = []
                            }"
                            class="center-upload"
                            :draggable="true"
                            >
                            </t-upload>
                        </div>
                        <div v-if="item.current === 1">
                            <t-loading :text="getString('dataParse') + '...'" size="small" style="width: 100%; min-height: calc(100vh - 300px);">
                            </t-loading>
                        </div>
                        <div v-if="item.current === 2">
                            <div class="box-center" v-if="item.type !== 'order'">
                                <div>
                                    {{ getString('dataOrParsedIs') }} {{ tableParse[item.type].name }}: {{ getString('common') }} {{ item.jsonBody.length }} {{ getString('pieceOfData') }}。
                                </div>
                                <t-button
                                @click="submit(item)"
                                :loading="createLoading"
                                style="margin-top: 8px;"
                                >
                                    {{ getString('confirmToCreateTask') }}
                                </t-button>
                            </div>
                            <div class="box-center" v-if="item.type === 'order'">
                                <div>
                                    {{ getString('dataOrParsedIs') }} {{ tableParse[item.type][0].name }} : {{ item.data.sheets[0] }} {{ getString('common') }} {{ item.jsonBody[0].length }} {{ getString('pieceOfData') }}, {{ item.data.sheets[1] }} {{ getString('common') }} {{ item.jsonBody[1].length }} {{ getString('pieceOfData') }}
                                </div>
                                <t-button
                                @click="submitOrder(item)"
                                :loading="createLoading"
                                style="margin-top: 8px;"
                                >
                                    {{ getString('confirmToCreateTask') }}
                                </t-button>
                            </div>
                        </div>
                        <div v-if="item.current === 3">
                            <div class="box-center">
                                <div>
                                    <t-icon name="check-double" style="color: green;"></t-icon>
                                    {{ getString('createTaskSuccess') }}
                                </div>
                                <t-button @click="close(item)" style="margin-top: 8px;">
                                    {{ getString('close') }}
                                </t-button>
                            </div>
                        </div>
                    </div>
                </t-tab-panel>
            </t-tabs>
        </t-card>
    </div>
    <RemoveOrder
    ref="removeOrder"
    />
</template>

<script setup>
import dayjs from 'dayjs'
import UploadTips from './UploadTips.vue'
import ListDisplay from './ListDisplay.vue'
import RemoveOrder from './RemoveOrder.vue'
import {apiSign} from "../../api/request.js"
import service from "../../api/service.js"
import {tips} from "../../hooks/tips.js"
import host from "../../api/host.js"
import {getToken} from "../../hooks/user.js"
import {getString, getStringAsync} from "../../i18n/index.js"

const i18n = inject('i18n')
const user = inject('user')
const shop = inject('shop')

const res = ref([])
const loading = ref(false)
const pagination = ref({
    total: 0,
    current: 1,
    pageSize: 20,
    pageSizeOptions: [20, 30, 50, 100]
})

const allowType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
const allowSize = 10

const sizeLimit = ref('')
const createSizeLimit = async () => {
    sizeLimit.value = await getStringAsync('文件大小' + allowSize + 'MB以内, 仅支持.xls, .xlsx, .xlsm等EXCEL文件')
}
createSizeLimit()

const tabPanels = ref([])
const tab = ref(0)
const tableParse = ref({
    sku: {
        disabled: false,
        name: getString('skuInformTable'),
        task: 'morifySku',
        theadstart: 'SKU',
        theadend: '赠品价值',
        corresponding: {
            'SKU': 'SKU',
            '商品SKU名称': 'name',
            '商品条码': 'barcode',
            '货号': 'productnumber',
            '款号': 'stylenumber',
            '颜色': 'color',
            '颜色代码': 'colorid',
            '尺码': 'size',
            '尺码代码': 'sizeid',
            '标准售价': 'price',
            '吊牌价(云)': 'tagprice',
            '可售库存': 'inventory',
            '叶子类目': 'category',
            '叶子类目id': 'category-id',
            '品牌': 'brand',
            '专柜号': 'shoppe-id',
            '门店号': 'store-id',
            '录入时间': 'entry-time',
            '上次更新时间': 'update-time',
            'spuId': 'spu-id',
            '颜色图': 'color-image'
        },
        computer: {
            'combination-products': (value) => {
                return value['是否组合商品'] === '是'? 1 : 0
            },
            'miaostreet-listing-status': (value) => {
                return value['喵街上架状态'] === '上架'? 1 : 0
            },
            'tmall-listing-status': (value) => {
                return value['天猫上架状态'] === '上架'? 1 : 0
            },
            'season': (value) => {
                let goodsName = value['商品SKU名称']
                let season = null

                const maybeSeason = {
                    '春夏秋': '春夏秋',
                    '秋冬': '秋冬',
                    '春夏': '春夏',
                    '春秋': '春秋',
                    '春': '春季',
                    '夏': '夏季',
                    '秋': '秋季',
                    '冬': '冬季',
                    '短袖': '夏季',
                    '加绒': '冬季'
                }

                for (var key in maybeSeason) {
                    if (goodsName && goodsName.indexOf(key) >= 0) {
                        return maybeSeason[key]
                    }
                }

                return season
            },
            'sex': (value) => {
                let goodsName = value['商品SKU名称']
                let forTheCrowd = value['适用人群']

                let sex = null

                const maybeSex = {
                    '中性': '中性',
                    '男女': '中性',
                    '男': '男性',
                    '女': '女性',
                    '裙': '女性'
                }

                for (var key in maybeSex) {
                    if (forTheCrowd && forTheCrowd.indexOf(key) >= 0) {
                        return maybeSex[key]
                    }
                    if (goodsName && goodsName.indexOf(key) >= 0) {
                        return maybeSex[key]
                    }
                }

                return sex
            }
        }
    },
    spu: {
        disabled: false,
        name: getString('spuInformTable'),
        task: 'morifySpu',
        theadstart: '商品款名称',
        theadend: '商品退款政策',
        corresponding: {
            'SPU': 'spu-id',
            'MOS品牌': 'brand',
            '商品款名称': 'name',
            '喵街id': 'miaostreet-id',
            '线上款号': 'online-model-number'
        },
        computer: {
            'store-id': (value) => {
                return value['门店'] == null? false: value['门店'].split('(')[1].split(')')[0]
            },
            'main-image': (value) => {
                return ['主图'] == ''? false: JSON.stringify([value['主图']])
            },
            'detail-image': (value) => {
                return ['详情图'] == ''? false: JSON.stringify([value['详情图']])
            }
        }
    },
    inventory: {
        disabled: false,
        name: getString('inventoryInformTable'),
        task: 'morifySku',
        theadstart: 'SKU编码',
        theadend: '货主信息',
        corresponding: {
            'SKU编码': 'SKU'
        },
        computer: {
            inventory: (value) => {
                let key = '可售数量'
                if(!value[key] || value[key] == null){
                    return false
                }
                return value[key] * 1
            }
        }
    },
    cost: {
        disabled: false,
        name: getString('skuImportTemplate'),
        task: 'morifySku',
        theadstart: 'SKU编码',
        theadend: '适用季节',
        corresponding: {
            'SKU编码': 'SKU',
            '运营价': 'cost',
            '日常销售价': 'price',
            '供应商': 'supplier',
            '供应商原厂编码': 'supplier-id',
            '适用性别': 'sex',
            '适用季节': 'season'
        },
        computer: {
            'first-listing-time': (value) => {
                let key = '上架时间'

                if(!value[key] || value[key] == null || value[key] == ''){
                    console.log(key + ' ' + value[key] + '值不存在')
                    return false
                }
                if(dayjs(value[key]).format('YYYY-MM-DD') === 'Invalid Date'){
                    console.log(key + ' ' + value[key] + ' ' + dayjs(value[key]).format('YYYY-MM-DD') + ' ' + '日期错误')
                    return false
                }

                return dayjs(value[key]).format('YYYY-MM-DD')
            }
        }
    },
    supplier: {
        disabled: true,
        name: getString('goodsOthersInformTable'),
        task: 'morifySupplier',
        theadstart: '款号',
        theadend: '适用季节',
        corresponding: {
            '款号': 'stylenumber',
            '供应商': 'supplier',
            '原厂编码': 'supplier-id',
            '适用性别': 'sex',
            '适用季节': 'season'
        },
        computer: false
    },
    order: [
        {
            disabled: false,
            name: getString('ordersInformTable'),
            task: 'morifyOrderList',
            theadstart: '父订单号',
            theadend: '拼团成功时间',
            corresponding: {
                '子订单号': 'sub-order-id',
                '父订单号': 'parent-order-id',
                '渠道订单号': 'channel-order-id',
                '渠道': 'channel',
                '购物小票号': 'ticket-id',
                '下单时间': 'order-time',
                '订单状态': 'order-status',
                '退款状态': 'refund-status',
                '发货状态': 'delivery-time',
                '最迟发货时间': 'latest-delivery-time',
                '物流公司': 'logistics-company',
                '运单号': 'waybill-number',
                '支付时间': 'payment-time',
                '门店号': 'store-id',
                '专柜号': 'shoppe-id',
                '发货人': 'shipper',
                '仓库名称': 'warehouse-name'
            },
            computer: {
                'payment-information': (value) => {
                    let key = '支付信息'

                    if(!value[key] || value[key] == null || value[key] == ''){
                        return '[]'
                    }

                    let inputString = value[key]
                    let jsonString = '[' + inputString.replace(/{/g, '{"').replace(/}/g, '"}').replace(/:/g, '":"').replace(/,/g, '","').replace(/}","{/g, '},{') + ']'

                    return jsonString
                }
            }
        },
        {
            disabled: false,
            name: getString('ordersInformTable'),
            task: 'morifyOrderDetails',
            theadstart: '子订单号',
            theadend: '组合商品购买数量',
            corresponding: {
                '子订单号': 'sub-order-id',
                'SKUId': 'SKUId',
                '条码': 'barcode',
                '商品名称': 'goods-name',
                '发货拦截': 'shipment-interception',
                '规格': 'specifications',
                '商品单价': 'item-pricing',
                '实际售价': 'order-amount'
            },
            computer: {
                brand: (value) => {
                    if(value['商品名称'] != null){
                        for (let i = 0; i < shop.brandOptions.length; i++){
                            const brand = shop.brandOptions[i]
                            if(value['商品名称'].indexOf(brand.value) >= 0){
                                return brand.value
                            }
                            if(value['商品名称'].indexOf(brand.value.toLowerCase()) >= 0){
                                return brand.value
                            }
                            if(value['条码'].substr(0, 2) === brand.suffix){
                                return brand.value
                            }
                        }
                    }

                    if(/^\d+$/.test(value['条码'].substr(0, 3))){
                        return '查尔斯桃心'
                    }
                    return shop.brand
                },
            }
        }
    ],
    refunds: {
        disabled: false,
        name: getString('refundsInformTable'),
        task: 'morifyOrderRefunds',
        theadstart: '申请单号',
        theadend: '是否商责原因',
        corresponding: {
            'SKU': 'SKUId',
            '申请时间': 'refund-request',
            '最后处理时间': 'refund-processed',
            '售后类型': 'after-sales-type',
            '售后状态': 'after-sales-status',
            '退款金额': 'after-sales-price',
            '售后政策': 'after-sales-policy',
            '申请原因': 'after-sales-reason',
            '原因标签': 'reason-labels',
            '用户备注': 'user-notes',
            '用户退货物流公司': 'user-return-logistics-company',
            '用户退货物流单号': 'user-return-logistics-tracking-id',
            '上门取件运费': 'home-pickup-freight',
            '运费付款方': 'freight-payer',
            '免运费类型': 'free-shipping-type',
            '申请渠道': 'application-channels',
            '退款人手机号': 'refund-recipient-phonenumber'
        },
        computer: {
            'ticket-id': (value) => {
                let key = ['门店', '购物小票号']
                if(!value[key[0]] || value[key[0]] == null || !value[key[1]] || value[key[1]] == null){
                    return false
                }

                return value[key[0]].split('_')[1] + value[key[1]]
            },
            'commercial-responsibility': (value) => {
                let key = '是否商责原因'
                if(!value[key]){
                    return false
                }

                return value[key] == '是'? 1: 0
            }
        }
    },
    bills: {
        disabled: false,
        name: getString('orderBillsInformTable'),
        task: 'morifyOrderBill',
        theadstart: '订单类型',
        theadend: '收银员',
        theadendn: '销售渠道',
        corresponding: {
            '商品条码': 'barcode'
        },
        computer: {
            'ticket-id': (value) => {
                if(value['订单类型'] == '销售'){
                    return value['购物小票号']
                }
                if(value['订单类型'] == '退款'){
                    return value['原购物小票号']
                }
            },
            'order-time': (value) => {
                if(value['订单类型'] == '销售'){
                    return value['日期']
                }
                if(value['订单类型'] == '退款'){
                    return false
                }
            },
            'refund-ticket-id': (value) => {
                if(value['订单类型'] == '销售'){
                    return false
                }
                if(value['订单类型'] == '退款'){
                    return value['购物小票号']
                }
            },
            'refund-processed': (value) => {
                if(value['订单类型'] == '销售'){
                    return false
                }
                if(value['订单类型'] == '退款'){
                    return value['日期']
                }
            },
            coupon: (value) => {
                return Math.abs(value['优惠券/现金券'])
            },
            'shoppe-activity': (value) => {
                return Math.abs(value['专柜活动'])
            },
            'full-reduction': (value) => {
                return Math.abs(value['满减'])
            },
            '365discount': (value) => {
                return Math.abs(value['365折扣'])
            },
            integral: (value) => {
                return Math.abs(value['积分'])
            },
            income: (value) => {
                return Math.abs(value['净收金额'])
            },
            'order-amount': (value) => {
                return Math.abs(value['销售/退货金额'])
            }
        }
    }
})

const createLoading = ref(false)
let status = {}
const initDataStatus = async (data) => {
    for (let i = 0; i < data.length; i++){
        let s = data[i].status
        if(!status[s]){
            status[s] = await getStringAsync(data[i].status)
        }
        data[i].status = status[s]
    }
    return data
}

const uploadUrl = ref('')
const uploadSign = ref('')
const getUploadSign = async () => {
    uploadSign.value = await apiSign('/xlsx/parse')
    uploadUrl.value = `${host}/xlsx/parse?api_sign=${uploadSign.value}&access_token=${getToken()}`
}
getUploadSign()

const initData = async () => {
    loading.value = true
    let response = await service.api.imports.get((pagination.value.current - 1) * pagination.value.pageSize, pagination.value.pageSize)
    if(!response.result){
        tips(typeof response.error === 'string' ? response.error : response.error.message, 'error')
        loading.value = false
        return
    }
    res.value = await initDataStatus(response.data)
    pagination.value.total = response.total
    loading.value = false
}
let timerRefresh = null
const autoFresh = () => {
    timerRefresh = setInterval(async () => {
        let response = await service.api.imports.get((pagination.value.current - 1) * pagination.value.pageSize, pagination.value.pageSize)
        if(!response.result){
            tips(typeof response.error === 'string' ? response.error : response.error.message, 'error')
            return
        }
        res.value = await initDataStatus(response.data)
        pagination.value.total = response.total
        await getUploadSign()
    }, 1000)
}
const clearFresh = () => {
    clearInterval(timerRefresh)
    timerRefresh = null
}
const addTab = () => {
    let value
    if(!tabPanels.value || tabPanels.value.length === 0){
        value = 1
    } else {
        value = tabPanels.value[tabPanels.value.length - 1].value + 1
    }

    tabPanels.value.push({
        value,
        content: [],
        current: 0,
        filelist: [],
        data: [],
        type: false,
        jsonBody: false
    })
    tab.value = value
}
const saveFile = (url) => {
    window.open(url)
}
const parseTable = (index) => {
    for (const key in tableParse.value) {
        let temp = tableParse.value[key]
        let thead

        if(Array.isArray(temp)){
            thead = []

            let isThis = true
            for (let i = 0; i < temp.length; i++) {
                if(!tabPanels.value[index].data.content[i]){
                    isThis = false

                    break
                }
                let tempHead = tabPanels.value[index].data.content[i][0]
                thead[i] = []
                for (let th = 0; th < tempHead.length; th++){
                    if(tempHead[th]){
                        thead[i].push(tempHead[th])
                    }
                }

                if(thead[i][0] !== temp[i].theadstart || thead[i][thead[i].length - 1] !== temp[i].theadend){
                    isThis = false

                    break
                }
            }

            if(isThis){
                tips('识别到的表格为' + temp[0].name, 'info')

                let body = []
                for (let i = 0; i < temp.length; i++) {
                    body[i] = initTable(tabPanels.value[index].data.content[i], temp[i].corresponding, temp[i].computer)
                }
                tabPanels.value[index].type = key
                tabPanels.value[index].jsonBody = body
                tabPanels.value[index].current++

                return
            }
        } else {
            if(temp.disabled){
                continue
            }

            let tempHead = tabPanels.value[index].data.content[0][0]
            thead = []
            for (let th = 0; th < tempHead.length; th++){
                if(tempHead[th]){
                    thead.push(tempHead[th])
                }
            }

            if(
                (thead[0] === temp.theadstart && thead[thead.length - 1] === temp.theadend)
                || (temp.theadendn && thead[0] === temp.theadstart && thead[thead.length - 1] === temp.theadendn)
            ){
                let data = tabPanels.value[index].data.content[0]
                for (let j = data.length - 1; j >= 0; j--){
                    if(!data[j]){
                        data.splice(j, 1)
                    }
                    let isNull = true

                    for (let q = 0; q < data[j].length; q++){
                        if(data[j][q]){
                            isNull = false
                        }
                    }

                    if(isNull){
                        data.splice(j, 1)
                    }
                }

                if(data.length < 2){
                    tips('表格内容为空', 'info')
                    tabPanels.value[index].current--
                    return
                }

                tips('识别到的表格为' + temp.name, 'info')
                let body = initTable(data, temp.corresponding, temp.computer)
                tabPanels.value[index].type = key
                tabPanels.value[index].jsonBody = body
                tabPanels.value[index].current++

                return
            }
        }
    }

    tabPanels.value[index].current--
    tips('无法识别表格格式', 'warning')
}
const initTable = (data, corresponding, computer) => {
    let dataArray = []
    let header = data[0]

    for (let i = 1; i < data.length; i++) {
        let col = data[i]
        let item = {}
        let real = {}

        for (let t = 0; t < header.length; t++) {
            item[header[t]] = col[t]

            if(
            corresponding[header[t]]
            && col[t] !== ''
            && col[t] != null
            ){
                let property = corresponding[header[t]]
                real[property] = data[i][t]
            }
        }

        if(computer){
            for (const key in computer) {
                if(computer[key](item)){
                    real[key] = computer[key](item)
                }
            }
        }

        dataArray.push(real)
    }

    return dataArray
}
const close = (item) => {
    tab.value = 0

    for (let i = 0; i < tabPanels.value.length; i++) {
        if(tabPanels.value[i].value === item.value){
            tabPanels.value.splice(i, 1)
            break
        }
    }

    initData()
}
const submit = async (item) => {
    createLoading.value = true
    let jsonBody

    if(item.type === 'supplier'){
        jsonBody = {
            store: shop.store,
            brand: shop.brand,
            data: item.jsonBody
        }
    } else {
        jsonBody = item.jsonBody
    }

    await service.api.imports.create(tableParse.value[item.type].task, jsonBody)

    item.current++
    createLoading.value = false
}
const submitOrder = async (item) => {
    createLoading.value = true

    for (let i = item.jsonBody.length - 1; i >= 0; i--) {
        await service.api.imports.create(tableParse.value[item.type][i].task, item.jsonBody[i])
    }

    item.current++
    createLoading.value = false
}

const removeOrder = ref(null)

onMounted(() => {
    initData()
})
onActivated(() => {
    autoFresh()
})
onDeactivated(() => {
    clearFresh()
})


</script>

<style>
.main-content .t-card{
    overflow: hidden;
    height: calc(100vh - 120px);
    margin: 15px;
}
.main-content .t-card__body{
    padding: 0;
}
.main-content .t-tabs__nav-item{
    padding: 0 12px;
}
.main-content .t-tabs__content{
    height: calc(100vh - 100px);
    overflow-y: auto;
    border-left: 1px solid #dfdfdf;
}
.main-content .headbar{
    z-index: 50;
    position: sticky;
    top: 0;
    left: 0;
    padding: 12px;
    border-bottom: 1px solid #dfdfdf;
    background-color: #fff;
}
.main-content .headbar .t-button{
    margin-right: 8px;
}
.main-content .new-card-body{
    position: relative;
    width: 100%;
    padding: 15px 20px;
    box-sizing: border-box;
}
.main-content .box-center{
    position: absolute;
    top: 45vh;
    left: 50%;
    transform: translate(-50%, -50%);
}
.main-content .center-upload .t-upload__dragger{
    margin: 8px 0;
    width: 100%;
    height: calc(100vh - 350px);
}
.main-content #content-table{
    padding: 10px;
}
</style>