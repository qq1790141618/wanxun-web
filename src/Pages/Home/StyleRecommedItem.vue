<template>
    <t-card
        class="next-good-item"
        v-if="item"
        :bordered="false"
        :shadow="true"
    >
        <t-image
            class="next-good-item-image"
            :src="item.image"
            :lazy="true"
        >
            <template #error>
                <img src="../../assets/loadfail.png" style="height: 70%; margin-bottom: 12%;" alt="">
            </template>
        </t-image>
        <div class="next-good-item-info">
            <div class="prev-good-item-info-name" style="font-size: 14px; line-height: 15px;">
<!--                <t-tag-->
<!--                size="small"-->
<!--                theme="primary"-->
<!--                variant="light"-->
<!--                >-->
<!--                    {{ shop.storeOptions.filter(obj => obj.value === item['store-id'])[0].label }}-->
<!--                </t-tag>-->
                <t-tooltip :content="item.name">
                    {{ item.name }}
                </t-tooltip>
            </div>
            <div style="margin: 10px 0;">
                <span class="number-show">
                    {{ item.salesCount }}
                </span>
                {{ getString('piece') }}
                /
                <span class="number-show">
                    {{ item.salesAmount }}
                </span>
                {{ getString('yuan') }}
            </div>
            <t-button
                v-if="item.id != null"
                size="small"
                shape="round"
                @click.stop="miaostreetGoodsLink(item)"
            >
                <template #icon>
                    <t-icon name="browse"></t-icon>
                </template>
                {{ getString('viewGoods') }}
            </t-button>
        </div>
    </t-card>
</template>

<script>
import { miaostreetGoodsLink } from '../../hooks'
import {getString} from "../../i18n/index.js";

export default {
    methods: {getString},
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    setup(){
        const i18n = inject('i18n')
        const shop = inject('shop')

        return {
            i18n,
            shop,
            miaostreetGoodsLink
        }
    }
}
</script>

<style>
.next-good-item{
    flex-shrink: 0;
    flex-grow: 1;
    width: 100%;
    overflow: hidden;
}
.next-good-item .t-card__body{
    display: flex;
    padding: 0;
}
.next-good-item-image{
    width: 130px;
    height: 130px;
    flex-shrink: 0;
}
.next-good-item-info{
    padding: 12px 16px;
    box-sizing: border-box;
}
.number-show{
    font-size: 20px;
    font-family: 'DIN', serif;
    color: #f6685d;
}
.prev-good-item-info-name{
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 3px 0;
}
</style>