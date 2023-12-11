<template>
    <t-menu
    id="source-menu"
    theme="light"
    v-model="activeMenu"
    width="300px"
    >
        <t-menu-group :title="i18n.main[i18n.language]">
            <t-menu-item value="6-1-1" @click="$router.push('/open-source/Appvue')">
                <span>
                    App.vue
                    <t-tag size="small">
                        {{ i18n.entryFile[i18n.language] }}
                    </t-tag>
                </span>
            </t-menu-item>
            <t-menu-item value="6-1-2" @click="$router.push('/open-source/mainjs')">
                <span>
                    main.js
                    <t-tag size="small">
                        {{ i18n.entryScript[i18n.language] }}
                    </t-tag>
                </span>
            </t-menu-item>
            <t-menu-item value="6-1-3" @click="$router.push('/open-source/stylecss')">
                <span>
                    style.css
                    <t-tag size="small">
                        {{ i18n.mainStyleFile[i18n.language] }}
                    </t-tag>
                </span>
            </t-menu-item>
            <t-menu-item value="6-1-4" @click="$router.push('/open-source/packagejson')">
                <span>
                    package.json
                    <t-tag size="small">
                        {{ i18n.packageConfig[i18n.language] }}
                    </t-tag>
                </span>
            </t-menu-item>
            <t-menu-item value="6-1-8" @click="$router.push('/open-source/package-lockjson')">
                <span>
                    package-lock.json
                    <t-tag size="small">
                        {{ i18n.packageLockConfig[i18n.language] }}
                    </t-tag>
                </span>
            </t-menu-item>
            <t-menu-item value="6-1-5" @click="$router.push('/open-source/viteconfigjs')">
                <span>
                    vite.config.js
                    <t-tag size="small">
                        {{ i18n.viteConfig[i18n.language] }}
                    </t-tag>
                </span>
            </t-menu-item>
            <t-menu-item value="6-1-6" @click="$router.push('/open-source/indexhtml')">
                <span>
                    index.html
                    <t-tag size="small">
                        {{ i18n.indexHtmlFile[i18n.language] }}
                    </t-tag>
                </span>
            </t-menu-item>
            <t-menu-item value="6-1-7" @click="$router.push('/open-source/userjs')">
                <span>
                    user.js
                    <t-tag size="small">
                        {{ i18n.userConrtrolFile[i18n.language] }}
                    </t-tag>
                </span>
            </t-menu-item>
        </t-menu-group>
        <!-- <t-menu-group :title="i18n.page[i18n.language]">
            
        </t-menu-group> -->
        <t-menu-group :title="i18n.languagePackage[i18n.language]">
            <t-menu-item
            v-for="item, index in ['zh', 'fra', 'cht', 'en', 'kor', 'jp', 'th']"
            :key="index"
            :value="'6-2-' + index"
            @click="openURL('https://cdn.fixeam.com/tw/language/' + item + '.json')"
            >
                <span>
                    {{ item }}
                </span>
            </t-menu-item>
        </t-menu-group>
        <t-menu-group title="更多源码将会逐步开放浏览">
        </t-menu-group>
    </t-menu>
</template>

<script>
export default {
    setup(){
        const i18n = inject('i18n')
        const activeMenu = ref('6-1-1')
        const route = useRoute()

        onMounted(() => {
            setTimeout(() => {
                activeMenu.value = route.meta.key
            }, 600)
        })

        const openURL = (url) => { window.open(url) }

        return {
            i18n,
            activeMenu,
            openURL
        }
    }
}
</script>

<style>
#source-menu{
    border-radius: 7px;
}
#source-menu .t-menu__item {
    padding-bottom: var(--td-comp-margin-xs);
}
#source-menu .t-menu__item .t-tag{
    margin-left: 4px;
}
</style>