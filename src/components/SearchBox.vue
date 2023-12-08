<template>
    <t-input
    v-if="$route.name !== 'login'"
    ref="searchBox"
    class="search-box"
    v-model="searchValue"
    :placeholder="i18n.search[i18n.language]"
    :style="{ width: searchWidth + 'px', marginRight: '20px', transition: 'all .3s' }"
    @focus="searchWidth = 270"
    @blur="searchWidth = 200"
    @enter="() => {
        searchBox.blur()
        searchWidth = 200
        $emit('search', searchValue)
    }"
    clearable
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

<script>
export default {
    emits: ['search'],
    setup(){
        const i18n = inject('i18n')

        const searchBox = ref(null)
        const searchValue = ref(null)
        const searchWidth = ref(200)

        onMounted(() => {
            document.addEventListener('keydown', function(event) {
                if(event.ctrlKey && event.key === 'k') {
                    searchBox.value.focus()
                    event.preventDefault()
                }
            })
        })

        return {
            i18n,
            searchBox,
            searchValue,
            searchWidth
        }
    }
}
</script>

<style>

</style>