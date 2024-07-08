<template>
    <t-space size="8px">
        <t-button
            type="submit"
            :size="size"
            @click="$emit('confirm')"
            :disabled="confirmLoading"
            :loading="confirmLoading"
        >
            {{ getContent('confirm') }}
        </t-button>
        <t-popconfirm
            :content="getContent('cancelConfirm')"
            @confirm="$emit('close')"
            v-if="!nocancel && nocancel !== ''"
        >
            <t-button
                :size="size"
                theme="danger"
            >
                {{ getContent('cancel') }}
            </t-button>
        </t-popconfirm>
        <t-button
            type="reset"
            :size="size"
            variant="outline"
            @click="$emit('reset')"
            v-if="!noreset && noreset !== ''"
        >
            {{ getContent('reset') }}
        </t-button>
    </t-space>
</template>

<script>
import { getString } from "../i18n/index.js"

export default {
    methods: {
        getContent: getString
    },
    props: {
        confirmLoading: {
            type: Boolean,
            default: false
        },
        noreset: {
            type: Boolean,
            default: false
        },
        nocancel: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'medium'
        }
    }
}
</script>

<style>

</style>