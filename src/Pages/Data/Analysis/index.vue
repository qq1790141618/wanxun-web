<template>
    <t-card class="create-analysis">
        <template #header>
            <div>
                <t-image
                :src="$route.meta.avatar"
                style="width: 24px; margin-right: 6px; background-color: transparent; display: inline-block;"
                >
                </t-image>
                <span>
                    {{ $route.meta.title[local.name] }}
                </span>
            </div>
        </template>
        <t-space direction="vertical" style="width: 100%;">
            <t-select
            :label="i18n.store[i18n.language] + ': '"
            v-model="shop.store"
            :options="shop.storeOptions"
            @change="saveOptions"
            ></t-select>
            <t-select
            :label="i18n.brand[i18n.language] + ': '"
            v-model="shop.brand"
            :options="shop.brandOptions"
            @change="saveOptions"
            ></t-select>
        </t-space>
    </t-card>
</template>

<script>
export default {
    setup() {
        const store = ref('HZ13')
        const brand = ref('兔皇')
        const shop = inject('shop')
        const i18n = inject('i18n')

        return {
            store,
            brand,
            shop,

            i18n
        }
    }
}
</script>

<style>
.create-analysis{
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    text-align: center;
}
</style>