<template>
    <div class="document-content">
        <div
        class="code-box"
        v-for="item, index in full[$route.meta.idx]"
        :key="index"
        >
            <h4>
                {{ index }}
            </h4>
            <div class="code-box-actions">
                <t-button
                size="small"
                variant="text"
                shape="square"
                @click="copy(item, i18n.language)"
                >
                    <template #icon>
                        <t-icon name="copy" />
                    </template>
                </t-button>
            </div>
            <highlightjs
            :language="codeLang[index]"
            :code="item"
            />
        </div>
    </div>
</template>

<script>
import full from './full.js'
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
            '<template>': 'html',
            'html': 'html',
            '<script>': 'js',
            'js': 'js',
            'style': 'css',
            'css': 'css'
        }

        return {
            i18n,
            full,
            copy,
            codeLang
        }
    }
}
</script>

<style>

</style>./full.js