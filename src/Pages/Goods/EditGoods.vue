<template>
    <t-drawer
    v-model:visible="visible"
    attach="#goods-list"
    show-in-attached-element
    size="600px"
    :footer="false"
    destroy-on-close
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
                    {{ shop.storeOptions.filter(item => item.value === sku[0]['store-id'])[0].label }}
                    {{ sku[0]['store-id'] }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('counter') }}
                <template #action>
                    {{ sku[0]['shoppe-id'] }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('brand') }}
                <template #action>
                    {{ sku[0].brand }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('stylenumber') }}
                <template #action>
                    <t-input
                    v-model="sku[0].stylenumber"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj.stylenumber = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('goodName') }}
                <template #action>
                    <div style="width: 320px;">
                        <t-textarea
                        v-model="sku[0].name"
                        @change="(value) => {
                            sku = 
                            sku.map(obj => {
                                obj.name = value
                                return obj
                            })
                        }"
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
                        v-for="item, index in uniqueArray(sku, 'color')"
                        :key="index"
                        :default-value="item"
                        size="small"
                        align="center"
                        @change="(value) => {
                            sku = sku.map(obj => {
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
                    v-if="uniqueArray(sku, 'colorid').length === uniqueArray(sku, 'color').length"
                    >
                        <t-input
                        v-for="item, index in uniqueArray(sku, 'colorid')"
                        :key="index"
                        :default-value="item"
                        size="small"
                        align="center"
                        @change="(value) => {
                            sku = sku.map(obj => {
                                if(obj.colorid === item){
                                    obj.colorid = value
                                }
                                return obj
                            })
                        }"
                        ></t-input>
                    </t-space>
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('size') }}
                <template #action>
                    <t-space size="3px" direction="vertical">
                        <t-input
                        v-for="item, index in uniqueArray(sku, 'size')"
                        :key="index"
                        :default-value="item"
                        size="small"
                        align="center"
                        @change="(value) => {
                            sku = sku.map(obj => {
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
                    v-if="uniqueArray(sku, 'sizeid').length === uniqueArray(sku, 'size').length"
                    >
                        <t-input
                        v-for="item, index in uniqueArray(sku, 'sizeid')"
                        :key="index"
                        :default-value="item"
                        size="small"
                        align="center"
                        @change="(value) => {
                            sku = sku.map(obj => {
                                if(obj.sizeid === item){
                                    obj.sizeid = value
                                }
                                return obj
                            })
                        }"
                        ></t-input>
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
                            v-for="item, index in sku"
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
                    v-model="sku[0]['miaostreet-id']"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj['miaostreet-id'] = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('category') }}
                <template #action>
                    <t-cascader
                    v-model="sku[0]['category-id']"
                    @change="(value) => {
                        let category
                        categoryOptions.map(obj => {
                            if(obj.children){
                                if(obj.value == value){
                                    category = [obj.label]
                                }
                                let array2 = obj.children

                                array2.map(obj2 => {
                                    if(obj2.children){
                                        if(obj2.value == value){
                                            category = [obj.label, obj2.label]
                                        }

                                        let array3 = obj2.children
                                        array3.map(obj3 => {
                                            if(obj3.value == value){
                                                category = [obj.label, obj2.label, obj3.label]
                                            }
                                        })
                                    }
                                })
                            }
                        })
                        category = category.join('->')
                        sku = 
                        sku.map(obj => {
                            obj['category-id'] = value
                            obj.category = category
                            return obj
                        })
                    }"
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
                    v-model="sku[0].supplier"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj.supplier = value
                            return obj
                        })
                    }"
                    :input-props="{
                        align: 'center'
                    }"
                    :options="supplierOptions.map(obj => obj.value)"
                    size="small"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('supplier') }}{{ getString('stylenumber') }}
                <template #action>
                    <t-input
                    v-model="sku[0]['supplier-id']"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj['supplier-id'] = value
                            return obj
                        })
                    }"
                    align="center"
                    size="small"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                SPU ID
                <template #action>
                    <t-input
                    v-model="sku[0]['spu-id']"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj['spu-id'] = value
                            return obj
                        })
                    }"
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
                    v-if="Math.min(...sku.map(obj => obj.cost)) !== Math.max(...sku.map(obj => obj.cost)) && !isNaN(Math.min(...sku.map(obj => obj.cost))) && !isNaN(Math.max(...sku.map(obj => obj.cost)))"
                    @change="(checked) => {
                        if(checked){
                            let cost = sku[0].cost
                            sku = 
                            sku.map(obj => {
                                obj.cost = cost
                                return obj
                            })
                        }
                    }"
                    >{{ getString('unify') }}</t-checkbox>
                    <t-input-number
                    v-if="Math.min(...sku.map(obj => obj.cost)) === Math.max(...sku.map(obj => obj.cost)) || isNaN(Math.min(...sku.map(obj => obj.cost))) || isNaN(Math.max(...sku.map(obj => obj.cost)))"
                    v-model="sku[0].cost"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj.cost = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    style="margin: 0 10px;"
                    />
                    <span
                    v-if="Math.min(...sku.map(obj => obj.cost)) !== Math.max(...sku.map(obj => obj.cost)) && !isNaN(Math.min(...sku.map(obj => obj.cost))) && !isNaN(Math.max(...sku.map(obj => obj.cost)))"
                    style="margin: 0 10px;"
                    >
                        {{ Math.min(...sku.map(obj => obj.cost)) }}
                        ~
                        {{ Math.max(...sku.map(obj => obj.cost)) }}
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
                                v-for="item, index in sku"
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
                    v-if="Math.min(...sku.map(obj => obj.price)) !== Math.max(...sku.map(obj => obj.price)) && !isNaN(Math.min(...sku.map(obj => obj.price))) && !isNaN(Math.max(...sku.map(obj => obj.price)))"
                    @change="(checked) => {
                        if(checked){
                            let price = sku[0].price
                            sku = 
                            sku.map(obj => {
                                obj.price = price
                                return obj
                            })
                        }
                    }"
                    >{{ getString('unify') }}</t-checkbox>
                    <t-input-number
                    v-if="Math.min(...sku.map(obj => obj.price)) === Math.max(...sku.map(obj => obj.price)) || isNaN(Math.min(...sku.map(obj => obj.price))) || isNaN(Math.max(...sku.map(obj => obj.price)))"
                    v-model="sku[0].price"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj.price = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    style="margin: 0 10px;"
                    />
                    <span
                    v-if="Math.min(...sku.map(obj => obj.price)) !== Math.max(...sku.map(obj => obj.price)) && !isNaN(Math.min(...sku.map(obj => obj.price))) && !isNaN(Math.max(...sku.map(obj => obj.price)))"
                    style="margin: 0 10px;"
                    >
                        {{ Math.min(...sku.map(obj => obj.price)) }}
                        ~
                        {{ Math.max(...sku.map(obj => obj.price)) }}
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
                                v-for="item, index in sku"
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
                    v-if="Math.min(...sku.map(obj => obj.tagprice)) !== Math.max(...sku.map(obj => obj.tagprice)) && !isNaN(Math.min(...sku.map(obj => obj.tagprice))) && !isNaN(Math.max(...sku.map(obj => obj.tagprice)))"
                    @change="(checked) => {
                        if(checked){
                            let tagprice = sku[0].tagprice
                            sku = 
                            sku.map(obj => {
                                obj.tagprice = tagprice
                                return obj
                            })
                        }
                    }"
                    >{{ getString('unify') }}</t-checkbox>
                    <t-input-number
                    v-if="Math.min(...sku.map(obj => obj.tagprice)) === Math.max(...sku.map(obj => obj.tagprice)) || isNaN(Math.min(...sku.map(obj => obj.tagprice))) || isNaN(Math.max(...sku.map(obj => obj.tagprice)))"
                    v-model="sku[0].tagprice"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj.tagprice = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    style="margin: 0 10px;"
                    />
                    <span
                    v-if="Math.min(...sku.map(obj => obj.tagprice)) !== Math.max(...sku.map(obj => obj.tagprice)) && !isNaN(Math.min(...sku.map(obj => obj.tagprice))) && !isNaN(Math.max(...sku.map(obj => obj.tagprice)))"
                    style="margin: 0 10px;"
                    >
                        {{ Math.min(...sku.map(obj => obj.tagprice)) }}
                        ~
                        {{ Math.max(...sku.map(obj => obj.tagprice)) }}
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
                                v-for="item, index in sku"
                                :key="index"
                                >
                                    {{ item.barcode }}
                                    <template #action>
                                        <t-input
                                        v-model="item.tagprice"
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
                {{ getString('firstListingTime') }}
                <template #action>
                    <t-date-picker
                    v-model="sku[0]['first-listing-time']"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj['first-listing-time'] = value
                            return obj
                        })
                    }"
                    :input-props="{
                        align: 'center'
                    }"
                    size="small"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('inputTime') }}
                <template #action>
                    <t-date-picker
                    v-model="sku[0]['entry-time']"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj['entry-time'] = value
                            return obj
                        })
                    }"
                    :input-props="{
                        align: 'center'
                    }"
                    enable-time-picker
                    size="small"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ getString('editTime') }}
                <template #action>
                    <t-date-picker
                    v-model="sku[0]['update-time']"
                    @change="(value) => {
                        sku = 
                        sku.map(obj => {
                            obj['update-time'] = value
                            return obj
                        })
                    }"
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

<script>
import { uniqueArray } from '../../hooks'
import confirmBar from '../../components/confirmBar.vue'
import {MessagePlugin} from "tdesign-vue-next";
import service from "../../api/service.js";
import {tips} from "../../hooks/tips.js";
import {getString} from "../../i18n/index.js";

export default {
    methods: {getString},
    components: {
        confirmBar
    },
    props: {
        supplierOptions: {
            type: Array,
            default: []
        },
        categoryOptions: {
            type: Array,
            required: true,
            default: []
        }
    },
    emits: ['reload'],
    setup(props, { emit }){
        const i18n = inject('i18n')
        const serve = inject('serve')
        const shop = inject('shop')

        const visible = ref(false)
        const loading = ref(true)
        const submit = ref(false)
        const sku = ref([])

        const autoMakeBarcode = () => {
            for (let i = 0; i < sku.value.length; i++) {
                let stylenumber = sku.value[i].stylenumber
                let colorCode = sku.value[i].colorid
                let size = sku.value[i].size
                let sizeM1 = size.split('(')
                let sizeM2 = size.split('/')
                let sizeCode

                if((sizeM1.length > 1 && sizeM2.length > 1) || sizeM1.length > 1){
                    sizeCode = sizeM1[0]
                } else {
                    sizeCode = sizeM2[0]
                }

                sku.value[i].barcode = stylenumber + colorCode + sizeCode
            }
        }
        const open = async (row) => {
            visible.value = true
            loading.value = true
            sku.value = []

            let res = await service.api.goods.getItem(row.stylenumber)
            if(res.result){
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i]['category-id'] = parseInt(res.data[i]['category-id'])
                }
                sku.value = res.data
            } else {
                tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
            }

            loading.value = false
        }
        const set = async () => {
            submit.value = true

            let task = await service.api.imports.create('morifySku', sku.value)
            if(!task.result){
                tips(typeof res.error === 'string' ? res.error : res.error.message, 'error')
                submit.value = false
                return
            }

            let res = await service.api.imports.start('sku', task.id)
            if(res.result){
                await MessagePlugin.success(getString('editSuccess'))
            }
            submit.value = false
            visible.value = false
            emit('reload')
        }
        const close = () => {
            visible.value = false
        }

        return {
            i18n,
            shop,
            visible,
            loading,
            submit,
            sku,
            close,
            open,
            set,
            autoMakeBarcode,
            uniqueArray
        }
    }
}
</script>

<style>

</style>