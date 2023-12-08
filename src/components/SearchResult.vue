<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    width="600px"
    :show-overlay="false"
    >
        <template #header>
            <span>
                <t-icon name="search" style="margin-right: 5px;" />
                <span style="vertical-align: middle; margin-right: 6px;">
                    {{ i18n.search[i18n.language] }}
                </span>
                <t-tag size="small">
                    #
                    {{ lastValue ? lastValue : '' }}
                </t-tag>
            </span>
        </template>
        <t-loading
        v-if="loading"
        style="width: 100%; min-height: 36vh;"
        size="small"
        :text="i18n.loading[i18n.language]"
        ></t-loading>
        <t-list
        size="small"
        v-if="!loading"
        style="max-height: 36vh;"
        >
            <t-list-item
            v-for="item in result"
            :key="item.value"
            @click="selected(item.value)"
            class="search-item"
            >
                <span style="width: 330px;">
                    <t-image
                    :src="item.avatar"
                    style="background-color: transparent; width: 36px; display: inline-block;"
                    shape="round"
                    ></t-image>
                    <span style="margin: 12px; margin-right: 5px;">
                        {{ item.label }}
                    </span>
                    <t-tag
                    size="small"
                    >
                        {{ item.description }}
                    </t-tag>
                </span>
            </t-list-item>
        </t-list>
    </t-dialog>
</template>

<script>
import { getGoods } from '../hooks'

export default {
    setup(){
        const visible = ref(false)
        const i18n = inject('i18n')
        const shop = inject('shop')
        const serve = inject('serve')
        const router = useRouter()

        const loading = ref(false)
        const result = ref([])
        const lastValue = ref('')

        const searchStyleNumber = async (value) => {
            if(!value){
                return []
            }
            let params = '?keyword=' + value
            return fetch(serve + '/goods/sty' + params)
            .then(response => {
                return Promise.resolve(response.json())
            })
        }
        const search = async (value) => {
            if(value == null || value == undefined){
                value = false
            }
            let options = []
            loading.value = true
            visible.value = true
            lastValue.value = value
            
            const routes = router.getRoutes()
            for (let i = 0; i < routes.length; i++) {
                if(routes[i].name == 'login'){
                    continue
                }
                if(!value || value.indexOf(i18n[routes[i].meta.title][i18n.language]) >= 0 || value.indexOf(routes[i].name) >= 0){
                    options.push({
                        label: i18n[routes[i].meta.title][i18n.language],
                        value: i18n[routes[i].meta.title][i18n.language],
                        description: i18n.menus[i18n.language],
                        route: routes[i],
                        type: 'menus',
                        avatar: routes[i].meta.avatar
                    })
                }
            }
            result.value = options

            let styleNumbers = await searchStyleNumber(value)
            styleNumbers = styleNumbers.length == 0 ? [] : styleNumbers.map(obj => obj.stylenumber)
            let goods = await getGoods(
                shop.store,
                shop.brand,
                styleNumbers.length == 0 ? false : {
                    stylenumber: styleNumbers
                },
                0,
                20
            )
            for (let i = 0; i < goods.data.length; i++) {
                options.push({
                    label: goods.data[i].stylenumber,
                    value: goods.data[i].stylenumber,
                    description: i18n.goods[i18n.language],
                    type: 'goods',
                    avatar: goods.data[i]['main-image'] == null ? 'https://cdn.fixeam.com/tw/colorful/shopping.png' : JSON.parse(goods.data[i]['main-image'])[0]
                })
            }

            result.value = options
            loading.value = false
        }
        const selected = (value) => {
            let option = result.value.find(obj => obj.label == value)
            if(option.type == 'goods'){
                router.push({
                    path: '/goods',
                    query: {
                        stylenumber: option.label
                    }
                })
            }
            if(option.type == 'menus'){
                router.push(option.route.path)
            }
            visible.value = false
        }

        return {
            i18n,
            visible,
            search,
            lastValue,
            result,
            selected,
            loading
        }
    }
}
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