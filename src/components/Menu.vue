<template>
    <t-head-menu v-model="activeMenu" expand-type="popup" v-if="$route.name !== 'login'" style="background-color: transparent; overflow-x: auto; overflow-y: hidden;">
        <template
        v-for="item in $router.getRoutes()"
        :key="item.name"
        >
            <t-menu-item
            v-if="(!item.children || item.children.length === 0 || item.meta['hideChild']) && item.meta['menuShow']"
            :value="item.meta['key']"
            @click="$router.push(item.path)"
            >
                <template #icon>
                    <t-icon :name="item.meta['icon']" />
                </template>
                {{ getString(item.meta['title']) }}
                <t-button
                size="small"
                variant="text"
                shape="round"
                @click.stop="collection(item, true)"
                v-if="!collectionPath.map(obj => obj.meta.key).includes(item.meta['key']) && item.path !== '/'"
                class="cl-button"
                >
                    <template #icon>
                        <t-icon name="star" />
                    </template>
                </t-button>
                <t-button
                size="small"
                variant="text"
                shape="round"
                @click.stop="collection(item, false)"
                v-if="collectionPath.map(obj => obj.meta.key).includes(item.meta['key'])"
                class="cl-button"
                >
                    <template #icon>
                        <t-icon name="star-filled" />
                    </template>
                </t-button>
            </t-menu-item>
            <t-submenu
            v-if="item.children && item.children.length > 0 && item.meta['menuShow'] && !item.meta['hideChild']"
            :value="item.meta['key']"
            >
                <template #icon>
                    <t-icon :name="item.meta['icon']" />
                </template>
                <template #title>
                    <span>{{ getString(item.meta['title']) }}</span>
                </template>
                <template
                v-for="subitem in item.children"
                :key="subitem.name"
                >
                    <t-menu-item
                    :value="subitem.meta['key']"
                    @click="$router.push(subitem.path)"
                    v-if="!subitem.meta['hide']"
                    >
                        <template #icon>
                            <t-icon :name="subitem.meta['icon']" />
                        </template>
                        {{ getString(subitem.meta['title']) }}
                        <t-button
                        size="small"
                        variant="text"
                        shape="round"
                        @click.stop="collection(subitem, true)"
                        v-if="!collectionPath.map(obj => obj.meta.key).includes(subitem.meta['key'])"
                        class="cl-button"
                        >
                            <template #icon>
                                <t-icon name="star" />
                            </template>
                        </t-button>
                        <t-button
                        size="small"
                        variant="text"
                        shape="round"
                        @click.stop="collection(subitem, false)"
                        v-if="collectionPath.map(obj => obj.meta.key).includes(subitem.meta['key'])"
                        class="cl-button"
                        >
                            <template #icon>
                                <t-icon name="star-filled" />
                            </template>
                        </t-button>
                    </t-menu-item>
                </template>
            </t-submenu>
        </template>
    </t-head-menu>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router"
import {getString} from "../i18n/index.js"
import service from "../api/service.js";

const route = useRoute()
const router = useRouter()
const collectionPath = ref([])
const activeMenu = ref('1')
const user = inject('user')

const collection = (route, status = true) => {
    if(status){
        collectionPath.value.push({
            name: route.name,
            path: route.path,
            meta: route.meta
        })
    } else {
        collectionPath.value = collectionPath.value.filter(item => item['path'] !== route.path)
    }

    user.inform['web_collection'] = collectionPath.value
    service.api.user.saveUserInform({
        web_collection: collectionPath.value
    })

    const channel = new BroadcastChannel('fixeam_work')
    channel.postMessage('CollectionChange')
}

watch(() => route.path, () => {
    activeMenu.value = route.meta['key']
})

onMounted(() => {
    const channel = new BroadcastChannel('fixeam_work')
    channel.addEventListener('message', function(event) {
        if(event.data === 'UserIsLogin'){
            collectionPath.value = user.inform['web_collection']
        }
        if(event.data === 'CollectionChange'){
            collectionPath.value = user.inform['web_collection']
        }
    })

    setTimeout(() => {
        activeMenu.value = route.meta['key']
    }, 500)
})
</script>

<style>

</style>