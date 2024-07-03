<template>
    <div class="splash-view position-in-center">
        <div class="first-title">
            <img src="../assets/logo.png" class="first-title-logo"  alt=""/>
            <span>
                欢迎使用万寻喵街数据分析!
            </span>
        </div>
        <div class="second-title">
            Copyright © fixeam.com. All Rights Reserved. By Limit Au.
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.splash-view {
    text-align: center;
    color: black;
}
.first-title {
    font-size: 18px;
    display: flex;
    margin: 10px auto;
}
.first-title-logo {
    margin-right: 5px;
    width: 24px;
}
.first-title-logo,
.first-title span {
    vertical-align: middle;
}
.second-title {
    font-size: 11px;
}
</style>