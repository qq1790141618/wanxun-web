<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    width="620px"
    placement="center"
    >
        <template #header>
            <span>
                <t-icon name="search" style="margin-right: 5px;" />
                <span style="vertical-align: middle; margin-right: 6px;">
                    {{ getString('search') }}
                </span>
                <t-tag size="small">
                    #
                    {{ lastValue ? lastValue : '' }}
                </t-tag>
            </span>
        </template>
        <t-loading
        v-if="loading"
        style="width: 100%; min-height: 50vh;"
        size="small"
        :text="getString('loading')"
        ></t-loading>
        <div
        style="max-height: 50vh; margin: 10px 0;"
        v-if="!loading"
        >
            <t-card
            size="small"
            v-for="c in ['menus', 'store', 'brand', 'goods']"
            :key="c"
            :title="getString(c)"
            :header-bordered="true"
            :style="{
                margin: '5px'
            }"
            v-show="result[c]"
            >
                <t-list
                size="small"
                >
                    <t-list-item
                    v-for="item in result[c]"
                    :key="item.value"
                    @click="selected(item)"
                    class="search-item"
                    >
                        <span style="width: 330px;">
                            <t-image
                            :src="item.avatar"
                            style="background-color: transparent; width: 36px; height: 36px; display: inline-block;"
                            shape="round"
                            fit="contain"
                            >
                                <template #error>
                                    <t-image
                                    v-if="c === 'goods'"
                                    src="https://cdn.fixeam.com/tw/colorful/shopping.png"
                                    style="background-color: transparent; width: 36px; height: 36px; display: inline-block;"
                                    shape="round"
                                    fit="contain"
                                    />
                                </template>
                            </t-image>
                            <span style="margin: 12px 5px 12px 12px;">
                                {{ item.label }}
                            </span>
                            <t-tag
                            size="small"
                            >
                                {{ item.description }}
                            </t-tag>
                            <t-tag
                            size="small"
                            v-if="item.otherTag"
                            style="margin-left: 5px;"
                            >
                                {{ item.otherTag }}
                            </t-tag>
                        </span>
                    </t-list-item>
                </t-list>
            </t-card>
        </div>
    </t-dialog>
</template>

<script setup>
import service from "../api/service.js"
import {useRouter} from "vue-router"
import {tips} from "../hooks/tips.js"
import {getString} from "../i18n/index.js";

const visible = ref(false)
const shop = inject('shop')
const router = useRouter()

const loading = ref(false)
const result = ref({})
const lastValue = ref('')

const searchStyleNumber = async (value) => {
    if(!value){
        return []
    }
    let response = await service.api.goods.getGoodsByStyOrCID(value)
    if(!response.result){
        tips(response.error.message, 'error')
        return []
    }
    return response.content.data
}

const search = async (value) => {
    if(value == null){
        value = false
    }

    let options = {}
    loading.value = true
    visible.value = true
    lastValue.value = value

    // 搜索路由
    const routes = router.getRoutes()
    for (let i = 0; i < routes.length; i++) {
        if(routes[i].name === 'login'){
            continue
        }

        const name = getString(routes[i].meta['title']) ?? ''
        if(!value || name.indexOf(value) >= 0 || routes[i].name.indexOf(value) >= 0){
            if(!options.menus){
                options.menus = []
            }
            options.menus.push({
                label: name,
                value: name,
                description: getString('menus'),
                route: routes[i],
                type: 'menus',
                avatar: routes[i].meta['avatar']
            })
        }
    }
    result.value = options

    // 搜索品牌
    for (let i = 0; i < shop.brandOptions.length; i++) {
        if(!value || shop.brandOptions[i].label.indexOf(value) >= 0){
            if(!options.brand){
                options.brand = []
            }
            options.brand.push({
                label: shop.brandOptions[i].label,
                value: shop.brandOptions[i].value,
                description: getString('brand'),
                type: 'brand',
                avatar: shop.brandOptions[i].logo
            })
        }
    }
    result.value = options

    // 搜索店铺
    for (let i = 0; i < shop.storeOptions.length; i++) {
        if(!value || shop.storeOptions[i].label.indexOf(value) >= 0){
            if(!options.store){
                options.store = []
            }
            options.store.push({
                label: shop.storeOptions[i].label,
                value: shop.storeOptions[i].value,
                description: getString('store'),
                type: 'store',
                avatar: 'https://cdn.fixeam.com/tw/colorful/factory.png'
            })
        }
    }
    result.value = options

    // 搜索商品
    let goods = await searchStyleNumber(value)
    for (let i = 0; i < goods.length; i++) {
        if(!options.goods){
            options.goods = []
        }

        // 添加商品的品牌到列表
        let brandOfGoods = shop.brandOptions.find(obj => goods[i].brand.indexOf(obj.value) >= 0)
        if(!options.brand){
            options.brand = []
        }
        if(options.brand.map(obj => obj.value).indexOf(brandOfGoods.value) < 0){
            options.brand.push({
                label: brandOfGoods.label,
                value: brandOfGoods.value,
                description: getString('brand'),
                type: 'brand',
                avatar: brandOfGoods.logo
            })
        }

        // 添加商品到列表
        options.goods.push({
            label: goods[i].stylenumber,
            value: goods[i].stylenumber,
            description: goods[i]['store-id'],
            otherTag: brandOfGoods.value,
            type: 'goods',
            avatar: goods[i]['main-image'] == null ? 'https://cdn.fixeam.com/tw/colorful/shopping.png' : JSON.parse(goods[i]['main-image'])[0]
        })
    }

    result.value = options
    loading.value = false
}

const selected = (option) => {
    if(option.type === 'goods'){
        shop.brand = option.otherTag
        localStorage.setItem('brand', shop.brand)

        router.push({
            path: '/goods',
            query: {
                stylenumber: option.label
            }
        })
    }
    if(option.type === 'brand'){
        shop.brand = option.value
        localStorage.setItem('brand', shop.brand)
    }
    if(option.type === 'store'){
        shop.store = option.value
        localStorage.setItem('store', shop.store)
    }
    if(option.type === 'menus'){
        router.push(option.route.path)
    }
    visible.value = false
}

defineExpose({
    search
})
</script>

<style>
.search-item{
    cursor: pointer;
    background-color: #fcfcfc;
    margin-bottom: 6px;
    margin-right: 6px;
    border-radius: 5px;
    width: calc(50% - 8px);
    display: inline-block;
}
.search-item:hover {
    background-color: #f2f3ff;
}
</style>