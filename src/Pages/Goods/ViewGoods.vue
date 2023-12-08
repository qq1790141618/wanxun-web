<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    width="70vw"
    attach="#goods-list"
    show-in-attached-element
    top="8vh"
    >
        <template #header>
            <t-icon name="browse" style="margin-right: 5px;" />
            {{ i18n.viewGoods[i18n.language] }}
        </template>
        <t-loading
        v-if="loading"
        style="width: 100%; min-height: 40vh;"
        size="small"
        :text="i18n.loading[i18n.language]"
        ></t-loading>
        <div style="max-height: 60vh; overflow-y: auto; ">
            <t-row :gutter="[12, 12]" style="width: 100%;" v-if="!loading">
                <t-col :span="9">
                    <t-row :gutter="[12, 4]" style="width: 100%;">
                        <t-col :span="2" class="description-title">{{ i18n.stylenumber[i18n.language] }}</t-col>
                        <t-col :span="5" class="description-title">{{ i18n.goodName[i18n.language] }}</t-col>
                        <t-col :span="2" class="description-title">{{ i18n.tagPrice[i18n.language] }}</t-col>
                        <t-col :span="3" class="description-title">{{ i18n.category[i18n.language] }}</t-col>
                        <t-col :span="2">{{ data.stylenumber }}</t-col>
                        <t-col :span="5">{{ data.name }}</t-col>
                        <t-col :span="2">{{ data.tagprice }}</t-col>
                        <t-col :span="3">{{ data.category }}</t-col>
                        <t-col :span="5" class="description-title">{{ i18n.size[i18n.language] }}</t-col>
                        <t-col :span="4" class="description-title">{{ i18n.color[i18n.language] }}</t-col>
                        <t-col :span="1" class="description-title">{{ i18n.inventory[i18n.language] }}</t-col>
                        <t-col :span="1" class="description-title">{{ i18n.cost[i18n.language] }}</t-col>
                        <t-col :span="1" class="description-title">{{ i18n.price[i18n.language] }}</t-col>
                        <t-col :span="5">{{ data.size }}</t-col>
                        <t-col :span="4">
                            {{ data.color }}
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
                                    :data="sku"
                                    :columns="[
                                        {
                                            title: i18n.color[i18n.language],
                                            colKey: 'color',
                                            width: '150px',
                                            align: 'center'
                                        },
                                        {
                                            title: i18n.color[i18n.language],
                                            colKey: 'colorid',
                                            width: '70px',
                                            align: 'center'
                                        },
                                        {
                                            title: i18n.productnumber[i18n.language],
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
                                {{ data.inventory }}
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
                                    :data="sku"
                                    :columns="[
                                        {
                                            title: i18n.barcode[i18n.language],
                                            colKey: 'barcode',
                                            width: '150px',
                                            align: 'center'
                                        },
                                        {
                                            title: i18n.inventory[i18n.language],
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
                        <t-col :span="1" v-if="Math.min(...sku.map(obj => obj.cost * 1)) !== Math.max(...sku.map(obj => obj.cost * 1))">
                            {{ Math.min(...sku.map(obj => obj.cost * 1)) }}
                            {{ Math.max(...sku.map(obj => obj.cost * 1)) }}
                        </t-col>
                        <t-col :span="1" v-if="Math.min(...sku.map(obj => obj.cost * 1)) === Math.max(...sku.map(obj => obj.cost * 1))">
                            {{ sku[0].cost }}
                        </t-col>
                        <t-col :span="1" v-if="Math.min(...sku.map(obj => obj.price * 1)) !== Math.max(...sku.map(obj => obj.price * 1))">
                            {{ Math.min(...sku.map(obj => obj.price * 1)) }}
                            {{ Math.max(...sku.map(obj => obj.price * 1)) }}
                        </t-col>
                        <t-col :span="1" v-if="Math.min(...sku.map(obj => obj.price * 1)) === Math.max(...sku.map(obj => obj.price * 1))">
                            {{ sku[0].price }}
                        </t-col>
                        <t-col :span="1" class="description-title">{{ i18n.mainImage[i18n.language] }}</t-col>
                        <t-col :span="4">
                            <t-swiper :height="300" style="width: 100%;">
                                <t-swiper-item v-for="item in data['main-image']" :key="item" style="padding: 10px 0;">
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
                    <t-card :title="i18n.detailImage[i18n.language]">
                        <div style="max-height: 40vh; overflow-y: auto; ">
                            <t-image
                            v-for="item in data['detail-image']"
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
</template>

<script>
export default {
    setup(){
        const i18n = inject('i18n')
        const serve = inject('serve')
        const shop = inject('shop')

        const visible = ref(false)
        const loading = ref(false)
        const data = ref({})
        const sku = ref([])
        const getData = async (stylenumber) => {
            return fetch(serve + '/goods/item/get?store-id=' + shop.store + '&brand=' + shop.brand + '&stylenumber=' + stylenumber, {
                method: 'POST'
            })
            .then(res => {
                return Promise.resolve(res.json())
            })
        }
        const open = async (row) => {
            visible.value = true
            loading.value = true
            let res = await getData(row.stylenumber)
            sku.value = res

            let soData = JSON.parse(JSON.stringify(res[0]))
            data.value = soData
            if(soData['main-image'] !== null){
                data.value['main-image'] = JSON.parse(soData['main-image'])
            } else {
                data.value['main-image'] = []
            }
            if(soData['detail-image'] !== null){
                data.value['detail-image'] = JSON.parse(soData['detail-image'])
            } else {
                data.value['detail-image'] = []
            }
            data.value.color = row.color
            data.value.size = row.size
            data.value.inventory = row.inventory

            loading.value = false
        }
        const close = () => {
            visible.value = false
            data.value = {}
            sku.value = []
        }

        return {
            i18n,
            shop,
            data,
            sku,
            visible,
            loading,
            open,
            close
        }
    }
}
</script>

<style>

</style>