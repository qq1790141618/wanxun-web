<template>
    <t-space size="8px">
        <t-button
        @click="$emit('confirm')"
        :disabled="confirmLoading"
        :loading="confirmLoading"
        >
            {{ i18n.confirm[i18n.language] }}
        </t-button>
        <t-button theme="danger" @click="$emit('close')" v-if="!nocancel && nocancel !== ''">
            {{ i18n.cancel[i18n.language] }}
        </t-button>
        <t-button variant="outline" @click="$emit('reset')" v-if="!noreset && noreset !== ''">
            {{ i18n.reset[i18n.language] }}
        </t-button>
    </t-space>
</template>

<script>
export default {
    props: ['confirmLoading', 'noreset', 'nocancel'],
    emits: ['confirm', 'close', 'reset'],
    setup(){
        const i18n = inject('i18n')
        return { i18n }
    }
}
</script>

<style>

</style>