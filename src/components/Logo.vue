<template>
    <div class="logo" title="LOGO">
        <img src="../assets/logo.png" class="logo-image" >
        <span class="logo-text">
            {{ i18n.websiteName[i18n.language] }}
        </span>
    </div>
</template>

<script>
export default {
    setup(){
        const i18n = inject('i18n')
        return { i18n }
    }
}
</script>

<style>

</style>