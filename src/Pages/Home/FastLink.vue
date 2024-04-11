<template>
    <t-card :bordered="false">
        <template #title>
            <t-icon name="work-history"></t-icon>
            <span style="vertical-align: middle; margin-left: 8px;">
                {{ getString('recent') }}
            </span>
        </template>
        <template #actions>
            <t-button variant="text" theme="primary" size="small" @click="clearHistory">
                <template #icon>
                    <t-icon name="clear"></t-icon>
                </template>
            </t-button>
        </template>
        <div style="text-align: center;" v-if="history.menus.length === 0 && history.goods.length === 0">
            {{ getString('none') }}{{ getString('recent') }}~
        </div>
        <t-tabs default-value="menus" v-if="history.menus.length !== 0 || history.goods.length !== 0">
            <t-tab-panel
            v-for="(group, index) in ['menus', 'goods']"
            :key="index"
            :value="group"
            :label="getString(group)"
            :disabled="!history[group] || history[group].length === 0"
            >
                <t-space :break-line="true" size="10px" style="margin-top: 10px; max-height: 120px; overflow-y: auto;" :key="history[group]" v-if="history[group] && history[group].length > 0">
                    <t-check-tag
                    v-for="item in history[group]"
                    :key="item.name"
                    @click="() => {
                        if(item.path){
                            $router.push(item.path)
                        } else {
                            miaostreetGoodsLink(item)
                        }
                    }"
                    size="large"
                    style="cursor: pointer;"
                    variant="outline"
                    >
                        <img v-if="group === 'menus'" :src="item.meta.avatar" height="20" style="margin-right: 5px;"  alt="">
                        <span v-if="group === 'menus'">
                            {{ getString(item.meta.title) }} ( {{ item.path }} )
                        </span>
                        <img v-if="group === 'goods'" :src="item['main-image'] == null ? '' : JSON.parse(item['main-image'])[0]" height="20" style="margin-right: 5px;"  alt="">
                        <span v-if="group === 'goods'">
                            {{ item.brand + ': ' + item.stylenumber }}
                        </span>
                    </t-check-tag>
                </t-space>
            </t-tab-panel>
        </t-tabs>
    </t-card>
    <t-card :bordered="false" style="margin-top: 12px;">
        <template #title>
            <t-icon name="star"></t-icon>
            <span style="vertical-align: middle; margin-left: 8px;">
                {{ getString('collection') }}
            </span>
        </template>
        <div style="text-align: center;" v-if="collectionPath.length === 0">
            {{ getString('none') }}{{ getString('collection') }}~
        </div>
        <t-space :break-line="true" size="10px" :key="collectionPath" style="margin-top: 10px; max-height: 120px; overflow-y: auto;">
            <t-check-tag
            v-for="item in collectionPath"
            :key="item.name"
            @click="$router.push(item.path)"
            size="large"
            style="cursor: pointer;"
            variant="outline"
            >
                <img :src="item.meta.avatar" height="20" style="margin-right: 5px;"  alt="">
                {{ getString(item.meta.title) }} ( {{ item.path }} )
            </t-check-tag>
        </t-space>
    </t-card>
</template>

<script setup>
import { miaostreetGoodsLink } from '../../hooks'
import { getString } from "../../i18n/index.js";

const shop = inject('shop')

const historyStructure = {
    menus: [],
    goods: []
}
const history = ref({})
history.value = historyStructure
const collectionPath = ref([])
const clearHistory = () => {
    for (const key in history.value) {
        history.value[key] = []
    }
    localStorage.removeItem('history')
}

onMounted(() => {
    setInterval(() => {
        history.value = JSON.parse(localStorage.getItem('history')) || historyStructure
        collectionPath.value = JSON.parse(localStorage.getItem('collection')) || []
    }, 500)
})
</script>

<style>

</style>