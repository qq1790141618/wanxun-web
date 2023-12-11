<template>
    <div id="source" style="padding: 10px 16px;">
        <t-layout>
            <t-header>
            </t-header>
            <t-layout>
                <t-aside width="300px">
                    <SourceMenu />
                </t-aside>
                <t-content>
                    <router-view v-slot="{ Component }" >
                        <keep-alive>
                            <component :is="Component" :key="$route.meta.key" v-if="$route.meta.keepAlive"/>
                        </keep-alive>
                        <component :is="Component" :key="$route.meta.key" v-if="!$route.meta.keepAlive"/>
                    </router-view>
                </t-content>
            </t-layout>
        </t-layout>
    </div>
</template>

<script>
import SourceMenu from './SerceMenu.vue'

export default {
    components: {
        SourceMenu
    },
    setup() {
        const i18n = inject('i18n')

        return {
            i18n
        }
    }
}
</script>

<style>
#source .t-layout, #source .t-layout__header, #source .t-layout__sider{
    background-color: transparent;
    height: calc(100vh - 110px);
}
#source .t-layout__header{
    height: 0;
}
#source .t-layout__content{
    padding: 0 36px;
    display: flex;
    overflow-y: auto;
}
.document-content{
    flex-grow: 1;
}
.code-box{
    position: relative;
    border-radius: 7px;
    overflow: hidden;
    margin-bottom: 7px;
}
.code-box pre{
    margin: 0;
}
.code-box code{
    min-height: 60px;
    max-height: 80vh;
    border-radius: 7px;
    padding: 12px 20px!important;
    white-space: pre-wrap !important;
    white-space: -moz-pre-wrap !important;
    white-space: -pre-wrap !important;
    white-space: -o-pre-wrap !important;
    word-wrap: break-word !important;
}
.code-box-actions{
    position: absolute;
    right: 13px;
    top: 15px;
}
</style>