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
                {{ getString('mail') }}

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
                <t-step-item :content="getString('edit') + getString('mail')" />
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
                action="ChangeMailBind"
                @verified="() => {
                    current = 2
                }"
                />

                <div v-if="current === 2">
                    <t-row style="width: calc(100% - 12px);" :gutter="[12, 12]">
                        <t-col :span="12">
                            <t-auto-complete
                            v-model="newMail"
                            :options="newMailOptions"
                            @change="onNewMailChange"
                            :input-props="{
                                label: getString('newMail')
                            }"
                            ></t-auto-complete>
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
                        {{ getString('mailHasChanged') }}!
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
import {DialogPlugin, MessagePlugin} from "tdesign-vue-next"
import {tips} from "../../hooks/tips.js"
import {request} from "../../api/request.js";

const user = inject('user')

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

const newMail  = ref(null)
const verifyId = ref(null)
const code = ref(null)

const newMailOptions = ref([])
let timer = null

const onNewMailChange = (value) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
        newMailOptions.value = []
        if(!value || value === '' || value === null){
            return
        }

        let pSet = ['qq.com', '163.com', 'gmail.com', 'sina.com', 'msn.com', 'hotmail.com', 'ask.com', 'live.com', '126.com', '193.com', 'mail.com', 'yahoo.com']

        if(value.includes('@') && value.indexOf('@') !== value.length - 1){
            let suf = value.split('@').pop()

            for (let i = 0; i < pSet.length; i++) {
                if(pSet[i].startsWith(suf)){
                    newMailOptions.value.push(value.replace('@' + suf, '') + '@' + pSet[i])
                }
            }
        } else {
            let cent = '@'
            if(value.includes('@')){
                cent = ''
            }
            newMailOptions.value = pSet.map(val => value + cent + val)
        }
    }, 300)
}

const changeLoading = ref(false)
const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

const changeToNew = async () => {
    if(newMail.value.length < 6 || !pattern.test(newMail.value)){
        await MessagePlugin.error(getString('newMailError'))
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

    let res = await request('/account/change/mail', {
        mail: newMail.value, id: verifyId.value, code: code.value
    })
    if(res.status === 'success'){
        await MessagePlugin.success(getString('editSuccess'))
        user.inform.mail = newMail.value
        current.value++
    } else {
        tips(res.error.message, 'error')
    }

    changeLoading.value = false
}

const codeSendCd = ref(0)
const codeSendLd = ref(false)
const sendVerifyCode = async () => {
    codeSendLd.value = true

    let response = await request('/user/sendcode', { target: newMail.value })
    if(response.status === 'success'){
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