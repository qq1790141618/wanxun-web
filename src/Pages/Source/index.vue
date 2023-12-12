<template>
    <div id="source" style="padding: 10px 16px;">
        <t-layout>
            <t-header>
            </t-header>
            <t-layout>
                <t-aside width="300px">
                    <SourceMenu @open="(orUrl, node) => { docv.openDocument(orUrl, node) }" />
                </t-aside>
                <t-content>
                    <DocumentViewer ref="docv" />
                </t-content>
            </t-layout>
        </t-layout>
    </div>
</template>

<script>
import SourceMenu from './SerceMenu.vue'
import DocumentViewer from './document/index.vue'

export default {
    components: {
        SourceMenu,
        DocumentViewer
    },
    setup() {
        const i18n = inject('i18n')
        const docv = ref(null)

        return {
            i18n,
            docv
        }
    }
}
</script>

<style>
#source .t-layout, #source .t-layout__header, #source .t-layout__sider{
    height: calc(100vh - 110px);
}
#source .t-layout__content{
    padding: 0 36px;
    display: flex;
    overflow-y: auto;
}
.document-content{
    position: relative;
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
    max-height: calc(100vh - 110px);
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
    right: 20px;
    top: 15px;
}
</style>