<template>
    <t-space style="margin-bottom: 12px;">
        <t-button
            @click="$emit('addNew')"
        >
            <template #icon>
                <t-icon name="add-circle" />
            </template>
            {{ getString('publishNewVersion') }}
        </t-button>
        <t-button
            @click="$emit('reload')"
            variant="outline"
        >
            <template #icon>
                <t-icon name="refresh" />
            </template>
            {{ getString('refresh') }}
        </t-button>
    </t-space>
</template>

<script setup>
import { getString } from "../../../../i18n/index.js"

const emits = defineEmits(["addNew", "reload"])
const user = inject('user')
</script>

<style>

</style>