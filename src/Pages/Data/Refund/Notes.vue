<template>
    <h2 style="width: 100%; text-align: center;">
        {{ getString('customerNote') }}
    </h2>
    <t-tabs
        v-model="current"
        theme="card"
        style="height: 33vh;"
        placement="top"
    >
        <template
            v-for="item in data"
            :key="item.name"
        >
            <t-tab-panel
                v-if="item.notes.length > 0"
                :label="item.name"
                :value="item.name"
            >
                <t-list :split="true" style="max-height: 30vh; overflow-y: auto; overflow-x: auto;">
                    <t-list-item
                        v-for="note in item.notes"
                        :key="note.id"
                    >
                        {{ note.id }}
                        -
                        {{ note.receiptNumber }}
                        -
                        {{ note.userNote }}
                    </t-list-item>
                </t-list>
            </t-tab-panel>
        </template>
    </t-tabs>
</template>

<script setup>
import { getString } from "../../../i18n/index.js"

const props = defineProps({
    data: {
        type: Array,
        required: true
    }
})
const current = ref(props.data[0].name)
</script>

<style scoped>

</style>