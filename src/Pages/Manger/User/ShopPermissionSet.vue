<template>
    <t-dialog
    v-model:visible="visible"
    :close-on-overlay-click="false"
    :footer="false"
    :close-btn="false"
    >
        <template #header>
            {{ getString('changeUserShopPermissions') }}
        </template>
        <t-checkbox v-model="allowAllOfShop" style="width: 100%;">
            {{ getString('allowAllPermissions') }}
        </t-checkbox>
        <div v-if="!allowAllOfShop">
            <h3>
                {{ getString('storePermissions') }}
            </h3>
            <t-checkbox-group
            v-model:value="allowStore"
            >
                <t-checkbox
                v-for="item in shop.storeOptions"
                :value="item.value"
                >
                    {{ item.label }}
                </t-checkbox>
            </t-checkbox-group>
            <h3>
                {{ getString('brandPermissions') }}
            </h3>
            <t-checkbox-group
            v-model:value="allowBrand"
            >
                <t-checkbox
                v-for="item in shop.brandOptions"
                :value="item.value"
                >
                    {{ item.label }}
                </t-checkbox>
            </t-checkbox-group>
        </div>
        <ConfirmBar
        @confirm="confirm"
        @close="visible = false"
        :noreset="true"
        :confirm-loading="confirmLoading"
        style="margin-top: 20px;"
        />
    </t-dialog>
</template>

<script setup>
import {getString} from "../../../i18n/index.js"
import ConfirmBar from "../../../components/confirmBar.vue"
import service from "../../../api/service.js";
import {tips} from "../../../hooks/tips.js";

const shop = inject('shop')

const visible = ref(false)
const emit = defineEmits(['reload'])
const uid = ref(null)
const allowAllOfShop = ref(false)
const allowStore = ref([])
const allowBrand = ref([])
const tempRow = ref(null)

const open = (row) => {
    uid.value = row['uid']
    allowAllOfShop.value = row['allow_all_shop']
    allowStore.value = row['allow_store']
    allowBrand.value = row['allow_brand']
    tempRow.value = row
    visible.value = true
}

const confirmLoading = ref(false)
const confirm = async () => {
    confirmLoading.value = true

    if(allowAllOfShop.value !== tempRow['allow_all_shop']){
        let res = await service.api.userE.setAllShopAllowedStatus(uid.value, allowAllOfShop.value ? 1 : 0)
        if(!res.result){
            tips(res.error.message, 'error')
            confirmLoading.value = false
            return
        }
    }

    if(!allowAllOfShop.value){
        if(allowStore.value !== tempRow['allow_store']){
            let res = await service.api.userE.setAllowedStore(uid.value, allowStore.value)
            if(!res.result){
                tips(res.error.message, 'error')
                confirmLoading.value = false
                return
            }
        }
        if(allowBrand.value !== tempRow['allow_brand']){
            let res = await service.api.userE.setAllowedBrand(uid.value, allowBrand.value)
            if(!res.result){
                tips(res.error.message, 'error')
                confirmLoading.value = false
                return
            }
        }
    }


    visible.value = false
    confirmLoading.value = false
    tips('操作成功', 'success')
    emit('reload')
}

defineExpose({
    open
})
</script>

<style scoped>

</style>