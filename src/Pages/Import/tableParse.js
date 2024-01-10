import dayjs from "dayjs"
const shop = inject('shop')

export default {
    sku: {
        name: 'SKU信息表',
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
                return value['是否组合商品'] == '是'? 1 : 0
            },
            'miaostreet-listing-status': (value) => {
                return value['喵街上架状态'] == '上架'? 1 : 0
            },
            'tmall-listing-status': (value) => {
                return value['天猫上架状态'] == '上架'? 1 : 0
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
                    if (goodsName && goodsName != null && goodsName != undefined && goodsName.indexOf(key) >= 0) {
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
                    if (forTheCrowd && forTheCrowd != null && forTheCrowd != undefined && forTheCrowd.indexOf(key) >= 0) {
                        return maybeSex[key]
                    }
                    if (goodsName && goodsName != null && goodsName != undefined && goodsName.indexOf(key) >= 0) {
                        return maybeSex[key]
                    }
                }

                return sex
            }
        }
    },
    spu: {
        name: '款信息表',
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
        name: '库存信息表',
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
        name: '商品价格信息及上架时间导入表',
        task: 'morifySku',
        theadstart: 'SKU编码',
        theadend: '上架时间',
        corresponding: {
            'SKU编码': 'SKU',
            '运营价': 'cost',
            '日常销售价': 'price'
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
        name: '商品额外导入表',
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
            name: '订单信息导入表',
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
            name: '订单信息导入表',
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
                '实际售价': 'order-amount',
                '商品单价': 'actual-selling-price'
            },
            computer: {
                brand: (value) => {
                    return shop.brand
                }
            }
        }
    ],
    refunds: {
        name: '退款信息表',
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
        name: '销售对账信息表',
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
}