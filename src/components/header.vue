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
                        <t-dropdown-item :disabled="!clientLink" @click="downloadClient">
                            <t-icon name="desktop" style="margin-right: 5px;" />
                            {{ getString('windows') }}
                        </t-dropdown-item>
                        <t-dropdown-item :disabled="!appLink" @click="downloadAndroidApp = true">
                            <t-icon name="logo-android" style="margin-right: 5px;" />
                            {{ getString('android') }}
                        </t-dropdown-item>
                        <t-dropdown-item :disabled="true" @click="mobileWeb = true">
                            <t-icon name="mobile" style="margin-right: 5px;" />
                            {{ getString('mobile') }}
                        </t-dropdown-item>
                    </t-dropdown-menu>
                </t-dropdown>
                <t-tooltip :content="getString('setting')" v-if="$route.name !== 'login'">
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
                            {{ getString('viewAvatar') }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="$router.push('/user-center')">
                            <t-icon name="verify" style="margin-right: 5px;" />
                            {{ getString('userCenter') }}
                        </t-dropdown-item>
                        <t-dropdown-item @click="user.logout">
                            <t-icon name="logout" style="margin-right: 5px;" />
                            {{ getString('logout') }}
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
    :header="getString('android')"
    :footer="false"
    >
        <div style="text-align: center;">
            <t-icon name="scan" />
            {{ getString('scanToDownload') }}
            <QRCodeVue3
                v-if="downloadAndroidApp"
                :width="160"
                :height="160"
                :value="appLink"
                :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
                :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
                :dotsOptions="{
                    type: 'dots',
                    color: '#888',
                    gradient: {
                        type: 'linear',
                        rotation: 0,
                        colorStops: [
                            { offset: 0, color: '#888' },
                            { offset: 1, color: '#888' }
                        ]
                    }
                }"
                :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
                :cornersDotOptions="{ type: undefined, color: '#000000' }"
                fileExt="png"
                :download="false"
                :downloadOptions="{ name: 'vqr', extension: 'png' }"
                />
            <div>
                <t-button @click="downloadApk">
                    <template #icon>
                        <t-icon name="logo-android" />
                    </template>
                    {{ getString('downloadApk') }}
                </t-button>
            </div>
        </div>
    </t-dialog>
    <t-dialog
    v-model:visible="mobileWeb"
    :header="getString('mobile')"
    :footer="false"
    >
        <div style="text-align: center;">
            <t-icon name="scan" />
            {{ getString('scanToVisit') }}
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
    :header="getString('setting')"
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
            :label="getString('store') + ': '"
            v-model="shop.store"
            :options="shop.storeOptions"
            @change="storeChange"
            ></t-select>
            <t-select
            :label="getString('brand') + ': '"
            v-model="shop.brand"
            :options="brandOptions"
            @change="saveOptions"
            ></t-select>
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
import { copy } from '../hooks'
import Logo from './Logo.vue'
import Menu from './Menu.vue'
import SearchBox from './SearchBox.vue'
import SearchResult from './SearchResult.vue'
import {getString, getLanguageOptionItem} from "../i18n/index.js"
import {tips} from "../hooks/tips.js"
import service from "../api/service.js"
import {getToken} from "../hooks/user.js"
import QRCodeVue3 from "qrcode-vue3"

const i18n = inject('i18n')
const user = inject('user')
const shop = inject('shop')

const downloadAndroidApp = ref(false)
const mobileWeb = ref(false)
const settings = ref(false)
const COUNT = ref('')
const searchResult = ref(null)
const showBackground = ref(true)

const clientLink = ref(null)
const appLink = ref(null)

const downloadClient = () => {
    window.open(clientLink.value)
}

const downloadApk = () => {
    window.open(appLink.value)
}

const getLatestVersions = async () => {
    let windows = await service.api.app.appLatestVersion('windows')
    if(windows.result){
        clientLink.value = windows.content.package_resource
    } else {
        tips(windows.error.message, 'error')
    }

    let android = await service.api.app.appLatestVersion('android')
    if(android.result){
        appLink.value = android.content.package_resource
    } else {
        tips(android.error.message, 'error')
    }
}

const saveOptions = () => {
    localStorage.setItem('language', i18n.language)
    localStorage.setItem('store', shop.store)
    localStorage.setItem('brand', shop.brand)
    if(getToken()){
        service.api.user.saveUserInform({
            setting: JSON.stringify({
                store: shop.store,
                brand: shop.brand,
                language: i18n.language
            })
        })
    }
}

const changeLanguage = ({ value }) => {
    i18n.language = value
    saveOptions()
    tips('已为您切换界面语言, 刷新页面以获得最佳浏览体验！', 'success')
}

const brandOptions = ref([])
const storeChange = (value) => {
    let option = shop.storeOptions.find(item => item['value'] === value)
    if(!option){
        return
    }
    let supportBrand = option.brand
    let resetBrand = false

    brandOptions.value = []
    for (let i = 0; i< shop.brandOptions.length; i++){
        if(supportBrand.indexOf(shop.brandOptions[i].id) >= 0){
            brandOptions.value.push(shop.brandOptions[i])
        }
        if(shop.brandOptions[i].value === shop.brand){
            if(supportBrand.indexOf(shop.brandOptions[i].id) < 0){
                resetBrand = true
            }
        }
    }

    if(resetBrand){
        shop.brand = brandOptions.value[0].value
    }

    saveOptions()
}
watch(() => shop.brand, () => {
    storeChange(shop.store)
})

const clickSet = () => {
    localStorage.setItem('setting-button-attention', 'clicked')
    COUNT.value = ''
    storeChange(shop.store)
    settings.value = true
}

const viewOnGithub = () => {
    window.open('https://github.com/qq1790141618/wanxun-web')
}

const showBackgroundChange = (value) => {
    if(value){
        localStorage.setItem('show-background', '1')
        document.body.style.background = "transparent url(\"https://cdn.fixeam.com/tw/img1.wallspic.com-jian_yue-shou_shi-qi_ti-yuan_quan-dian_lan_se_de-7680x4320.jpg\") center center / cover no-repeat"
    } else {
        localStorage.setItem('show-background', '0')
        document.body.style.background = ''
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
    if(getToken()){
        getLatestVersions()
    }
})
</script>

<style>

</style>