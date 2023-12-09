<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    width="620px"
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
        <div
        style="max-height: 36vh; margin: 10px 0;"
        v-if="!loading"
        >
            <t-card
            size="small"
            v-for="c in ['menus', 'store', 'brand', 'goods']"
            :key="c"
            :title="i18n[c][i18n.language]"
            header-bordered
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
                            ></t-image>
                            <span style="margin: 12px; margin-right: 5px;">
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
        const result = ref({})
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
            let options = {}
            loading.value = true
            visible.value = true
            lastValue.value = value
            
            const routes = router.getRoutes()
            for (let i = 0; i < routes.length; i++) {
                if(routes[i].name == 'login'){
                    continue
                }
                if(!value || i18n[routes[i].meta.title][i18n.language].indexOf(value) >= 0 || routes[i].name.indexOf(value) >= 0){
                    if(!options.menus){
                        options.menus = []
                    }
                    options.menus.push({
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

            for (let i = 0; i < shop.brandOptions.length; i++) {
                if(!value || shop.brandOptions[i].label.indexOf(value) >= 0){
                    if(!options.brand){
                        options.brand = []
                    }
                    options.brand.push({
                        label: shop.brandOptions[i].label,
                        value: shop.brandOptions[i].value,
                        description: i18n.brand[i18n.language],
                        type: 'brand',
                        avatar: shop.brandOptions[i].logo
                    })
                }
            }
            result.value = options

            for (let i = 0; i < shop.storeOptions.length; i++) {
                if(!value || shop.storeOptions[i].label.indexOf(value) >= 0){
                    if(!options.store){
                        options.store = []
                    }
                    options.store.push({
                        label: shop.storeOptions[i].label,
                        value: shop.storeOptions[i].value,
                        description: i18n.store[i18n.language],
                        type: 'store',
                        avatar: 'https://cdn.fixeam.com/tw/colorful/factory.png'
                    })
                }
            }
            result.value = options

            let styleNumbers = await searchStyleNumber(value)
            styleNumbers = styleNumbers.length == 0 ? [] : styleNumbers.map(obj => obj.stylenumber)
            let brand = false
            if(options.brand && options.brand.length > 0){
                brand = options.brand[0].value
            }
            let goods = await getGoods(
                shop.store,
                brand,
                styleNumbers.length == 0 ? false : {
                    stylenumber: styleNumbers
                },
                0,
                20
            )
            for (let i = 0; i < goods.data.length; i++) {
                if(!options.goods){
                    options.goods = []
                }

                let goodsbrand = shop.brandOptions.find(obj => goods.data[i].brand.indexOf(obj.value) >= 0)
                if(!options.brand){
                    options.brand = []
                }
                if(options.brand.map(obj => obj.value).indexOf(goodsbrand.value) < 0){
                    options.brand.push({
                        label: goodsbrand.label,
                        value: goodsbrand.value,
                        description: i18n.brand[i18n.language],
                        type: 'brand',
                        avatar: goodsbrand.logo
                    })
                }

                options.goods.push({
                    label: goods.data[i].stylenumber,
                    value: goods.data[i].stylenumber,
                    description: goods.data[i]['store-id'],
                    otherTag: goodsbrand.value,
                    type: 'goods',
                    avatar: goods.data[i]['main-image'] == null ? 'https://cdn.fixeam.com/tw/colorful/shopping.png' : JSON.parse(goods.data[i]['main-image'])[0]
                })
            }

            result.value = options
            loading.value = false
        }
        const selected = (option) => {
            if(option.type == 'goods'){
                shop.brand = option.otherTag
                localStorage.setItem('brand', shop.brand)

                router.push({
                    path: '/goods',
                    query: {
                        stylenumber: option.label
                    }
                })
            }
            if(option.type == 'brand'){
                shop.brand = option.value
                localStorage.setItem('brand', shop.brand)
            }
            if(option.type == 'store'){
                shop.store = option.value
                localStorage.setItem('store', shop.store)
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