<template>
    <div style="display: flex; position: relative;" id="goods-list">
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
                    pagination.current = 1
                    selectKey = []
                    getSearchGoods()
                }"
                :disabled="loading || exportLoading"
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
            <t-alert style="padding: 5px 12px; position: sticky; top: 65px;">
                <template #icon><div></div></template>
                <t-space size="12px">
                    <span style="line-height: 30px;">
                        <t-icon name="check-rectangle" v-if="data.length > 0 && selectKey.length == data.length" />
                        <t-icon name="minus-rectangle" v-if="selectKey.length > 0 && selectKey.length < data.length" />
                        <t-icon name="close-rectangle" v-if="selectKey.length == 0" />
                        <span style="vertical-align: middle; margin-left: 3px;">
                            {{ localString.selected(selectKey.length)[local.name] }}
                        </span>
                    </span>
                    <t-button
                    variant="text"
                    theme="primary"
                    @click="() => {
                        batchEdit.data = {}
                        batchEdit.visible = true
                    }"
                    :disabled="selectKey.length == 0"
                    :title="localString.selected(selectKey.length)[local.name]"
                    >
                        <template #icon>
                            <t-icon name="edit" />
                        </template>
                        {{ localString.batch[local.name] }}{{ localString.edit[local.name] }}
                    </t-button>
                    <t-button
                    variant="text"
                    theme="primary"
                    @click="exportToFiles"
                    :disabled="loading || exportLoading"
                    :loading="exportLoading"
                    >
                        <template #icon>
                            <t-icon name="file-export" />
                        </template>
                        {{ confirmButton }}
                    </t-button>
                    <t-button
                    variant="text"
                    theme="primary"
                    @click="() => {
                        supplierMap.visible = true
                    }"
                    >
                        <template #icon>
                            <t-icon name="arrow-up-down-2" />
                        </template>
                        {{ localString.supplier[local.name] }}{{ localString.mapping[local.name] }}
                    </t-button>
                    <t-button
                    variant="text"
                    theme="primary"
                    @click="$router.push('/import')"
                    >
                        <template #icon>
                            <t-icon name="upload" />
                        </template>
                        {{ localString.informationImport[local.name] }}
                    </t-button>
                    <span style="line-height: 30px; cursor: pointer;">
                        <t-switch :custom-value="['cost-col', '']" v-model="costHighlight" @change="costHightLightChange" />
                        <span
                        style="vertical-align: middle; margin-left: 6px; color: var(--td-brand-color); user-select: none;"
                        @click="() => {
                            costHighlight = costHighlight == 'cost-col' ? '' : 'cost-col'
                            costHightLightChange(costHighlight)
                        }"
                        >
                            {{ localString.cost[local.name] }}{{ localString.highlight[local.name] }}
                        </span>
                    </span>
                </t-space>
            </t-alert>
            <div class="result-containter">
                <t-table
                size="small"
                :data="data"
                :columns="columns"
                :loading="loading"
                :loading-props="{
                    text: localString.loading[local.name]
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
                                {{ localString.edit[local.name] }}
                            </t-button>
                            <t-button
                            variant="outline"
                            v-if="row['miaostreet-id'] && row['miaostreet-id'] != null && row['miaostreet-id'] != ''"
                            @click="miaostreetGoodsLink(row)"
                            >
                                {{ localString.viewMiaostreetLink[local.name] }}
                            </t-button>
                            <t-button
                            variant="outline"
                            @click="viewGoods.open(row)"
                            >
                                {{ localString.viewGoods[local.name] }}
                            </t-button>
                            <t-button
                            variant="outline"
                            theme="primary"
                            v-if="row['miaostreet-id'] && row['miaostreet-id'] != null && row['miaostreet-id'] != ''"
                            @click="copy(row['miaostreet-id'], local.name)"
                            >
                                {{ localString.copy[local.name] }}{{ localString['miaostreet-id'][local.name] }}
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
    <t-dialog
    :close-btn="false"
    v-model:visible="batchEdit.visible"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :footer="false"
    width="600px"
    attach="#goods-list"
    show-in-attached-element
    >
        <template #header>
            <t-icon name="edit" style="margin-right: 5px;" />
            {{ localString.batch[local.name] }}{{ localString.edit[local.name] }}
        </template>
        <t-row :gutter="[12, 12]" style="width: 100%;">
            <t-col :span="6">
                <t-auto-complete
                v-model="batchEdit.data.supplier"
                :options="supplierOptions.map(obj => obj.value)"
                :input-props="{
                    label: localString.supplier[local.name] + ': '
                }"
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="6">
                <t-cascader
                v-model="batchEdit.data['category-id']"
                :options="categoryOptions"
                clearable
                filterable
                :label="localString.category[local.name] + ': '"
                :placeholder="localString.choose[local.name] + localString.category[local.name]"
                >
                </t-cascader>
            </t-col>
            <t-col :span="6">
                <t-select
                v-model="batchEdit.data['miaostreet-listing-status']"
                :options="[
                    {
                        label: localString.listing[local.name],
                        value: 1
                    },
                    {
                        label: localString.unlist[local.name],
                        value: 0
                    }
                ]"
                clearable
                filterable
                :label="localString.miaostreetListingStatus[local.name] + ': '"
                >
                </t-select>
            </t-col>
            <t-col :span="6">
                <t-select
                v-model="batchEdit.data['tmall-listing-status']"
                :options="[
                    {
                        label: localString.listing[local.name],
                        value: 1
                    },
                    {
                        label: localString.unlist[local.name],
                        value: 0
                    }
                ]"
                clearable
                filterable
                :label="localString.tmallListingStatus[local.name] + ': '"
                >
                </t-select>
            </t-col>
            <t-col :span="8">
                <t-space size="13px">
                    <span style="line-height: 32px;">
                        {{ localString.firstListingTime[local.name] + ': ' }}
                    </span>
                    <t-date-picker
                    v-model="batchEdit.data['first-listing-time']"
                    :disable-date="(current) => dayjs(current).isAfter(dayjs())"
                    >
                    </t-date-picker>
                </t-space>
            </t-col>
            <t-col :span="12">
                <confirm-bar
                :confirm-loading="batchEdit.loading"
                @confirm="batchEdit.done"
                @close="() => {
                    batchEdit.visible = false
                    batchEdit.loading = false
                    batchEdit.data = {}
                }"
                @reset="batchEdit.data = {}"
                />
            </t-col>
        </t-row>
    </t-dialog>
    <t-dialog
    :close-btn="false"
    v-model:visible="supplierMap.visible"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    :footer="false"
    width="600px"
    attach="#goods-list"
    show-in-attached-element
    >
        <template #header>
            <t-icon name="arrow-up-down-2" style="margin-right: 5px;" />
            {{ localString.supplier[local.name] }}{{ localString.mapping[local.name] }}
        </template>
        <t-row :gutter="[12, 12]" style="width: 100%;">
            <t-col :span="6">
                <t-auto-complete
                v-model="supplierMap.data.from"
                :options="supplierOptions.map(obj => obj.value)"
                :input-props="{
                    label: localString.original[local.name] + localString.supplier[local.name] + ': '
                }"
                clearable
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="6">
                <t-auto-complete
                v-model="supplierMap.data.to"
                :options="supplierOptions.map(obj => obj.value)"
                :input-props="{
                    label: localString.target[local.name] + localString.supplier[local.name] + ': '
                }"
                clearable
                >
                </t-auto-complete>
            </t-col>
            <t-col :span="12">
                <t-checkbox v-model="supplierMap.data.onlyStore">
                    {{ localString.onlyStore[local.name] }}
                </t-checkbox>
            </t-col>
            <t-col :span="12">
                <confirm-bar
                :confirm-loading="supplierMap.loading"
                @confirm="supplierMap.done"
                @close="supplierMap.close"
                @reset="supplierMap.data = {
                    from: null,
                    to: null,
                    onlyStore: true
                }"
                />
            </t-col>
        </t-row>
    </t-dialog>
    <t-dialog
    v-model:visible="viewGoods.visible"
    :footer="false"
    width="70vw"
    attach="#goods-list"
    show-in-attached-element
    top="8vh"
    >
        <template #header>
            <t-icon name="browse" style="margin-right: 5px;" />
            {{ localString.viewGoods[local.name] }}
        </template>
        <t-loading
        v-if="viewGoods.loading"
        style="width: 100%; min-height: 40vh;"
        size="small"
        :text="localString.loading[local.name]"
        ></t-loading>
        <div style="max-height: 60vh; overflow-y: auto; ">
            <t-row :gutter="[12, 12]" style="width: 100%;" v-if="!viewGoods.loading">
                <t-col :span="9">
                    <t-row :gutter="[12, 4]" style="width: 100%;">
                        <t-col :span="2" class="description-title">{{ localString.stylenumber[local.name] }}</t-col>
                        <t-col :span="5" class="description-title">{{ localString.goodName[local.name] }}</t-col>
                        <t-col :span="2" class="description-title">{{ localString.tagPrice[local.name] }}</t-col>
                        <t-col :span="3" class="description-title">{{ localString.category[local.name] }}</t-col>
                        <t-col :span="2">{{ viewGoods.data.stylenumber }}</t-col>
                        <t-col :span="5">{{ viewGoods.data.name }}</t-col>
                        <t-col :span="2">{{ viewGoods.data.tagprice }}</t-col>
                        <t-col :span="3">{{ viewGoods.data.category }}</t-col>
                        <t-col :span="5" class="description-title">{{ localString.size[local.name] }}</t-col>
                        <t-col :span="4" class="description-title">{{ localString.color[local.name] }}</t-col>
                        <t-col :span="1" class="description-title">{{ localString.inventory[local.name] }}</t-col>
                        <t-col :span="1" class="description-title">{{ localString.cost[local.name] }}</t-col>
                        <t-col :span="1" class="description-title">{{ localString.price[local.name] }}</t-col>
                        <t-col :span="5">{{ viewGoods.data.size }}</t-col>
                        <t-col :span="4">
                            {{ viewGoods.data.color }}
                            <t-popup placement="right">
                                <t-button
                                variant="text"
                                shape="square"
                                size="small"
                                >
                                    <template #icon>
                                        <t-icon name="more" />
                                    </template>
                                </t-button>
                                <template #content>
                                    <t-table
                                    size="small"
                                    style="width: 390px;"
                                    :max-height="300"
                                    :data="viewGoods.sku"
                                    :columns="[
                                        {
                                            title: localString.color[local.name],
                                            colKey: 'color',
                                            width: '150px',
                                            align: 'center'
                                        },
                                        {
                                            title: localString.color[local.name],
                                            colKey: 'colorid',
                                            width: '70px',
                                            align: 'center'
                                        },
                                        {
                                            title: localString.productnumber[local.name],
                                            colKey: 'productnumber',
                                            width: '150px',
                                            align: 'center'
                                        }
                                    ]"
                                    >
                                    </t-table>
                                </template>
                            </t-popup>
                        </t-col>
                        <t-col :span="1">
                            <span style="vertical-align: middle;">
                                {{ viewGoods.data.inventory }}
                            </span>
                            <t-popup placement="right">
                                <t-button
                                variant="text"
                                shape="square"
                                size="small"
                                >
                                    <template #icon>
                                        <t-icon name="more" />
                                    </template>
                                </t-button>
                                <template #content>
                                    <t-table
                                    size="small"
                                    style="width: 240px;"
                                    :max-height="300"
                                    :data="viewGoods.sku"
                                    :columns="[
                                        {
                                            title: localString.barcode[local.name],
                                            colKey: 'barcode',
                                            width: '150px',
                                            align: 'center'
                                        },
                                        {
                                            title: localString.inventory[local.name],
                                            colKey: 'inventory',
                                            width: '70px',
                                            align: 'center'
                                        }
                                    ]"
                                    >
                                    </t-table>
                                </template>
                            </t-popup>
                        </t-col>
                        <t-col :span="1" v-if="Math.min(...viewGoods.sku.map(obj => obj.cost * 1)) !== Math.max(...viewGoods.sku.map(obj => obj.cost * 1))">
                            {{ Math.min(...viewGoods.sku.map(obj => obj.cost * 1)) }}
                            {{ Math.max(...viewGoods.sku.map(obj => obj.cost * 1)) }}
                        </t-col>
                        <t-col :span="1" v-if="Math.min(...viewGoods.sku.map(obj => obj.cost * 1)) === Math.max(...viewGoods.sku.map(obj => obj.cost * 1))">
                            {{ viewGoods.sku[0].cost }}
                        </t-col>
                        <t-col :span="1" v-if="Math.min(...viewGoods.sku.map(obj => obj.price * 1)) !== Math.max(...viewGoods.sku.map(obj => obj.price * 1))">
                            {{ Math.min(...viewGoods.sku.map(obj => obj.price * 1)) }}
                            {{ Math.max(...viewGoods.sku.map(obj => obj.price * 1)) }}
                        </t-col>
                        <t-col :span="1" v-if="Math.min(...viewGoods.sku.map(obj => obj.price * 1)) === Math.max(...viewGoods.sku.map(obj => obj.price * 1))">
                            {{ viewGoods.sku[0].price }}
                        </t-col>
                        <t-col :span="1" class="description-title">{{ localString.mainImage[local.name] }}</t-col>
                        <t-col :span="4">
                            <t-swiper :height="300" style="width: 100%;">
                                <t-swiper-item v-for="item in viewGoods.data['main-image']" :key="item" style="padding: 10px 0;">
                                    <t-image
                                    :src="item"
                                    style="width: 300px; height: 300px;"
                                    ></t-image>
                                </t-swiper-item>
                            </t-swiper>
                        </t-col>
                    </t-row>
                </t-col>
                <t-col :span="3">
                    <t-card :title="localString.detailImage[local.name]">
                        <div style="max-height: 40vh; overflow-y: auto; ">
                            <t-image
                            v-for="item in viewGoods.data['detail-image']"
                            :key="item"
                            :src="item"
                            style="width: 100%;"
                            ></t-image>
                        </div>
                    </t-card>
                </t-col>
            </t-row>
        </div>
    </t-dialog>
    <t-drawer
    v-model:visible="goodsEdit.visible"
    attach="#goods-list"
    show-in-attached-element
    size="600px"
    :footer="false"
    destroy-on-close
    >
        <template #header>
            <t-icon name="edit" style="margin-right: 5px;" />
            {{ localString.edit[local.name] }}
        </template>
        <t-loading
        v-if="goodsEdit.loading"
        style="width: 100%; min-height: 70vh;"
        size="small"
        :text="localString.loading[local.name]"
        ></t-loading>
        <t-list
        v-if="!goodsEdit.loading"
        :split="true"
        size="small"
        >
            <t-list-item>
                {{ localString.store[local.name] }}
                <template #action>
                    {{ shop.storeOptions.filter(item => item.value === goodsEdit.sku[0]['store-id'])[0].label }}
                    {{ goodsEdit.sku[0]['store-id'] }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ localString.counter[local.name] }}
                <template #action>
                    {{ goodsEdit.sku[0]['shoppe-id'] }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ localString.brand[local.name] }}
                <template #action>
                    {{ goodsEdit.sku[0].brand }}
                </template>
            </t-list-item>
            <t-list-item>
                {{ localString.stylenumber[local.name] }}
                <template #action>
                    <t-input
                    v-model="goodsEdit.sku[0].stylenumber"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
                {{ localString.goodName[local.name] }}
                <template #action>
                    <t-textarea
                    v-model="goodsEdit.sku[0].name"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
                            obj.name = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    style="width: 320px;"
                    />
                </template>
            </t-list-item>
            <t-list-item>
                {{ localString.color[local.name] }}
                <template #action>
                    <div style="max-width: 320px; word-break:break-all; ">
                        {{ goodsEdit.sku.map(obj => obj.color).join(',') }}
                    </div>
                </template>
            </t-list-item>
            <t-list-item>
                {{ localString.size[local.name] }}
                <template #action>
                    <div style="max-width: 320px; word-break:break-all; ">
                        {{ goodsEdit.sku.map(obj => obj.size).join(',') }}
                    </div>
                </template>
            </t-list-item>
            <t-list-item>
                {{ localString['miaostreet-id'][local.name] }}
                <template #action>
                    <t-input
                    v-model="goodsEdit.sku[0]['miaostreet-id']"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
                {{ localString.category[local.name] }}
                <template #action>
                    <t-cascader
                    v-model="goodsEdit.sku[0]['category-id']"
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
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
                {{ localString.supplier[local.name] }}
                <template #action>
                    <t-auto-complete
                    v-model="goodsEdit.sku[0].supplier"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
                {{ localString.supplier[local.name] }}{{ localString.stylenumber[local.name] }}
                <template #action>
                    <t-input
                    v-model="goodsEdit.sku[0]['supplier-id']"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
                    v-model="goodsEdit.sku[0]['spu-id']"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
                {{ localString.cost[local.name] }}
                <template #action>
                    <t-checkbox
                    style="vertical-align: middle;"
                    v-if="Math.min(...goodsEdit.sku.map(obj => obj.cost)) !== Math.max(...goodsEdit.sku.map(obj => obj.cost))"
                    @change="(checked) => {
                        if(checked){
                            let cost = goodsEdit.sku[0].cost
                            goodsEdit.sku = 
                            goodsEdit.sku.map(obj => {
                                obj.cost = cost
                                return obj
                            })
                        }
                    }"
                    >{{ localString.unify[local.name] }}</t-checkbox>
                    <t-input-number
                    v-if="Math.min(...goodsEdit.sku.map(obj => obj.cost)) === Math.max(...goodsEdit.sku.map(obj => obj.cost))"
                    v-model="goodsEdit.sku[0].cost"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
                            obj.cost = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    style="margin: 0 10px;"
                    />
                    <span
                    v-if="Math.min(...goodsEdit.sku.map(obj => obj.cost)) !== Math.max(...goodsEdit.sku.map(obj => obj.cost))"
                    style="margin: 0 10px;"
                    >
                        {{ Math.min(...goodsEdit.sku.map(obj => obj.cost)) }}
                        ~
                        {{ Math.max(...goodsEdit.sku.map(obj => obj.cost)) }}
                    </span>
                    <t-popup placement="right" trigger="click">
                        <t-button
                        variant="outline"
                        size="small"
                        >
                            {{ localString.barcode[local.name] }}{{ localString.cost[local.name] }}
                        </t-button>
                        <template #content>
                            <t-list
                            :split="true"
                            size="small"
                            style="width: 400px; max-height: 60vh; overflow-y: auto;"
                            >
                                <t-list-item
                                >
                                    {{ localString.barcode[local.name] }}
                                    <template #action>
                                        {{ localString.cost[local.name] }}
                                    </template>
                                </t-list-item>
                                <t-list-item
                                v-for="item, index in goodsEdit.sku"
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
                {{ localString.price[local.name] }}
                <template #action>
                    <t-checkbox
                    style="vertical-align: middle;"
                    v-if="Math.min(...goodsEdit.sku.map(obj => obj.price)) !== Math.max(...goodsEdit.sku.map(obj => obj.price))"
                    @change="(checked) => {
                        if(checked){
                            let price = goodsEdit.sku[0].price
                            goodsEdit.sku = 
                            goodsEdit.sku.map(obj => {
                                obj.price = price
                                return obj
                            })
                        }
                    }"
                    >{{ localString.unify[local.name] }}</t-checkbox>
                    <t-input-number
                    v-if="Math.min(...goodsEdit.sku.map(obj => obj.price)) === Math.max(...goodsEdit.sku.map(obj => obj.price))"
                    v-model="goodsEdit.sku[0].price"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
                            obj.price = value
                            return obj
                        })
                    }"
                    size="small"
                    align="center"
                    style="margin: 0 10px;"
                    />
                    <span
                    v-if="Math.min(...goodsEdit.sku.map(obj => obj.price)) !== Math.max(...goodsEdit.sku.map(obj => obj.price))"
                    style="margin: 0 10px;"
                    >
                        {{ Math.min(...goodsEdit.sku.map(obj => obj.price)) }}
                        ~
                        {{ Math.max(...goodsEdit.sku.map(obj => obj.price)) }}
                    </span>
                    <t-popup placement="right" trigger="click">
                        <t-button
                        variant="outline"
                        size="small"
                        >
                            {{ localString.barcode[local.name] }}{{ localString.price[local.name] }}
                        </t-button>
                        <template #content>
                            <t-list
                            :split="true"
                            size="small"
                            style="width: 400px; max-height: 60vh; overflow-y: auto;"
                            >
                                <t-list-item
                                >
                                    {{ localString.barcode[local.name] }}
                                    <template #action>
                                        {{ localString.price[local.name] }}
                                    </template>
                                </t-list-item>
                                <t-list-item
                                v-for="item, index in goodsEdit.sku"
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
                {{ localString.firstListingTime[local.name] }}
                <template #action>
                    <t-date-picker
                    v-model="goodsEdit.sku[0]['first-listing-time']"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
                {{ localString.inputTime[local.name] }}
                <template #action>
                    <t-date-picker
                    v-model="goodsEdit.sku[0]['entry-time']"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
                {{ localString.editTime[local.name] }}
                <template #action>
                    <t-date-picker
                    v-model="goodsEdit.sku[0]['update-time']"
                    @change="(value) => {
                        goodsEdit.sku = 
                        goodsEdit.sku.map(obj => {
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
        v-if="!goodsEdit.loading"
        :confirm-loading="goodsEdit.submit"
        @confirm="goodsEdit.set"
        @close="goodsEdit.close"
        noreset
        style="margin-top: 10px; position: sticky; bottom: 0;"
        />
    </t-drawer>
</template>

<script>
import dayjs from 'dayjs'
import { getCategoryOptions, getSupplierOptions, getGoods, copy, miaostreetGoodsLink } from '../../hooks'
import localString from './local'
import confirmBar from '../../components/confirmBar.vue'

export default {
    components: {
        confirmBar
    },
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
        const frozenCondition = ref({})
        const categoryOptions = ref([])
        const supplierOptions = ref([])
        const getOptions = async () => {
            categoryOptions.value = await getCategoryOptions(serve)
            supplierOptions.value = await getSupplierOptions(serve)
            supplierOptions.value.splice(0, 1)
        }

        const costHighlight = ref('cost-col')
        const costHightLightChange = (value) => {
            columns.value[10].className = 'goods-table-col ' + value
            localStorage.setItem('cost-highlight', value)
        }

        const loading = ref(false)
        const data = ref([])
        const columns = ref([
            {
                colKey: 'row-select',
                type: 'multiple',
                width: 50
            },
            {
                title: localString.stylenumber[local.name],
                colKey: 'stylenumber',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.image[local.name],
                colKey: 'image',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.goodName[local.name],
                colKey: 'name',
                width: 260,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.category[local.name],
                colKey: 'category',
                width: 190,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString['miaostreet-id'][local.name],
                colKey: 'miaostreet-id',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.salesCount[local.name],
                colKey: 'sales-count',
                width: 90,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.supplier[local.name],
                colKey: 'supplier',
                width: 100,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.supplier[local.name] + ' ' + localString.stylenumber[local.name],
                colKey: 'supplier-id',
                width: 120,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.price[local.name],
                colKey: 'price',
                width: 90,
                align: 'center',
                className: 'goods-table-col'
            },
            {
                title: localString.cost[local.name],
                colKey: 'cost',
                width: 70,
                align: 'center',
                className: 'goods-table-col ' + costHighlight.value
            },
            {
                title: localString.operate[local.name],
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
        const confirmButton = ref(localString.exportQueryGoods[local.name])
        const exportLoading = ref(false)
        const exportToFiles = async () => {
            confirmButton.value = localString.exporting[local.name]
            exportLoading.value = true

            let res = await getSearchGoods(true)
            MessagePlugin.success(localString.exportSuccess[local.name])
            window.open(serve + '/download?filename=' + res)

            confirmButton.value = localString.exportQueryGoods[local.name]
            exportLoading.value = false
        }
        
        const selectKey = ref([])
        const batchEdit = ref({
            visible: false,
            data: {},
            loading: false,
            uploadData: async (stylenumbers, content) => {
                return fetch(serve + '/goods/batch-edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'store-id': shop.store,
                        brand: shop.brand,
                        stylenumbers,
                        content
                    })
                })
                .then(res => {
                    return Promise.resolve(res.json())
                })
                .catch(() => {
                    MessagePlugin.error(localString.httpFail[local.name])
                })
            },
            done: async () => {
                if(JSON.stringify(batchEdit.value.data) == "{}"){
                    batchEdit.value.visible = false
                    return
                }

                batchEdit.value.loading = true
                let stylenumber = selectKey.value
                let content = {}

                for (const key in batchEdit.value.data) {
                    if (batchEdit.value.data[key] !== null && batchEdit.value.data[key] !== '') {
                        content[key] = batchEdit.value.data[key]
                    }
                }

                let res = await batchEdit.value.uploadData(stylenumber, content)
                if(res.result){
                    MessagePlugin.success(localString.batchEdited(res.vol)[local.name])
                    getSearchGoods()
                } else {
                    MessagePlugin.info(localString.batchEdited(0)[local.name])
                }

                batchEdit.value.loading = false
                batchEdit.value.visible = false
                batchEdit.value.data = {}
            }
        })
        const supplierMap = ref({
            visible: false,
            data: {
                from: null,
                to: null,
                onlyStore: true
            },
            loading: false,
            uploadData: async (from, to, brand) => {
                let url = serve + '/goods/supplier/map?from=' + from + '&to=' + to + '&brand=' + brand
                if(supplierMap.value.data.onlyStore){
                    url += '&store=' + shop.store
                }

                return fetch(url)
                .then(res => {
                    return Promise.resolve(res.json())
                })
                .catch(() => {
                    MessagePlugin.error(localString.httpFail[local.name])
                })
            },
            done: async () => {
                if(supplierMap.value.data.to === null || supplierMap.value.data.to === ''){
                    MessagePlugin.error(localString.supplierMapToEmpty[local.name])
                    return
                }
                if(supplierMap.value.data.from === null || supplierMap.value.data.from === ''){
                    let confirm = DialogPlugin.confirm({
                        title: localString.tip[local.name],
                        content: localString.tip2[local.name],
                        okText: localString.confirm[local.name],
                        cancelText: localString.cancel[local.name],
                        onConfirm: async () => {
                            confirm.hide()

                            supplierMap.value.loading = true
                            let res1 = await supplierMap.value.uploadData(null, supplierMap.value.data.to, shop.brand)
                            let res2 = await supplierMap.value.uploadData('', supplierMap.value.data.to, shop.brand)
                            let count = 0

                            if(res1.result){
                                count += res1.vol
                            }
                            if(res2.result){
                                count += res2.vol
                            }

                            MessagePlugin.success(localString.batchEdited(count)[local.name])
                            supplierMap.value.close()
                            if(res1.result || res2.result){
                                getSearchGoods()
                            }

                            confirm.destroy()
                        },
                        onCancel: () => {
                            confirm.destroy()
                            supplierMap.value.close()
                        }
                    })
                } else {
                    supplierMap.value.loading = true
                    let res = await supplierMap.value.uploadData(supplierMap.value.data.from, supplierMap.value.data.to, shop.brand)
                    if(res.result){
                        getSearchGoods()
                        MessagePlugin.success(localString.batchEdited(res.vol)[local.name])
                    } else {
                        MessagePlugin.info(localString.batchEdited(0)[local.name])
                    }

                    supplierMap.value.close()
                }
            },
            close: () => {
                supplierMap.value.loading = false
                supplierMap.value.visible = false
                supplierMap.value.data = {
                    from: null,
                    to: null,
                    onlyStore: true
                }
            }
        })
        const viewGoods = ref({
            visible: false,
            data: {},
            sku: [],
            loading: false,
            getData:  async (stylenumber) => {
                return fetch(serve + '/goods/item/get?store-id=' + shop.store + '&brand=' + shop.brand + '&stylenumber=' + stylenumber, {
                    method: 'POST'
                })
                .then(res => {
                    return Promise.resolve(res.json())
                })
            },
            open: async (row) => {
                viewGoods.value.visible = true
                viewGoods.value.loading = true
                let res = await viewGoods.value.getData(row.stylenumber)
                viewGoods.value.sku = res

                let soData = JSON.parse(JSON.stringify(res[0]))
                viewGoods.value.data = soData
                if(soData['main-image'] !== null){
                    viewGoods.value.data['main-image'] = JSON.parse(soData['main-image'])
                } else {
                    viewGoods.value.data['main-image'] = []
                }
                if(soData['detail-image'] !== null){
                    viewGoods.value.data['detail-image'] = JSON.parse(soData['detail-image'])
                } else {
                    viewGoods.value.data['detail-image'] = []
                }
                viewGoods.value.data.color = row.color
                viewGoods.value.data.size = row.size
                viewGoods.value.data.inventory = row.inventory

                viewGoods.value.loading = false
            },
            close: () => {
                viewGoods.value.visible = false
                viewGoods.value.data = {}
                viewGoods.value.sku = []
            }
        })
        const goodsEdit = ref({
            visible: false,
            sku: [],
            loading: true,
            submit: false,
            getData:  async (stylenumber) => {
                return fetch(serve + '/goods/item/get?store-id=' + shop.store + '&brand=' + shop.brand + '&stylenumber=' + stylenumber, {
                    method: 'POST'
                })
                .then(res => {
                    return Promise.resolve(res.json())
                })
            },
            create: async () => {
                return fetch(serve + '/import/task/create?name=morifySku', {
                    method: 'POST',
                    body: JSON.stringify(goodsEdit.value.sku)
                })
                .then(res => {
                    return Promise.resolve(res.json())
                })
            },
            start: async (id) => {
                return fetch(serve + '/import/task/sku/start?id=' + id)
                .then(res => {
                    return Promise.resolve(res.json())
                })
            },
            open: async (row) => {
                goodsEdit.value.visible = true
                goodsEdit.value.loading = true
                goodsEdit.value.sku = []
                let res = await goodsEdit.value.getData(row.stylenumber)
                for (let i = 0; i < res.length; i++) {
                    res[i]['category-id'] = parseInt(res[i]['category-id'])
                }
                goodsEdit.value.sku = res
                goodsEdit.value.loading = false
            },
            set: async () => {
                goodsEdit.value.submit = true
                let id = await goodsEdit.value.create()
                let res = await goodsEdit.value.start(id)
                if(res.result){
                    MessagePlugin.success(localString.editSuccess[local.name])
                }
                goodsEdit.value.submit = false
                goodsEdit.value.visible = false
                getSearchGoods()
            },
            close: () => {
                goodsEdit.value.visible = false
            }
        })

        onMounted(() => {
            getOptions()
            getSearchGoods()

            if(typeof(localStorage.getItem('cost-highlight')) === 'string'){
                costHighlight.value = localStorage.getItem('cost-highlight')
                costHightLightChange(costHighlight.value)
            }
        })
        watch(() => shop.store, () => {
            getSearchGoods()
        })
        watch(() => shop.brand, () => {
            getSearchGoods()
        })

        return {
            dayjs,
            shop,

            local,
            localString,
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

            confirmButton,
            exportLoading,
            exportToFiles,

            batchEdit,
            selectKey,

            costHighlight,
            costHightLightChange,
            supplierMap,

            viewGoods,
            goodsEdit
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
.result-containter{
    margin: 10px 0;
}
.result-containter .t-table, .result-containter tr{
    background-color: transparent;
}
.result-containter .t-table__header tr{
    background-color: #fff;
    border-radius: 5px;
}
.result-containter .t-table th{
    color: #333;
    border: none;
}
.result-containter .t-table th:first-child{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}
.result-containter .t-table th:last-child{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
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