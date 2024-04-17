<template>
    <div class="logo" title="LOGO" @click="() => {
        if(user.inform){
            $router.push('/')
        }
    }">
        <img src="../assets/logo.png" class="logo-image"  alt="logo">
        <span class="logo-text">
            {{ getString('websiteName') }}
        </span>
    </div>
</template>

<script setup>
import {getString} from "../i18n/index.js"
const i18n = inject('i18n')
const user = inject('user')
</script>

<style>
.logo {
    cursor: pointer;
    user-select: none;
}
</style>