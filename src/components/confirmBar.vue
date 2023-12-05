<template>
    <t-space size="8px">
        <t-button
        @click="$emit('confirm')"
        :disabled="confirmLoading"
        :loading="confirmLoading"
        >
            {{ localString.confirm[local.name] }}
        </t-button>
        <t-button theme="danger" @click="$emit('close')" v-if="!nocancel && nocancel !== ''">
            {{ localString.cancel[local.name] }}
        </t-button>
        <t-button variant="outline" @click="$emit('reset')" v-if="!noreset && noreset !== ''">
            {{ localString.reset[local.name] }}
        </t-button>
    </t-space>
</template>

<script>
import localString from './local'

export default {
    props: ['confirmLoading', 'noreset', 'nocancel'],
    emits: ['confirm', 'close', 'reset'],
    setup(){
        const local = inject('local')
        return { local, localString }
    }
}
</script>

<style>

</style>