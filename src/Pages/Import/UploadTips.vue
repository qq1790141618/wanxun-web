<template>
    <div style="padding: 13px; padding-top: 0;">
        <h3>
            所有上传的表格将自动会识别表格类型：
        </h3>
        <h4>
            商品相关信息：
        </h4>
        <div>
            SKU信息：
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
            SKU/款信息：
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
            商品库存信息：
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
            SKU其他信息导入【运营价，日常销售价，上架时间，供应商，原厂编码，适用性别，适用季节】：
            在本页下载相应的导入模板
        </div>
        <h4>
            订单相关信息：
        </h4>
        <div>
            订单列表/订单明细：
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
            订单退款信息：
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
            销售对账信息：
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
            注意：
        </h3>
        <div>
            <t-icon name="numbers-1-1"></t-icon>
            <span>导入顺序每一个种类</span>
            <span style="color: red; font-weight: bold; vertical-align: middle;">从上到下严格的顺序</span>
            <span>依次倒入，在导入后一项时确保前一项已经成功导入，例如：</span>
            <span>订单列表/订单明细</span>
            <t-icon name="chevron-right"></t-icon>
            <span>订单退款信息</span>
            <t-icon name="chevron-right"></t-icon>
            <span>销售对账信息</span>。
        </div>
        <div>
            <t-icon name="numbers-2-1"></t-icon>
            <span>导入（订单列表/订单明细，订单退款信息，销售对账信息）时，三项的在后台导出的</span>
            <span style="color: red; font-weight: bold; vertical-align: middle;">日期时间选择，需要完全一致</span>。
        </div>
        <div>
            <t-icon name="numbers-3-1"></t-icon>
            <span>新版本导入的所有内容以表格内容为准，</span>
            <span style="color: red; font-weight: bold; vertical-align: middle;">与设置内选择的 门店/品牌 无关</span>。
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>