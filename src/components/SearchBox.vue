<template>
    <t-input
    v-if="$route.name !== 'login'"
    ref="searchBox"
    class="search-box"
    v-model="searchValue"
    :placeholder="getContent('search')"
    :style="{ width: searchWidth + 'px', marginRight: '20px', transition: 'all .3s' }"
    @focus="searchWidth = 270"
    @blur="searchWidth = 200"
    @enter="() => {
        searchBox.blur()
        searchWidth = 200
        $emit('search', searchValue)
    }"
    :clearable="true"
    >
        <template #prefixIcon>
            <t-icon name="search" :style="{ cursor: 'pointer' }" />
        </template>
        <template #suffixIcon>
            <t-icon name="command" />
            <t-icon name="plus" />
            <t-icon name="letters-k" />
        </template>
    </t-input>
</template>

<script setup>
import {getContent} from "../i18n/index.js"

const emit = defineEmits(['search'])

const searchBox = ref(null)
const searchValue = ref(null)
const searchWidth = ref(200)

onMounted(() => {
    document.addEventListener('keydown', function(event) {
        if(event.ctrlKey && event.key === 'k') {
            searchBox.value['focus']()
            event.preventDefault()
        }
    })
})
</script>

<style>

</style>