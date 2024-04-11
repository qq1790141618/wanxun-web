<template>
    <t-card class="user-group-card" :bordered="false">
        <t-space style="margin-bottom: 12px;">
            <t-button
            @click="getShopOption()"
            variant="outline"
            >
                <template #icon>
                    <t-icon name="refresh" />
                </template>
                {{ getString('refresh') }}
            </t-button>
        </t-space>
        <t-loading class="multiple-table" :text="getString('loading')" :loading="loading" size="small" :indicator="false">
            <StoreView @reload="getShopOption" />
            <BrandView @reload="getShopOption" />
        </t-loading>
    </t-card>
</template>

<script setup>
import {tips} from "../../../hooks/tips.js"
import {getString} from "../../../i18n/index.js"
import StoreView from "./StoreView.vue"
import BrandView from "./BrandView.vue"
import {getAllBrand, getAllStore} from "../../../api/shop.js";

const shop = inject('shop')
const user = inject('user')
const loading = ref(false)
const getShopOption = async () => {
    loading.value = true

    let storeResponse = await getAllStore()
    if(!storeResponse.result){
        tips('门店信息获取失败：' + storeResponse.error.message, 'error')
    } else {
        for (let i = 0; i < storeResponse.content.length;i++){
            storeResponse.content[i].value = storeResponse.content[i].id
            storeResponse.content[i].label = storeResponse.content[i].name
        }
        shop.storeOptions = storeResponse.content
    }

    let brandResponse = await getAllBrand()
    if(!brandResponse.result){
        tips('品牌信息获取失败：' + brandResponse.error.message, 'error')
    } else {
        for (let i = 0; i < brandResponse.content.length;i++){
            brandResponse.content[i].value = brandResponse.content[i].keyword
            brandResponse.content[i].label = brandResponse.content[i].name + ' ' + brandResponse.content[i].id
        }
        shop.brandOptions = brandResponse.content
    }

    loading.value = false
}
</script>

<style scoped>
.user-group-card {
    max-width: calc(100vw - 30px);
    margin: 15px auto;
}
.multiple-table {
    padding: 12px;
    display: flex;
    gap: 28px;
}
.multiple-table > div {
    flex: 1;
}
</style>