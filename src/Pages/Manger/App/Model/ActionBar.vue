<template>
    <t-space style="margin-bottom: 12px;">
        <t-button
        @click="() => {
            if(!user.inform['need_auth'] || user.inform['api_p'].indexOf('api/v1/app/version/publish') >= 0){
                $emit('addNew')
            } else {
                tips('权限不足', 'error')
            }
        }"
        >
            <template #icon>
                <t-icon name="add-circle" />
            </template>
            {{ i18n['publishNewVersion'][i18n.language] }}
        </t-button>
        <t-button
        @click="$emit('reload')"
        variant="outline"
        >
            <template #icon>
                <t-icon name="refresh" />
            </template>
            {{ i18n['refresh'][i18n.language] }}
        </t-button>
    </t-space>
</template>

<script setup>
import {tips} from "../../../../hooks/tips.js";

const emits = defineEmits(["addNew", "reload"])
const i18n = inject('i18n')
const user = inject('user')
</script>

<style>

</style>