<template>
    <t-space size="8px">
        <t-button
        type="submit"
        :size="size"
        @click="$emit('confirm')"
        :disabled="confirmLoading"
        :loading="confirmLoading"
        >
            {{ i18n.confirm[i18n.language] }}
        </t-button>
        <t-popconfirm
        :content="i18n.cancelConfirm[i18n.language]"
        @confirm="$emit('close')"
        v-if="!nocancel && nocancel !== ''"
        >
            <t-button
            :size="size"
            theme="danger"
            >
                {{ i18n.cancel[i18n.language] }}
            </t-button>
        </t-popconfirm>
        <t-button
        type="reset"
        :size="size"
        variant="outline"
        @click="$emit('reset')"
        v-if="!noreset && noreset !== ''"
        >
            {{ i18n.reset[i18n.language] }}
        </t-button>
    </t-space>
</template>

<script>
export default {
    props: ['confirmLoading', 'noreset', 'nocancel', 'size'],
    emits: ['confirm', 'close', 'reset'],
    setup(){
        const i18n = inject('i18n')
        return { i18n }
    }
}
</script>

<style>

</style>