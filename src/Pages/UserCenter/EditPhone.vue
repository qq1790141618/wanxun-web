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
                {{ getString('edit') }}
                {{ getString('phone') }}

                <t-button
                    @click="async () => {
                    await closeDialog()
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
                <t-step-item :content="getString('edit') + getString('phone')" />
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
                    action="ChangePhoneBind"
                    @verified="(token) => {
                    authToken = token
                    current = 2
                }"
                />

                <div v-if="current === 2">
                    <t-row style="width: calc(100% - 12px);" :gutter="[12, 12]">
                        <t-col :span="12">
                            <t-input
                                v-model="newPhone"
                                :input-props="{
                                label: getString('newPhone')
                            }"
                            ></t-input>
                        </t-col>
                        <t-col :span="8">
                            <t-input
                                :label="getString('verifycode')"
                                v-model="code"
                                :placeholder="getString('code')"
                            >
                            </t-input>
                        </t-col>
                        <t-col :span="4">
                            <t-button
                                theme="primary"
                                @click="sendVerifyCode"
                                :loading="codeSendLd"
                                :disabled="codeSendCd > 0"
                                :block="true"
                            >
                                {{
                                    codeSendCd > 0 ? codeSendCd + 's' + getString('secondReSend') : getString('sendCode')
                                }}
                            </t-button>
                        </t-col>
                        <t-col :span="12">
                            <t-button @click="changeToNew" :loading="changeLoading">
                                {{ getString('confirm') }}
                            </t-button>
                        </t-col>
                    </t-row>
                </div>

                <div v-if="current === 3" style="text-align: center; margin-top: 20px;">
                    <t-icon name="check-circle" size="80px" color="var(--td-success-color)" />
                    <div style="margin: 10px 0; font-size: 14px;">
                        {{ getString('phoneHasChanged') }}!
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
import {getString} from "../../i18n/index.js"
import {MessagePlugin} from "tdesign-vue-next"
import {tips} from "../../hooks/tips.js"
import service from "../../api/service.js"
import {getToken} from "../../hooks/user.js"

const user = inject('user')
const serve = inject('serve')

const visible = ref(false)
const current = ref(0)

const open = async () => {
    current.value = 0
    visible.value = true
}

const closeDialog = () => {
    return new Promise((resolve, reject) => {
        if(current.value === 3){
            return resolve(true)
        }
        const confirmDialog = DialogPlugin.confirm({
            header: getString('closeDialog'),
            body: getString('confirmCloseDialog'),
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

const newPhone  = ref(null)
const verifyId = ref(null)
const code = ref(null)

const changeLoading = ref(false)
const authToken = ref(null)
const pattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

const changeToNew = async () => {
    if(newPhone.value.length < 6 || !pattern.test(newPhone.value)){
        await MessagePlugin.error(getString('newPhoneError'))
        return
    }
    if(verifyId.value == null){
        await MessagePlugin.error(getString('notSendToLog'))
        return
    }
    if(code.value == null || code.value.length !== 6){
        await MessagePlugin.error(getString('codeError'))
        return
    }

    changeLoading.value = true

    let res = await service.api.userS.changeBind(authToken.value, 'phone', newPhone.value, verifyId.value, code.value)
    if(res.result){
        await MessagePlugin.success(getString('editSuccess'))
        current.value++

        service.api.user.inform(getToken())
            .then(res => {
                user.inform = res.content.user
                localStorage.setItem('user', JSON.stringify(user.inform))
            })
    } else {
        tips(res.error.message, 'error')
    }

    changeLoading.value = false
}

const codeSendCd = ref(0)
const codeSendLd = ref(false)
const sendVerifyCode = async () => {
    codeSendLd.value = true

    let response = await service.api.user.codeSend(newPhone.value)
    if(response.result){
        await MessagePlugin.success(getString('sended'))
        codeSendCd.value = 60
        let timer = setInterval(() => {
            codeSendCd.value--
            if(codeSendCd.value <= 0){
                clearInterval(timer)
                codeSendCd.value = 0
            }
            verifyId.value = response.content['verify_id']
        }, 1000)
    } else {
        tips(response.error, 'error')
    }

    codeSendLd.value = false
}

defineExpose({ open })
</script>

<style>

</style>