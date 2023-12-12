<template>
    <div class="document-content">
        <t-loading
        v-if="loading"
        style="width: 100%; min-height: 70vh;"
        size="small"
        :text="i18n.loading[i18n.language]"
        ></t-loading>
        <div class="code-box" v-if="viewNode.value !== '' && !loading">
            <div class="code-box-actions">
                <t-button
                size="small"
                variant="text"
                theme="default"
                shape="square"
                @click="copy(documentContent[viewNode], i18n.language)"
                ghost
                >
                    <template #icon>
                        <t-icon name="copy" />
                    </template>
                </t-button>
            </div>
            <highlightjs
            v-if="codeLang[type]"
            :language="codeLang[type]"
            :code="documentContent[viewNode]"
            />
        </div>
        <t-image-viewer
        v-if="type === 'image'"
        :images="[
            viewNode
        ]"
        >
            <template #trigger="{ open }">
                <t-image
                :src="viewNode"
                fit="contain"
                class="image-view"
                @click="open"
                ></t-image>
            </template>
        </t-image-viewer>
    </div>
</template>

<script>
import 'highlight.js/lib/common'
import hljsVuePlugin from "@highlightjs/vue-plugin"
import { copy } from '../../../hooks'

export default {
    components: {
        highlightjs: hljsVuePlugin.component
    },
    setup(){
        const i18n = inject('i18n')
        const codeLang = {
            'vue': 'js',
            'html': 'html',
            'js': 'js',
            'json': 'json',
            'css': 'css'
        }
        const viewNode = ref('')
        const documentContent = ref({})
        const type = ref('')
        const loading = ref(false)

        const getDocumentContent = async (item) => {
            return fetch(item)
            .then(res => {
                return Promise.resolve(res.text())
            })
        }
        const openDocument = async (orUrl, node) => {
            let item = orUrl + node.value
            type.value = node.type

            if(documentContent.value[item]){
                viewNode.value = item
            } else {
                loading.value = true
                let content = await getDocumentContent(item)
                documentContent.value[item] = content
                viewNode.value = item
                loading.value = false
            }
        }

        return {
            i18n,
            copy,
            codeLang,
            openDocument,
            documentContent,
            viewNode,
            type,
            loading
        }
    }
}
</script>

<style>
.image-view{
    width: 400px;
    height: 300px;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: transparent;
}
</style>