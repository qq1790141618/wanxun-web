<template>
    <router-view v-slot="{ Component }" >
        <keep-alive>
            <component :is="Component" :key="$route.meta.key" v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <component :is="Component" :key="$route.meta.key" v-if="!$route.meta.keepAlive"/>
    </router-view>
</template>

<script>
export default {

}
</script>

<style>

</style>