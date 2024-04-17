<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    :close-btn="false"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    width="800px"
    :destroy-on-close="true"
    >
        <template #header>
            <div style="width: 100%;">
                {{ getString('editPassword') }}

                <t-button
                @click="async () => {
                    await close()
                    visible = false
                }"
                shape="square"
                variant="text"
                size="small"
                style="float: right;"
                >
                    <template #icon>
                        <t-icon name="close" />
                    </template>
                </t-button>
            </div>
        </template>

        <div
        style="display: flex;
        gap: 12px;"
        >
            <t-steps
            layout="vertical"
            theme="dot"
            :current="current"
            :readonly="true"
            style="flex-shrink: 0;"
            >
                <t-step-item :content="getString('verifyEnvironmentalSecurity')" />
                <t-step-item :content="getString('verifyIndentiy')" />
                <t-step-item :content="getString('editPassword')" />
                <t-step-item :content="getString('result')" />
            </t-steps>

            <div
            class="content"
            style="width: 100%;"
            >
                <EnvironmentalSecurity
                v-if="current === 0"
                @verified="current = 1"
                @close="visible = false"
                />

                <OpenAuthentication
                v-if="current === 1"
                action="ChangePassword"
                @verified="(token) => {
                    authToken = token
                    current = 2
                }"
                />

                <div v-if="current === 2">
                    <t-space align="center">
                        {{ getString('newPassword') }}:
                        <t-input style="width: 340px;" type="password" v-model="newPassword" ></t-input>
                    </t-space>
                    <t-button @click="changeToNew" :loading="changeLoading" style="margin-top: 5px;">
                        {{ getString('confirm') }}
                    </t-button>
                </div>

                <div v-if="current === 3" style="text-align: center; margin-top: 20px;">
                    <t-icon name="check-circle" size="80px" color="var(--td-success-color)" />
                    <div style="margin: 10px 0; font-size: 14px;">
                        {{ getString('passwordHasChanged') }}!
                    </div>
                    <t-button @click="visible = false">
                        <template #icon>
                            <t-icon name="close" />
                        </template>
                        {{ getString('close') }}
                    </t-button>
                </div>
            </div>
        </div>
    </t-dialog>
</template>

<script setup>
import EnvironmentalSecurity from './EnvironmentalSecurity.vue'
import OpenAuthentication from './OpenAuthentication.vue'
import {getString} from "../../i18n/index.js";
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next";
import {tips} from "../../hooks/tips.js";
import service from "../../api/service.js";

const user = inject('user')

const visible = ref(false)
const current = ref(0)

const open = async () => {
    current.value = 0
    visible.value = true
}

const close = () => {
    return new Promise((resolve, reject) => {
        if(current.value === 3){
            return resolve(true)
        }
        const confirmDialog = DialogPlugin.confirm({
            header: getString('closeDialog'),
            body: getString('confirmCloseDialog'),
            confirmBtn: getString('confirm'),
            cancelBtn: getString('close'),
            onConfirm: () => {
                confirmDialog.destroy()
                return resolve(true)
            },
            onCancel: () => {
                confirmDialog.destroy()
                return reject(false)
            }
        })
    })
}

const newPassword  = ref('')
const changeLoading = ref(false)
const authToken = ref(null)

const changeToNew = async () => {
    if(newPassword.value.length < 6){
        await MessagePlugin.error(getString('newPasswordError'))
        return
    }
    changeLoading.value = true

    let res = await service.api.userS.changePassword(authToken.value, newPassword.value)
    if(res.result){
        await MessagePlugin.success(getString('editSuccess'))
        current.value++
    } else {
        tips(res.error.message, 'error')
    }

    changeLoading.value = false
}

defineExpose({ open })
</script>

<style>

</style>