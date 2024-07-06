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
        <t-loading
            class="multiple-table"
            :text="getString('loading')"
            :loading="loading"
            size="small"
            :indicator="false"
        >
            <t-row :gutter="20">
                <t-col :span="6">
                    <StoreView @reload="getShopOption" />
                </t-col>
                <t-col :span="6">
                    <BrandView @reload="getShopOption" />
                </t-col>
            </t-row>
        </t-loading>
    </t-card>
</template>

<script setup>
import {tips} from "../../../hooks/tips.js"
import {getString} from "../../../i18n/index.js"
import StoreView from "./StoreView.vue"
import BrandView from "./BrandView.vue"
import {request} from "../../../api/request.js"

const shop = inject('shop')
const user = inject('user')
const loading = ref(false)
const getShopOption = async () => {
    loading.value = true

    let storeResponse = await request('/shop/store')
    if(storeResponse.status !== 'success'){
        tips(storeResponse.error.msg, 'error')
    } else {
        shop.storeOptions = storeResponse.content
    }
    let brandResponse = await request('/shop/brand')
    if(brandResponse.status !== 'success'){
        tips(brandResponse.error.msg, 'error')
    } else {
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
</style>