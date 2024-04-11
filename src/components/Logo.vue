<template>
    <div class="logo" title="LOGO" @click="$router.push('/')">
        <img src="../assets/logo.png" class="logo-image"  alt="logo">
        <span class="logo-text">
            {{ getContent('websiteName') }}
        </span>
    </div>
</template>

<script>
import {getString} from "../i18n/index.js"

export default {
    methods: {getContent: getString},
    setup(){
        const i18n = inject('i18n')
        return { i18n }
    }
}
</script>

<style>
.logo {
    cursor: pointer;
    user-select: none;
}
</style>