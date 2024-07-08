<template>
    <t-drawer
        v-model:visible="visible"
        attach="#goods-list"
        size="600px"
        :footer="false"
        :show-in-attached-element="true"
        :destroy-on-close="true"
    >
        <template #header>
            <t-icon name="edit" style="margin-right: 5px;" />
            {{ getString('edit') }}
        </template>
        <t-loading
            v-if="loading"
            style="width: 100%; min-height: 70vh;"
            size="small"
            :text="getString('loading')"
        ></t-loading>
        <t-list
            v-if="!loading"
            :split="true"
            size="small"
        >
            <t-list-item>
                {{ getString('store') }}
                <template #action>
                    {{ shop.storeOptions.find(item => item.id === shop.store).name }}
                    {{ shop.store }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('counter') }}
                <template #action>
                    {{ product.shoppe }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('brand') }}
                <template #action>
                    {{ shop.brandOptions.find(item => item.id === shop.brand).name }}
                    {{ shop.brand }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('stylenumber') }}
                <template #action>
                    {{ product.styleNumber }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('goodName') }}
                <template #action>
                    <div style="width: 320px;">
                        <t-textarea
                            v-model="product.name"
                            size="small"
                            align="center"
                        />
                    </div>
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('color') }}
                <template #action>
                    <t-space size="3px" direction="vertical">
                        <t-input
                            v-for="(item, index) in uniqueArray(product.skus, 'color')"
                            :key="index"
                            :default-value="item"
                            size="small"
                            align="center"
                            @change="(value) => {
                                product.skus = product.skus.map(obj => {
                                    if(obj.color === item){
                                        obj.color = value
                                    }
                                    return obj
                                })
                            }"
                        ></t-input>
                    </t-space>
                    <t-space
                        size="3px"
                        direction="vertical"
                        style="width: 80px; margin-left: 3px;"
                        v-if="uniqueArray(product.skus, 'colorId').length === uniqueArray(product.skus, 'color').length"
                    >
<!--                        <t-input-->
<!--                            v-for="(item, index)in uniqueArray(product.skus, 'colorId')"-->
<!--                            :key="index"-->
<!--                            :default-value="item"-->
<!--                            size="small"-->
<!--                            align="center"-->
<!--                            @change="(value) => {-->
<!--                                product.skus = product.skus.map(obj => {-->
<!--                                    if(obj.colorId === item){-->
<!--                                        obj.colorId = value-->
<!--                                    }-->
<!--                                    return obj-->
<!--                                })-->
<!--                            }"-->
<!--                        ></t-input>-->
                    </t-space>
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('size') }}
                <template #action>
                    <t-space size="3px" direction="vertical">
                        <t-input
                            v-for="(item, index) in uniqueArray(product.skus, 'size')"
                            :key="index"
                            :default-value="item"
                            size="small"
                            align="center"
                            @change="(value) => {
                                product.skus = product.skus.map(obj => {
                                    if(obj.size === item){
                                        obj.size = value
                                    }
                                    return obj
                                })
                            }"
                        ></t-input>
                    </t-space>
                    <t-space
                        size="3px"
                        direction="vertical"
                        style="width: 80px; margin-left: 3px;"
                        v-if="uniqueArray(product.skus, 'sizeId').length === uniqueArray(product.skus, 'size').length"
                    >
<!--                        <t-input-->
<!--                            v-for="(item, index) in uniqueArray(product.skus, 'sizeId')"-->
<!--                            :key="index"-->
<!--                            :default-value="item"-->
<!--                            size="small"-->
<!--                            align="center"-->
<!--                            @change="(value) => {-->
<!--                                product.skus = product.skus.map(obj => {-->
<!--                                    if(obj.sizeId === item){-->
<!--                                        obj.sizeId = value-->
<!--                                    }-->
<!--                                    return obj-->
<!--                                })-->
<!--                            }"-->
<!--                        ></t-input>-->
                    </t-space>
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('barcode') }}
                <t-popup placement="right" trigger="click">
                    <t-button
                        variant="outline"
                        size="small"
                    >
                        <template #icon>
                            <t-icon name="edit" />
                        </template>
                    </t-button>
                    <template #content>
                        <t-list
                        :split="true"
                        size="small"
                        style="width: 400px; max-height: 60vh; overflow-y: auto;"
                        >
                            <t-list-item
                            >
                                {{ getString('color') }}
                                {{ getString('size') }}
                                <template #action>
                                    {{ getString('barcode') }}
                                    <t-button
                                    variant="outline"
                                    size="small"
                                    @click="autoMakeBarcode"
                                    >
                                        <template #icon>
                                            <t-icon name="tree-round-dot-vertical" />
                                        </template>
                                    </t-button>
                                </template>
                            </t-list-item>
                            <t-list-item
                            v-for="(item, index) in product.skus"
                            :key="index"
                            >
                                {{ item.color }}
                                {{ item.size }}
                                <template #action>
                                    <t-input
                                    v-model="item.barcode"
                                    size="small"
                                    align="center"
                                    />
                                </template>
                            </t-list-item>
                        </t-list>
                    </template>
                </t-popup>
            </t-list-item>
            <t-list-item>
                {{ getString('miaostreet-id') }}
                <template #action>
                    <t-input
                        v-model="product.id"
                        size="small"
                        align="center"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('category') }}
                <template #action>
                    <t-cascader
                        v-model="product.category"
                        :options="categoryOptions"
                        size="small"
                        align="center"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('supplier') }}
                <template #action>
                    <t-auto-complete
                        v-model="product.supplier"
                        :input-props="{
                            align: 'center'
                        }"
                        :options="supplierOptions"
                        size="small"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('supplier') }}{{ getString('stylenumber') }}
                <template #action>
                    <t-input
                        v-model="product.supplierId"
                        align="center"
                        size="small"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                SPU ID
                <template #action>
                    <t-input
                        v-model="product.spu"
                        size="small"
                        align="center"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('cost') }}
                <template #action>
                    <t-checkbox
                        style="vertical-align: middle;"
                        v-if="Math.min(...product.skus.map(obj => obj.cost)) !== Math.max(...product.skus.map(obj => obj.cost)) && !isNaN(Math.min(...product.skus.map(obj => obj.cost))) && !isNaN(Math.max(...product.skus.map(obj => obj.cost)))"
                        @change="(checked) => {
                            if(checked){
                                let cost = product.skus[0].cost
                                product.skus = product.skus.map(obj => {
                                    obj.cost = cost
                                    return obj
                                })
                            }
                        }"
                    >{{ getString('unify') }}</t-checkbox>
                    <t-input-number
                        v-if="Math.min(...product.skus.map(obj => obj.cost)) === Math.max(...product.skus.map(obj => obj.cost)) || isNaN(Math.min(...product.skus.map(obj => obj.cost))) || isNaN(Math.max(...product.skus.map(obj => obj.cost)))"
                        v-model="product.skus[0].cost"
                        @change="(value) => {
                            product.skus =
                            product.skus.map(obj => {
                                obj.cost = value
                                return obj
                            })
                        }"
                        size="small"
                        align="center"
                        style="margin: 0 10px;"
                    />
                    <span
                        v-if="Math.min(...product.skus.map(obj => obj.cost)) !== Math.max(...product.skus.map(obj => obj.cost)) && !isNaN(Math.min(...product.skus.map(obj => obj.cost))) && !isNaN(Math.max(...product.skus.map(obj => obj.cost)))"
                        style="margin: 0 10px;"
                    >
                        {{ Math.min(...product.skus.map(obj => obj.cost)) }}
                        ~
                        {{ Math.max(...product.skus.map(obj => obj.cost)) }}
                    </span>
                    <t-popup placement="right" trigger="click">
                        <t-button
                            variant="outline"
                            size="small"
                        >
                            {{ getString('barcode') }}{{ getString('cost') }}
                        </t-button>
                        <template #content>
                            <t-list
                                :split="true"
                                size="small"
                                style="width: 400px; max-height: 60vh; overflow-y: auto;"
                            >
                                <t-list-item
                                >
                                    {{ getString('barcode') }}
                                    <template #action>
                                        {{ getString('cost') }}
                                    </template>
                                </t-list-item>
                                <t-list-item
                                    v-for="(item, index) in product.skus"
                                    :key="index"
                                >
                                    {{ item.barcode }}
                                    <template #action>
                                        <t-input
                                        v-model="item.cost"
                                        size="small"
                                        align="center"
                                        />
                                    </template>
                                </t-list-item>
                            </t-list>
                        </template>
                    </t-popup>
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('price') }}
                <template #action>
                    <t-checkbox
                    style="vertical-align: middle;"
                    v-if="Math.min(...product.skus.map(obj => obj.price)) !== Math.max(...product.skus.map(obj => obj.price)) && !isNaN(Math.min(...product.skus.map(obj => obj.price))) && !isNaN(Math.max(...product.skus.map(obj => obj.price)))"
                    @change="(checked) => {
                        if(checked){
                            let price = product.skus[0].price
                            product.skus = 
                            product.skus.map(obj => {
                                obj.price = price
                                return obj
                            })
                        }
                    }"
                    >{{ getString('unify') }}</t-checkbox>
                    <t-input-number
                    v-if="Math.min(...product.skus.map(obj => obj.price)) === Math.max(...product.skus.map(obj => obj.price)) || isNaN(Math.min(...product.skus.map(obj => obj.price))) || isNaN(Math.max(...product.skus.map(obj => obj.price)))"
                    v-model="product.skus[0].price"
                    @change="(value) => {
                        product.skus = 
                        product.skus.map(obj => {
                            obj.price = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    style="margin: 0 10px;"
                    />
                    <span
                    v-if="Math.min(...product.skus.map(obj => obj.price)) !== Math.max(...product.skus.map(obj => obj.price)) && !isNaN(Math.min(...product.skus.map(obj => obj.price))) && !isNaN(Math.max(...product.skus.map(obj => obj.price)))"
                    style="margin: 0 10px;"
                    >
                        {{ Math.min(...product.skus.map(obj => obj.price)) }}
                        ~
                        {{ Math.max(...product.skus.map(obj => obj.price)) }}
                    </span>
                    <t-popup placement="right" trigger="click">
                        <t-button
                        variant="outline"
                        size="small"
                        >
                            {{ getString('barcode') }}{{ getString('price') }}
                        </t-button>
                        <template #content>
                            <t-list
                            :split="true"
                            size="small"
                            style="width: 400px; max-height: 60vh; overflow-y: auto;"
                            >
                                <t-list-item
                                >
                                    {{ getString('barcode') }}
                                    <template #action>
                                        {{ getString('price') }}
                                    </template>
                                </t-list-item>
                                <t-list-item
                                v-for="item, index in product.skus"
                                :key="index"
                                >
                                    {{ item.barcode }}
                                    <template #action>
                                        <t-input
                                        v-model="item.price"
                                        size="small"
                                        align="center"
                                        />
                                    </template>
                                </t-list-item>
                            </t-list>
                        </template>
                    </t-popup>
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('tagPrice') }}
                <template #action>
                    <t-checkbox
                    style="vertical-align: middle;"
                    v-if="Math.min(...product.skus.map(obj => obj.tagPrice)) !== Math.max(...product.skus.map(obj => obj.tagPrice)) && !isNaN(Math.min(...product.skus.map(obj => obj.tagPrice))) && !isNaN(Math.max(...product.skus.map(obj => obj.tagPrice)))"
                    @change="(checked) => {
                        if(checked){
                            let tagPrice = product.skus[0].tagPrice
                            product.skus = 
                            product.skus.map(obj => {
                                obj.tagPrice = tagPrice
                                return obj
                            })
                        }
                    }"
                    >{{ getString('unify') }}</t-checkbox>
                    <t-input-number
                    v-if="Math.min(...product.skus.map(obj => obj.tagPrice)) === Math.max(...product.skus.map(obj => obj.tagPrice)) || isNaN(Math.min(...product.skus.map(obj => obj.tagPrice))) || isNaN(Math.max(...product.skus.map(obj => obj.tagPrice)))"
                    v-model="product.skus[0].tagPrice"
                    @change="(value) => {
                        product.skus = 
                        product.skus.map(obj => {
                            obj.tagPrice = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    style="margin: 0 10px;"
                    />
                    <span
                    v-if="Math.min(...product.skus.map(obj => obj.tagPrice)) !== Math.max(...product.skus.map(obj => obj.tagPrice)) && !isNaN(Math.min(...product.skus.map(obj => obj.tagPrice))) && !isNaN(Math.max(...product.skus.map(obj => obj.tagPrice)))"
                    style="margin: 0 10px;"
                    >
                        {{ Math.min(...product.skus.map(obj => obj.tagPrice)) }}
                        ~
                        {{ Math.max(...product.skus.map(obj => obj.tagPrice)) }}
                    </span>
                    <t-popup placement="right" trigger="click">
                        <t-button
                        variant="outline"
                        size="small"
                        >
                            {{ getString('barcode') }}{{ getString('tagPrice') }}
                        </t-button>
                        <template #content>
                            <t-list
                            :split="true"
                            size="small"
                            style="width: 400px; max-height: 60vh; overflow-y: auto;"
                            >
                                <t-list-item
                                >
                                    {{ getString('barcode') }}
                                    <template #action>
                                        {{ getString('tagPrice') }}
                                    </template>
                                </t-list-item>
                                <t-list-item
                                v-for="(item, index) in product.skus"
                                :key="index"
                                >
                                    {{ item.barcode }}
                                    <template #action>
                                        <t-input
                                        v-model="item.tagPrice"
                                        size="small"
                                        align="center"
                                        />
                                    </template>
                                </t-list-item>
                            </t-list>
                        </template>
                    </t-popup>
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('inputTime') }}
                <template #action>
                    <t-date-picker
                    v-model="product.created"
                    :input-props="{
                        align: 'center'
                    }"
                    enable-time-picker
                    size="small"
                    />
                </template>
            </t-list-item>
        </t-list>
        <confirm-bar
        v-if="!loading"
        :confirm-loading="submit"
        @confirm="set"
        @close="close"
        noreset
        style="margin-top: 10px; position: sticky; bottom: 0;"
        />
    </t-drawer>
</template>

<script setup>
import { uniqueArray } from '../../hooks'
import confirmBar from '../../components/confirmBar.vue'
import {tips} from "../../hooks/tips.js"
import {getString} from "../../i18n/index.js"
import {request} from "../../api/request.js"

const props = defineProps({
    supplierOptions: {
        type: Array,
        default: []
    },
    categoryOptions: {
        type: Array,
        required: true,
        default: []
    }
})
const emit = defineEmits(['reload'])

const i18n = inject('i18n')
const shop = inject('shop')

const visible = ref(false)
const loading = ref(true)
const submit = ref(false)
const product = ref({})

const autoMakeBarcode = () => {
    for (let i = 0; i < product.skus.value.length; i++) {
        let stylenumber = product.skus.value[i].stylenumber
        let colorCode = product.skus.value[i].colorId
        let size = product.skus.value[i].size
        let sizeM1 = size.split('(')
        let sizeM2 = size.split('/')
        let sizeCode

        if((sizeM1.length > 1 && sizeM2.length > 1) || sizeM1.length > 1){
            sizeCode = sizeM1[0]
        } else {
            sizeCode = sizeM2[0]
        }

        product.skus.value[i].barcode = stylenumber + colorCode + sizeCode
    }
}
const open = async (row) => {
    visible.value = true
    loading.value = true

    let res = await request('/product', {
        storeId: shop.store,
        brandId: shop.brand,
        styleNumber: [
            row.styleNumber
        ]
    }, 'POST')
    if(res.status === 'success'){
        product.value = res.content.data[0]
        product.value.category = parseInt(product.value.category)
    } else {
        tips(res.error.msg, 'error')
    }

    loading.value = false
}
const set = async () => {
    submit.value = true

    let res = await request('/product', {
        storeId: shop.store,
        brandId: shop.brand,
        goodItem: product.value
    }, 'PUT')
    if(res.status !== 'success'){
        tips(res.error.msg, 'error')
        submit.value = false
        return
    }

    submit.value = false
    visible.value = false
    emit('reload')
}
const close = () => {
    visible.value = false
}

defineExpose({
    open
})
</script>

<style>

</style>