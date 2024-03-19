<template>
    <header class="header">
        <Logo />
        <Menu />
        <div class="operations-container">
            <t-space size="5px">
                <SearchBox
                @search="(value) => {
                    searchResult.search(value)
                }"
                />
                <t-tooltip content="Github">
                    <t-button variant="text" shape="square" @click="viewOnGithub">
                        <template #icon>
                            <t-icon name="logo-github" />
                        </template>
                    </t-button>
                </t-tooltip>
                <t-tooltip :content="i18n.backToOldVersion[i18n.language]">
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
                            {{ i18n.windows[i18n.language] }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="downloadAndroidApp = true">
                            <t-icon name="logo-android" style="margin-right: 5px;" />
                            {{ i18n.android[i18n.language] }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="mobileWeb = true">
                            <t-icon name="mobile" style="margin-right: 5px;" />
                            {{ i18n.mobile[i18n.language] }}
                        </t-dropdown-item>
                    </t-dropdown-menu>
                </t-dropdown>
                <!-- <t-tooltip :content="i18n.chat[i18n.language]" v-if="$route.name !== 'login'">
                    <t-button variant="text" shape="square" @click="chatPage">
                        <template #icon>
                            <t-icon name="chat-double" />
                        </template>
                    </t-button>
                </t-tooltip> -->
                <t-tooltip :content="i18n.setting[i18n.language]" v-if="$route.name !== 'login'">
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
                            {{ i18n.viewAvatar[i18n.language] }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="$router.push('/user-center')">
                            <t-icon name="verify" style="margin-right: 5px;" />
                            {{ i18n.userCenter[i18n.language] }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="user.logout">
                            <t-icon name="logout" style="margin-right: 5px;" />
                            {{ i18n.logout[i18n.language] }}
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
    :header="i18n.android[i18n.language]"
    :footer="false"
    >
        <div style="text-align: center;">
            <t-icon name="scan" />
            {{ i18n.scanToDownload[i18n.language] }}
            <img src="../assets/Android.png" style="width: 200px;" >
            <div>
                <t-button @click="downloadApk">
                    <template #icon>
                        <t-icon name="logo-android" />
                    </template>
                    {{ i18n.downloadApk[i18n.language] }}
                </t-button>
            </div>
        </div>
    </t-dialog>
    <t-dialog
    v-model:visible="mobileWeb"
    :header="i18n.mobile[i18n.language]"
    :footer="false"
    >
        <div style="text-align: center;">
            <t-icon name="scan" />
            {{ i18n.scanToVisit[i18n.language] }}
            <img src="../assets/Mobile Web.png" style="width: 200px;" >
            <t-link href="https://mobile-work.fixeam.com/" target="_blank" style="margin-right: 5px;">
                Url:
                https://mobile-work.fixeam.com/
            </t-link>
            <t-button @click.stop="copy('https://mobile-work.fixeam.com/', i18n.language)" variant="text" shape="square">
                <template #icon>
                    <t-icon name="copy" />
                </template>
            </t-button>
        </div>
    </t-dialog>
    <t-dialog
    v-model:visible="settings"
    :header="i18n.setting[i18n.language]"
    :footer="false"
    :close-on-overlay-click="false"
    >
        <t-space direction="vertical" style="width: 100%;">
            <t-select
            label="Language: "
            v-model="i18n.language"
            :options="i18n.options"
            @change="(value) => {
                changeLanguage({ value })
            }"
            >
                <template #valueDisplay="{ value }">
                    {{ value ? (i18n.options.find(item => item.value == value) ? i18n.options.find(item => item.value == value).content : '') : '' }}
                </template>
            </t-select>
            <t-select
            :label="i18n.store[i18n.language] + ': '"
            v-model="shop.store"
            :options="shop.storeOptions"
            @change="saveOptions"
            ></t-select>
            <t-select
            :label="i18n.brand[i18n.language] + ': '"
            v-model="shop.brand"
            :options="shop.brandOptions"
            @change="saveOptions"
            ></t-select>
            <t-link theme="primary" @click="viewCounter" v-if="shop.counter[shop.store + shop.brand]">
                {{ i18n.viewCounter[i18n.language] }}>>
            </t-link>
            <t-space size="small" align="center">
                <t-switch size="small" v-model="showBackground" @change="showBackgroundChange"></t-switch><div>显示背景/Show Background</div>
            </t-space>
        </t-space>
    </t-dialog>
    <SearchResult
    ref="searchResult"
    />
</template>

<script>
import { copy, translate } from '../hooks'
import Logo from './Logo.vue'
import Menu from './Menu.vue'
import SearchBox from './SearchBox.vue'
import SearchResult from './SearchResult.vue'

export default {
    components: {
        Logo,
        Menu,
        SearchBox,
        SearchResult
    },
    setup(){
        const i18n = inject('i18n')
        i18n.language = i18n.language
        const changeLanguage = (item) => {
            localStorage.setItem('language', item.value)
            translate('已为您切换界面语言, 刷新页面以获得最佳浏览体验！', i18n.language)
            .then(res => {
                MessagePlugin.success(res.trans_result[0].dst)
            })
        }
        watch(() => i18n.language, () => {
            i18n.language = i18n.language
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
        const settings = ref(false)
        
        const saveOptions = () => {
            localStorage.setItem('store', shop.store)
            localStorage.setItem('brand', shop.brand)
        }

        const backToOldVersion = () => {
            window.open('//dwork.fixeam.com/')
        }

        const user = inject('user')
        const viewCounter = () => {
            window.open(shop.counter[shop.store + shop.brand], "newwindow","height=800, width=420, top=120, left=685, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
        }
        const COUNT = ref('')
        const clickSet = () => {
            localStorage.setItem('setting-button-attention', 'clicked')
            COUNT.value = ''
            settings.value = true
        }
        const searchResult = ref(null)

        const viewOnGithub = () => {
            window.open('https://github.com/qq1790141618/wanxun-web')
        }

        const chatPage = () => {
            window.open('https://wxchat.fixeam.com/?access_token=' + localStorage.getItem('access_token'))
        }

        const showBackground = ref(true)
        const showBackgroundChange = (value) => {
            if(value){
                localStorage.setItem('show-background', '1')

                document.body.style.backgroundImage = 'url("https://cdn.fixeam.com/tw/img1.wallspic.com-jian_yue-shou_shi-qi_ti-yuan_quan-dian_lan_se_de-7680x4320.jpg")'
                document.body.style.backgroundRepeat = 'no-repeat'
                document.body.style.backgroundAttachment = 'fixed'
                document.body.style.backgroundPosition = 'center'
                document.body.style.backgroundColor = "transparent"
            } else {
                localStorage.setItem('show-background', '0')

                document.body.style.backgroundImage = ''
                document.body.style.backgroundColor = "#f2f3ff"
            }
        }
        onMounted(() => {
            if(!localStorage.getItem('setting-button-attention')){
                COUNT.value = 'new'
            }
            var shbc = localStorage.getItem('show-background')
            if(shbc && shbc == '0'){
                showBackground.value = false
            }
            showBackgroundChange(showBackground.value)
        })

        return {
            i18n,
            viewOnGithub,
            backToOldVersion,
            changeLanguage,
            downloadClient,
            downloadAndroidApp,
            downloadApk,
            mobileWeb,
            copy,
            shop,
            viewCounter,
            settings,
            saveOptions,
            user,
            COUNT,
            clickSet,
            searchResult,
            chatPage,
            showBackground,
            showBackgroundChange
        }
    }
}
</script>

<style>

</style>