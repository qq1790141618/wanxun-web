<template>
    <header class="header">
        <div class="logo" title="LOGO">
            <img src="../assets/logo.png" class="logo-image" >
            <span class="logo-text">
                {{ i18n.websiteName[lang] }}
            </span>
        </div>
        <t-head-menu v-model="activeMenu" expand-type="popup" v-if="$route.name !== 'login'" style="background-color: transparent;">
            <template
            v-for="item in routes"
            :key="item.name"
            >
                <t-menu-item
                v-if="(!item.children || item.children.length == 0) && item.meta.menuShow"
                :value="item.meta.key"
                @click="$router.push(item.path)"
                >
                    <template #icon>
                        <t-icon :name="item.meta.icon" />
                    </template>
                    {{ i18n[item.meta.title][lang] }}
                    <t-button
                    size="small"
                    variant="text"
                    shape="round"
                    @click.stop="collection(item, true)"
                    v-if="!collectionPath.map(obj => obj.meta.key).includes(item.meta.key) && item.path !== '/'"
                    class="cl-button"
                    >
                        <template #icon>
                            <t-icon name="star" />
                        </template>
                    </t-button>
                    <t-button
                    size="small"
                    variant="text"
                    shape="round"
                    @click.stop="collection(item, false)"
                    v-if="collectionPath.map(obj => obj.meta.key).includes(item.meta.key)"
                    class="cl-button"
                    >
                        <template #icon>
                            <t-icon name="star-filled" />
                        </template>
                    </t-button>
                </t-menu-item>
                <t-submenu
                v-if="item.children && item.children.length > 0 && item.meta.menuShow"
                :value="item.meta.key"
                >
                    <template #icon>
                        <t-icon :name="item.meta.icon" />
                    </template>
                    <template #title>
                        <span>{{ i18n[item.meta.title][lang] }}</span>
                    </template>
                    <template
                    v-for="subitem in item.children"
                    :key="subitem.name"
                    >
                        <t-menu-item
                        :value="subitem.meta.key"
                        @click="$router.push(subitem.path)"
                        v-if="!subitem.meta.hide"
                        >
                            <template #icon>
                                <t-icon :name="subitem.meta.icon" />
                            </template>
                            {{ i18n[subitem.meta.title][lang] }}
                            <t-button
                            size="small"
                            variant="text"
                            shape="round"
                            @click.stop="collection(subitem, true)"
                            v-if="!collectionPath.map(obj => obj.meta.key).includes(subitem.meta.key)"
                            class="cl-button"
                            >
                                <template #icon>
                                    <t-icon name="star" />
                                </template>
                            </t-button>
                            <t-button
                            size="small"
                            variant="text"
                            shape="round"
                            @click.stop="collection(subitem, false)"
                            v-if="collectionPath.map(obj => obj.meta.key).includes(subitem.meta.key)"
                            class="cl-button"
                            >
                                <template #icon>
                                    <t-icon name="star-filled" />
                                </template>
                            </t-button>
                        </t-menu-item>
                    </template>
                </t-submenu>
            </template>
        </t-head-menu>
        <div class="operations-container">
            <t-auto-complete
            v-if="$route.name !== 'login'"
            class="search-box"
            ref="searchBox"
            v-model="searchValue"
            :placeholder="i18n.search[lang]"
            :style="{ width: searchWidth + 'px', marginRight: '20px', transition: 'all .3s' }"
            @focus="searchWidth = 300"
            @blur="searchWidth = 200"
            :options="searchOptions"
            :popup-props="{ overlayClassName: 't-autocomplete-option-list' }"
            @change="search"
            clearable
            @select="selected"
            @enter="() => {
                if(searchOptions.length > 0){
                    selected(searchOptions[0].label)
                }
            }"
            >
                <template #prefixIcon>
                    <t-icon name="search" :style="{ cursor: 'pointer' }" />
                </template>
                <template #suffixIcon>
                    <t-icon name="command" />
                    <t-icon name="plus" />
                    <t-icon name="letters-k" />
                </template>
                <template #option="{ option }">
                    <div class="custom-option">
                        <img :src="option.avatar" />
                        <div class="custom-option__main">
                            <t-highlight-option :content="option.text" />
                            <small class="description">{{ i18n.type[lang] + ': ' + option.description }}</small>
                        </div>
                    </div>
                </template>
            </t-auto-complete>
            <t-space size="5px">
                <t-tooltip :content="i18n.backToOldVersion[lang]">
                    <t-button variant="text" shape="square" @click="backToOldVersion">
                        <template #icon>
                            <t-icon name="history-setting" />
                        </template>
                    </t-button>
                </t-tooltip>
                <t-dropdown
                :options="i18n.options"
                @click="changeLanguage"
                placement="bottom"
                >
                    <t-button variant="text" shape="square">
                        <template #icon>
                            <t-icon name="translate" />
                        </template>
                    </t-button>
                </t-dropdown>
                <t-dropdown
                placement="bottom"
                :min-column-width="180"
                >
                    <t-button variant="text" shape="square">
                        <template #icon>
                            <t-icon name="download" />
                        </template>
                    </t-button>
                    <t-dropdown-menu>
                        <t-dropdown-item @click="downloadClient">
                            <t-icon name="desktop" style="margin-right: 5px;" />
                            {{ i18n.windows[lang] }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="downloadAndroidApp = true">
                            <t-icon name="logo-android" style="margin-right: 5px;" />
                            {{ i18n.android[lang] }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="mobileWeb = true">
                            <t-icon name="mobile" style="margin-right: 5px;" />
                            {{ i18n.mobile[lang] }}
                        </t-dropdown-item>
                    </t-dropdown-menu>
                </t-dropdown>
                <t-tooltip :content="i18n.setting[lang]" v-if="$route.name !== 'login'">
                    <t-badge :count="COUNT">
                        <t-button variant="text" shape="square" @click="clickSet">
                            <template #icon>
                                <t-icon name="setting" />
                            </template>
                        </t-button>
                    </t-badge>
                </t-tooltip>
                <t-dropdown
                placement="bottom"
                :min-column-width="130"
                v-if="user.status == 'loged'"
                >
                    <t-button variant="text">
                        <template #icon>
                            <t-image :src="user.inform.headsrc" shape="circle" style="width: 28px;">
                                <template #loading>
                                    ...
                                </template>
                            </t-image>
                        </template>
                        &nbsp;
                        {{ user.inform.nickname }}
                    </t-button>
                    <t-dropdown-menu>
                        <t-dropdown-item @click="user.avatarView = true">
                            <t-icon name="browse" style="margin-right: 5px;" />
                            {{ i18n.viewAvatar[lang] }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="$router.push('/user-center')">
                            <t-icon name="verify" style="margin-right: 5px;" />
                            {{ i18n.userCenter[lang] }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="user.logout">
                            <t-icon name="logout" style="margin-right: 5px;" />
                            {{ i18n.logout[lang] }}
                        </t-dropdown-item>
                    </t-dropdown-menu>
                </t-dropdown>
                <t-image-viewer
                v-if="user.status == 'loged'"
                :images="[ user.inform.headsrc ]"
                v-model:visible="user.avatarView"
                >
                </t-image-viewer>
            </t-space>
        </div>
    </header>
    <t-dialog
    v-model:visible="downloadAndroidApp"
    :header="i18n.android[lang]"
    :footer="false"
    >
        <div style="text-align: center;">
            <t-icon name="scan" />
            {{ i18n.scanToDownload[lang] }}
            <img src="../assets/Android.png" style="width: 200px;" >
            <div>
                <t-button @click="downloadApk">
                    <template #icon>
                        <t-icon name="logo-android" />
                    </template>
                    {{ i18n.downloadApk[lang] }}
                </t-button>
            </div>
        </div>
    </t-dialog>
    <t-dialog
    v-model:visible="mobileWeb"
    :header="i18n.mobile[lang]"
    :footer="false"
    >
        <div style="text-align: center;">
            <t-icon name="scan" />
            {{ i18n.scanToVisit[lang] }}
            <img src="../assets/Mobile Web.png" style="width: 200px;" >
            <t-link href="https://mobile-work.fixeam.com/" target="_blank" style="margin-right: 5px;">
                Url:
                https://mobile-work.fixeam.com/
            </t-link>
            <t-button @click.stop="copy('https://mobile-work.fixeam.com/', lang)" variant="text" shape="square">
                <template #icon>
                    <t-icon name="copy" />
                </template>
            </t-button>
        </div>
    </t-dialog>
    <t-dialog
    v-model:visible="settings"
    :header="i18n.setting[lang]"
    :footer="false"
    :close-on-overlay-click="false"
    >
        <t-space direction="vertical" style="width: 100%;">
            <t-select
            :label="i18n.store[lang] + ': '"
            v-model="shop.store"
            :options="shop.storeOptions"
            @change="saveOptions"
            ></t-select>
            <t-select
            :label="i18n.brand[lang] + ': '"
            v-model="shop.brand"
            :options="shop.brandOptions"
            @change="saveOptions"
            ></t-select>
            <t-link theme="primary" @click="viewCounter" v-if="shop.counter[shop.store + shop.brand]">
                {{ i18n.viewCounter[lang] }}>>
            </t-link>
        </t-space>
    </t-dialog>
</template>

<script>
import { copy, getGoods, translate } from '../hooks'

export default {
    setup(){
        const i18n = inject('i18n')
        const lang = ref('zh')
        lang.value = i18n.language
        const changeLanguage = (item) => {
            if(i18n.language == item.value){
                return
            }

            i18n.language = item.value
            lang.value = item.value
            localStorage.setItem('lang', item.value)

            translate('已为您切换界面语言, 刷新页面以获得最佳浏览体验！', lang.value)
            .then(res => {
                MessagePlugin.success(res.trans_result[0].dst)
            })
        }
        watch(() => i18n.language, () => {
            lang.value = i18n.language
        })

        const downloadClient = () => {
            window.open('https://cdn.fixeam.com/tw/application/windows/2023110715/version_1.0.4_release_miaostreet_sales_analysis_wanxun.exe')
        }
        const downloadAndroidApp = ref(false)
        const downloadApk = () => {
            window.open('https://cdn.fixeam.com/tw/application/android/2023102016/wanxun_tools_version110_release_arm64_v7a.apk')
        }
        const mobileWeb = ref(false)

        const shop = inject('shop')
        const serve = inject('serve')
        const settings = ref(false)
        const route = useRoute()
        const router = useRouter()
        let routes = router.getRoutes()

        const activeMenu = ref('1')
        watch(() => route.path, () => {
            activeMenu.value = route.meta.key
        })

        const searchBox = ref(null)
        const searchValue = ref(null)
        const searchWidth = ref(200)
        const searchOptions = ref([])
        const searchY = ref({
            value: '',
            loading: true
        })
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

            if(searchY.value.loading){
                if(searchY.value.value !== ''){
                    searchY.value.value = value
                    return
                }
                
                searchY.value.value = value
                setTimeout(() => {
                    search(searchY.value.value)
                    searchY.value.value = ''
                }, 500)
                return
            } else {
                searchY.value.loading = true
            }
            let options = []
            
            const routes = router.getRoutes()
            for (let i = 0; i < routes.length; i++) {
                if(routes[i].name == 'login'){
                    continue
                }
                if(!value || value.indexOf(i18n[routes[i].meta.title][lang.value]) >= 0 || value.indexOf(routes[i].name) >= 0){
                    options.push({
                        label: i18n[routes[i].meta.title][lang.value],
                        description: i18n.menus[lang.value],
                        route: routes[i],
                        type: 'menus',
                        avatar: routes[i].meta.avatar
                    })
                }
            }
            searchOptions.value = options

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
                    description: i18n.goods[lang.value],
                    type: 'goods',
                    avatar: goods.data[i]['main-image'] == null ? 'https://cdn.fixeam.com/tw/colorful/shopping.png' : JSON.parse(goods.data[i]['main-image'])[0]
                })
            }

            searchOptions.value = options
            searchY.value.loading = false
        }
        const selected = (value) => {
            let option = searchOptions.value.find(obj => obj.label == value)
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
        }

        const saveOptions = () => {
            localStorage.setItem('store', shop.store)
            localStorage.setItem('brand', shop.brand)
        }

        const backToOldVersion = () => {
            window.open('//dwork.fixeam.com/')
        }

        const user = inject('user')
        const collectionPath = ref([])
        const collection = (route, status = true) => {
            if(status){
                collectionPath.value.push(route)
                localStorage.setItem('collection', JSON.stringify(collectionPath.value))
            } else {
                collectionPath.value = collectionPath.value.filter(item => item.path !== route.path)
                localStorage.setItem('collection', JSON.stringify(collectionPath.value))
            }
        }
        const viewCounter = () => {
            window.open(shop.counter[shop.store + shop.brand], "newwindow","height=800, width=420, top=120, left=685, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
        }
        const COUNT = ref('')
        const clickSet = () => {
            localStorage.setItem('setting-button-attention', 'clicked')
            COUNT.value = ''
            settings.value = true
        }

        onMounted(() => {
            setTimeout(() => {
                activeMenu.value = route.meta.key
            }, 600)

            document.addEventListener('keydown', function(event) {
                if(event.ctrlKey && event.key === 'k') {
                    searchBox.value.$el.querySelector('input').focus()
                    event.preventDefault()
                }
            })

            search()
            collectionPath.value = JSON.parse(localStorage.getItem('collection')) || []

            if(!localStorage.getItem('setting-button-attention')){
                COUNT.value = 'new'
            }
        })

        return {
            lang,
            i18n,
            backToOldVersion,
            changeLanguage,
            downloadClient,
            downloadAndroidApp,
            downloadApk,
            mobileWeb,

            copy,
            shop,
            viewCounter,

            activeMenu,

            searchBox,
            searchWidth,
            searchOptions,
            searchValue,
            search,

            settings,
            saveOptions,

            user,
            collection,
            collectionPath,
            routes,

            COUNT,
            clickSet,
            selected
        }
    }
}
</script>

<style>

</style>