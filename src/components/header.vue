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
                            {{ getContent('windows') }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="downloadAndroidApp = true">
                            <t-icon name="logo-android" style="margin-right: 5px;" />
                            {{ getContent('android') }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="mobileWeb = true">
                            <t-icon name="mobile" style="margin-right: 5px;" />
                            {{ getContent('mobile') }}
                        </t-dropdown-item>
                    </t-dropdown-menu>
                </t-dropdown>
                <t-tooltip :content="getContent('setting')" v-if="$route.name !== 'login'">
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
                v-if="user.status === 'loged'"
                >
                    <t-button variant="text">
                        <template #icon>
                            <t-image :src="user.inform.headsrc" shape="circle" style="width: 28px;">
                                <template #loading>
                                    ...
                                </template>
                                <template #error>
                                    ×
                                </template>
                            </t-image>
                        </template>
                        &nbsp;
                        {{ user.inform.nickname }}
                    </t-button>
                    <t-dropdown-menu>
                        <t-dropdown-item @click="user.avatarView = true">
                            <t-icon name="browse" style="margin-right: 5px;" />
                            {{ getContent('viewAvatar') }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="$router.push('/user-center')">
                            <t-icon name="verify" style="margin-right: 5px;" />
                            {{ getContent('userCenter') }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="user.logout">
                            <t-icon name="logout" style="margin-right: 5px;" />
                            {{ getContent('logout') }}
                        </t-dropdown-item>
                    </t-dropdown-menu>
                </t-dropdown>
                <t-image-viewer
                v-if="user.status === 'loged'"
                :images="[ user.inform.headsrc ]"
                v-model:visible="user.avatarView"
                >
                </t-image-viewer>
            </t-space>
        </div>
    </header>
    <t-dialog
    v-model:visible="downloadAndroidApp"
    :header="getContent('android')"
    :footer="false"
    >
        <div style="text-align: center;">
            <t-icon name="scan" />
            {{ getContent('scanToDownload') }}
            <img src="../assets/QRcode_sp1.jpg" style="width: 240px;" >
            <div>
                <t-button @click="downloadApk">
                    <template #icon>
                        <t-icon name="logo-android" />
                    </template>
                    {{ getContent('downloadApk') }}
                </t-button>
            </div>
        </div>
    </t-dialog>
    <t-dialog
    v-model:visible="mobileWeb"
    :header="getContent('mobile')"
    :footer="false"
    >
        <div style="text-align: center;">
            <t-icon name="scan" />
            {{ getContent('scanToVisit') }}
            <img src="../assets/Mobile Web.png" style="width: 200px;"  alt="">
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
    :header="getContent('setting')"
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
                    {{ value ? getLanguageOptionItem(value) : '' }}
                </template>
            </t-select>
            <t-select
            :label="getContent('store') + ': '"
            v-model="shop.store"
            :options="shop.storeOptions"
            @change="saveOptions"
            ></t-select>
            <t-select
            :label="getContent('brand') + ': '"
            v-model="shop.brand"
            :options="shop.brandOptions"
            @change="saveOptions"
            ></t-select>
            <t-link theme="primary" @click="viewCounter" v-if="shop.counter[shop.store + shop.brand]">
                {{ getContent('viewCounter') }}>>
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

<script setup>
import { copy, translate } from '../hooks'
import Logo from './Logo.vue'
import Menu from './Menu.vue'
import SearchBox from './SearchBox.vue'
import SearchResult from './SearchResult.vue'
import {getContent, getLanguageOptionItem} from "../i18n/index.js";
import {tips} from "../hooks/tips.js";

const i18n = inject('i18n')
const user = inject('user')
const shop = inject('shop')

const downloadAndroidApp = ref(false)
const mobileWeb = ref(false)
const settings = ref(false)
const COUNT = ref('')
const searchResult = ref(null)
const showBackground = ref(true)

const changeLanguage = (item) => {
    localStorage.setItem('language', item.value)
    tips('已为您切换界面语言, 刷新页面以获得最佳浏览体验！', 'success')
}

const downloadClient = () => {
    window.open('https://cdn.fixeam.com/tw/application/windows/2023110715/version_1.0.4_release_miaostreet_sales_analysis_wanxun.exe')
}

const downloadApk = () => {
    window.open('https://cdn.fixeam.com/tw/application/android/2024032514/app-release.apk')
}

const saveOptions = () => {
    localStorage.setItem('store', shop.store)
    localStorage.setItem('brand', shop.brand)
}

const viewCounter = () => {
    window.open(shop.counter[shop.store + shop.brand], "newwindow","height=800, width=420, top=120, left=685, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")
}

const clickSet = () => {
    localStorage.setItem('setting-button-attention', 'clicked')
    COUNT.value = ''
    settings.value = true
}

const viewOnGithub = () => {
    window.open('https://github.com/qq1790141618/wanxun-web')
}

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
    const background = localStorage.getItem('show-background')
    if(background && background === '0'){
        showBackground.value = false
    }
    showBackgroundChange(showBackground.value)
})
</script>

<style>

</style>