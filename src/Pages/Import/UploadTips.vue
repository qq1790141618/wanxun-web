<template>
    <div style="padding: 13px; padding-top: 0;">
        <h3>
            {{ getString('autoRecognitionInformToWhenAllOfTableUploaded') }}：
        </h3>
        <h4>
            {{ getString('informAboutGoods') }}：
        </h4>
        <div>
            {{ getString('skuInformTable') }}：
            喵街MOS商家后台
            <t-icon name="chevron-right"></t-icon>
            商品
            <t-icon name="chevron-right"></t-icon>
            商品信息管理
            <t-icon name="chevron-right"></t-icon>
            专柜款商品信息管理
            <t-icon name="chevron-right"></t-icon>
            导出
            <t-icon name="chevron-right"></t-icon>
            导出sku
        </div>
        <div>
            {{ getString('spuInformTable') }}：
            喵街MOS商家后台
            <t-icon name="chevron-right"></t-icon>
            商品
            <t-icon name="chevron-right"></t-icon>
            商品信息管理
            <t-icon name="chevron-right"></t-icon>
            专柜款商品信息管理
            <t-icon name="chevron-right"></t-icon>
            导出
            <t-icon name="chevron-right"></t-icon>
            导出款信息
        </div>
        <div>
            {{ getString('inventoryInformTable') }}：
            喵街MOS商家后台
            <t-icon name="chevron-right"></t-icon>
            商品
            <t-icon name="chevron-right"></t-icon>
            商品信息管理
            <t-icon name="chevron-right"></t-icon>
            商品库存查询
            <t-icon name="chevron-right"></t-icon>
            批量导出
            <t-icon name="chevron-right"></t-icon>
            批量导出(不要勾选“占库类型统计”和“分供应商（货主）”)
        </div>
        <div>
            {{ getString('skuImportTemplate') }}【{{ getString('cost') }}，{{ getString('price') }}，{{ getString('firstListingTime') }}，{{ getString('supplier') }}，{{ getString('supplier') }} {{ getString('stylenumber') }}，{{ getString('sex') }}，{{ getString('season') }}】：
            在本页下载相应的导入模板
        </div>
        <h4>
            {{ getString('informAboutOrders') }}：
        </h4>
        <div>
            {{ getString('ordersInformTable') }}：
            喵街MOS商家后台
            <t-icon name="chevron-right"></t-icon>
            商品
            <t-icon name="chevron-right"></t-icon>
            单据管理
            <t-icon name="chevron-right"></t-icon>
            订单查询
            <t-icon name="chevron-right"></t-icon>
            批量导出
        </div>
        <div>
            {{ getString('refundsInformTable') }}：
            喵街MOS商家后台
            <t-icon name="chevron-right"></t-icon>
            商品
            <t-icon name="chevron-right"></t-icon>
            单据管理
            <t-icon name="chevron-right"></t-icon>
            喵街线上退换货
            <t-icon name="chevron-right"></t-icon>
            导出excel
        </div>
        <div>
            {{ getString('orderBillsInformTable') }}：
            喵街MOS商家后台
            <t-icon name="chevron-right"></t-icon>
            交易
            <t-icon name="chevron-right"></t-icon>
            财务管理
            <t-icon name="chevron-right"></t-icon>
            销售明细对账
            <t-icon name="chevron-right"></t-icon>
            导出Excel
        </div>
        <h3>
            {{ getString('attention') }}：
        </h3>
<!--        <div v-if="i18n.language === 'zh'">-->
<!--            <t-icon name="numbers-1-1"></t-icon>-->
<!--            <span>导入顺序每一个种类</span>-->
<!--            <span style="color: red; font-weight: bold; vertical-align: middle;">从上到下严格的顺序</span>-->
<!--            <span>依次倒入，在导入后一项时确保前一项已经成功导入，例如：</span>-->
<!--            <span>订单列表/订单明细</span>-->
<!--            <t-icon name="chevron-right"></t-icon>-->
<!--            <span>订单退款信息</span>-->
<!--            <t-icon name="chevron-right"></t-icon>-->
<!--            <span>销售对账信息</span>。-->
<!--        </div>-->
<!--        <div v-if="i18n.language !== 'zh'">-->
<!--            <t-icon name="numbers-1-1"></t-icon>-->
<!--            <span>Import order for each category</span>-->
<!--            <span>Strict order from top to bottom</span>-->
<!--            <span>Pour in one by one, ensuring that the previous item has been successfully imported when importing the next item, for example:</span>-->
<!--            <span>Order List/Order Details</span>-->
<!--            <t-icon name="chevron-right"></t-icon>-->
<!--            <span>Order refund information</span>-->
<!--            <t-icon name="chevron-right"></t-icon>-->
<!--            <span>Sales reconciliation information.</span>。-->
<!--        </div>-->
        <div v-if="i18n.language === 'zh'">
<!--            <t-icon name="numbers-2-1"></t-icon>-->
            <span>导入（订单列表/订单明细，订单退款信息，销售对账信息）时，三项的在后台导出的</span>
            <span style="color: red; font-weight: bold; vertical-align: middle;">日期时间选择，需要完全一致</span>。
        </div>
        <div v-if="i18n.language !== 'zh'">
<!--            <t-icon name="numbers-2-1"></t-icon>-->
            <span>When importing (order list/order details, order refund information, sales reconciliation information), the three items are exported in the background</span> <span style="color: red; font-weight: bold; vertical-align: middle;">Date and time selection must be completely consistent.</span>
        </div>
<!--        <div v-if="i18n.language === 'zh'">-->
<!--            <t-icon name="numbers-3-1"></t-icon>-->
<!--            <span>新版本导入的所有内容以表格内容为准，</span>-->
<!--            <span style="color: red; font-weight: bold; vertical-align: middle;">与设置内选择的 门店/品牌 无关</span>。-->
<!--        </div>-->
<!--        <div v-if="i18n.language !== 'zh'">-->
<!--            <t-icon name="numbers-3-1"></t-icon>-->
<!--            <span>All content imported in the new version shall be based on the table content</span> <span style="color: red; font-weight: bold; vertical-align: middle;">Not related to the selected store/brand within the settings.</span>-->
<!--        </div>-->
    </div>
</template>

<script setup>
import {getString} from "../../i18n/index.js"
const i18n = inject('i18n')
</script>

<style>

</style>