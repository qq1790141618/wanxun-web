<template>
    <t-list-item>
        {{ name }}
        <template #action>
            <t-checkbox
                style="vertical-align: middle;"
                v-if="Math.min(...currentSkus.map(obj => obj[property])) !== Math.max(...currentSkus.map(obj => obj[property])) && !isNaN(Math.min(...currentSkus.map(obj => obj[property]))) && !isNaN(Math.max(...currentSkus.map(obj => obj[property])))"
                @change="(checked) => {
                    if(checked){
                        let value = currentSkus[0][property]
                        currentSkus =
                        currentSkus.map(obj => {
                            obj[property] = value
                            return obj
                        })
                    }
                }"
            >
                {{ getString('unify') }}
            </t-checkbox>
            <t-input-number
                v-if="Math.min(...currentSkus.map(obj => obj[property])) === Math.max(...currentSkus.map(obj => obj[property])) || isNaN(Math.min(...currentSkus.map(obj => obj[property]))) || isNaN(Math.max(...currentSkus.map(obj => obj[property])))"
                v-model="currentSkus[0][property]"
                @change="(value) => {
                    currentSkus =
                    currentSkus.map(obj => {
                        obj[property] = value
                        return obj
                    })
                }"
                size="small"
                align="center"
                style="margin: 0 10px;"
            />
            <span
                v-if="Math.min(...currentSkus.map(obj => obj[property])) !== Math.max(...currentSkus.map(obj => obj[property])) && !isNaN(Math.min(...currentSkus.map(obj => obj[property]))) && !isNaN(Math.max(...currentSkus.map(obj => obj[property])))"
                style="margin: 0 10px;"
            >
                        {{ Math.min(...currentSkus.map(obj => obj[property])) }}
                        ~
                        {{ Math.max(...currentSkus.map(obj => obj[property])) }}
                    </span>
            <t-popup placement="right" trigger="click">
                <t-button
                    variant="outline"
                    size="small"
                >
                    {{ getString('barcode') }}{{ name }}
                </t-button>
                <template #content>
                    <t-list
                        :split="true"
                        size="small"
                        style="width: 400px; max-height: 60vh; overflow-y: auto;"
                    >
                        <t-list-item
                        >
                            {{ getString('barcode') }}
                            <template #action>
                                {{ getString('tagPrice') }}
                            </template>
                        </t-list-item>
                        <t-list-item
                            v-for="(item, index) in currentSkus"
                            :key="index"
                        >
                            {{ item.barcode }}
                            <template #action>
                                <t-input
                                    v-model="item[property]"
                                    size="small"
                                    align="center"
                                />
                            </template>
                        </t-list-item>
                    </t-list>
                </template>
            </t-popup>
        </template>
    </t-list-item>
</template>

<script setup>
import { getString } from "../../i18n/index.js"

const props = defineProps({
    skus: {
        type: Array,
        required: true,
        default: () => []
    },
    property: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})
const emit = defineEmits(['update:skus'])

const currentSkus = ref([])
currentSkus.value = props.skus
watch(props.skus, () => {
    currentSkus.value = props.skus
})
watch(currentSkus.value , (newVal) => {
    emit('update:skus', newVal)
})
</script>

<style scoped>

</style>