<template>
    <t-card :bordered="false" style="margin-top: 12px;">
        <template #title>
            <t-icon name="shop"></t-icon>
            <span style="vertical-align: middle; margin-left: 8px;">
                {{ getString('recommend') }}
            </span>
        </template>
        <t-tabs :default-value="shop.brand">
            <t-tab-panel
            v-for="(item, index) in shop.brandOptions"
            :key="index"
            :value="item.value"
            :label="item.label"
            >
                <div class="home-goods-list">
                    <StyleRecommedItem
                    v-for="item in data[item.value]"
                    :key="item.stylenumber"
                    :item="item"
                    />
                </div>
            </t-tab-panel>
        </t-tabs>
    </t-card>
</template>

<script>
import StyleRecommedItem from './StyleRecommedItem.vue'
import {getString} from "../../i18n/index.js";

export default {
    methods: {getString},
    components: {
        StyleRecommedItem
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup(){
        const i18n = inject('i18n')
        const shop = inject('shop')

        return {
            i18n,
            shop
        }
    }
}
</script>

<style>
.home-goods-list{
    padding: 10px 3px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 10px;
    max-height: 500px;
    overflow-y: auto;
}
</style>