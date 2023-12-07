<template>
    <t-card :bordered="false">
        <template #title>
            <t-icon name="work-history"></t-icon>
            <span style="vertical-align: middle; margin-left: 8px;">
                {{ i18n.recent[i18n.language] }}
            </span>
        </template>
        <template #actions>
            <t-button variant="text" theme="primary" size="small" @click="clearHistory">
                <template #icon>
                    <t-icon name="clear"></t-icon>
                </template>
            </t-button>
        </template>
        <div style="text-align: center;" v-if="history.menus.length == 0 && history.goods.length == 0">
            {{ i18n.none[i18n.language] }}{{ i18n.recent[i18n.language] }}~
        </div>
        <t-tabs default-value="menus" v-if="history.menus.length != 0 || history.goods.length != 0">
            <t-tab-panel
            v-for="gruop, index in ['menus', 'goods']"
            :key="index"
            :value="gruop"
            :label="i18n[gruop][i18n.language]"
            :disabled="!history[gruop] || history[gruop].length == 0"
            >
                <t-space break-line size="10px" style="margin-top: 10px;" :key="history[gruop]" v-if="history[gruop] && history[gruop].length > 0">
                    <t-check-tag
                    v-for="item in history[gruop]"
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
                        <img v-if="gruop == 'menus'" :src="item.meta.avatar" height="20" style="margin-right: 5px;" >
                        <span v-if="gruop == 'menus'">
                            {{ i18n[item.meta.title][i18n.language] }} ( {{ item.path }} )
                        </span>
                        <img v-if="gruop == 'goods'" :src="item['main-image'] == null ? '' : JSON.parse(item['main-image'])[0]" height="20" style="margin-right: 5px;" >
                        <span v-if="gruop == 'goods'">
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
                {{ i18n.collection[i18n.language] }}
            </span>
        </template>
        <div style="text-align: center;" v-if="collectionPath.length == 0">
            {{ i18n.none[i18n.language] }}{{ i18n.collection[i18n.language] }}~
        </div>
        <t-space break-line size="10px" :key="collectionPath">
            <t-check-tag
            v-for="item in collectionPath"
            :key="item.name"
            @click="$router.push(item.path)"
            size="large"
            style="cursor: pointer;"
            variant="outline"
            >
                <img :src="item.meta.avatar" height="20" style="margin-right: 5px;" >
                {{ item.meta.title[i18n.language] }} ( {{ item.path }} )
            </t-check-tag>
        </t-space>
    </t-card>
</template>

<script>
import { miaostreetGoodsLink } from '../../hooks'

export default {
    setup(){
        const i18n = inject('i18n')
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

        return {
            i18n,
            shop,
            history,
            collectionPath,
            clearHistory,
            miaostreetGoodsLink
        }
    }
}
</script>

<style>

</style>