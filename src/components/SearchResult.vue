<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    width="420px"
    >
        <template #header>
            <t-icon name="search" style="margin-right: 5px;" />
            {{ i18n.search[i18n.language] }} {{ lastValue ? '(' + lastValue + ')' : '' }}
        </template>
        <t-loading
        v-if="loading"
        style="width: 100%; min-height: 36vh;"
        size="small"
        :text="i18n.loading[i18n.language]"
        ></t-loading>
        <t-list
        size="small"
        :split="true"
        v-if="!loading"
        style="max-height: 36vh;"
        >
            <t-list-item
            v-for="item in result"
            :key="item.value"
            style="cursor: pointer;"
            @click="selected(item.value)"
            >
                <t-image
                :src="item.avatar"
                style="background-color: transparent; width: 36px;"
                shape="round"
                ></t-image>
                <span>
                    {{ item.label }}
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
            lastValue.value = value
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

</style>