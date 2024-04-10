<template>
    <div style="padding: 7px 24px;">
        <t-space align="center">
            {{ getContent('chooseVerifyMode') }}:
            <t-select
            v-model="mode"
            style="width: 220px;"
            >
                <t-option
                v-if="action === 'ChangePassword'"
                :label="getContent('oldPasswordVerification')"
                :value="0"
                >
                </t-option>
                <t-option
                :label="getContent('mobilePhoneVerification')"
                :value="1"
                >
                </t-option>
                <t-option
                v-if="user.inform.mail"
                :label="getContent('emailVerification')"
                :value="2"
                >
                </t-option>
            </t-select>
        </t-space>

        <div>
        </div>

        <t-space align="center" v-if="mode === 0" style="margin: 10px 0;">
            {{ getContent('oldPassword') }}:
            <t-input style="width: 270px;" type="password" v-model="oldPassword" ></t-input>
        </t-space>

        <t-space align="center" v-if="mode === 1" style="margin-top: 10px;">
            {{ getContent('phone') }}:
            {{ user.inform.phone }}
        </t-space>
        <t-space align="center" v-if="mode === 2" style="margin-top: 10px;">
            {{ getContent('mail') }}:
            {{ user.inform.mail }}
        </t-space>
        <div>
        </div>
        <t-space v-if="mode !== 0" align="center" style="margin-bottom: 10px;">
            {{ getContent('code') }}:
            <t-input style="width: 160px;" v-model="code" :maxlength="6" ></t-input>
            <t-button @click="sendVCode" :loading="codeSending" :disabled="codeCrash > 0" >
                {{ codeCrash > 0 ? codeCrash + 's' + getContent('secondReSend') : getContent('sendCode') }}
            </t-button>
        </t-space>
        
        <div>
        </div>

        <t-button @click="check">
            {{ getContent('nextStep') }}
        </t-button>
    </div>
</template>

<script setup>
import {getContent} from "../../i18n/index.js"
import {tips} from "../../hooks/tips.js"
import service from "../../api/service.js"

const props = defineProps(['action'])
const emit = defineEmits(['verified'])
const user = inject('user')

const mode = ref(0)
const oldPassword = ref(null)
const vId = ref(null)
const code = ref(null)
const codeSending = ref(false)
const codeCrash = ref(0)

const sendVCode = async () => {
    let type = mode.value === 1 ? 'phone' : 'mail'
    codeSending.value = true
    let res = await service.api.userS.sendCodeFromSelf(type)

    if(!res.result){
        tips(res.error.message, 'error')
    } else {
        vId.value = res.content['verify_id']
        codeCrash.value = 60
        let timer = setInterval(() => {
            codeCrash.value--
            if(codeCrash.value <= 0){
                codeCrash.value = 0
                clearInterval(timer)
            }
        }, 1000)
    }

    codeSending.value = false
}
const checking = ref(false)
const check = async () => {
    if(mode.value === 0){
        if(!oldPassword.value){
            tips('旧密码不能为空', 'error')
            return
        }

        checking.value = true
        let res = await service.api.userS.verifyPassword(oldPassword.value)
        if(!res.result){
            tips(res.error.message, 'error')
            checking.value = false
            return
        }

        emit('verified', res.content['auth_token'])
        checking.value = false
        return
    }

    if(!code.value){
        tips('验证码不能为空', 'error')
        return
    }
    if(!vId.value){
        tips('请先发送验证码', 'error')
        return
    }

    checking.value = true
    let type = mode.value === 1 ? 'phone' : 'mail'
    let res = await service.api.userS.verifyCodeToSet(type, vId.value, code.value, props['action'])
    if(!res.result){
        tips(res.error.message, 'error')
        checking.value = false
        return
    }

    checking.value = false
    emit('verified', res.content['auth_token'])
}

onMounted(() => {
    if(props['action'] !== 'ChangePassword'){
        mode.value = 1
    }
})
</script>

<style>

</style>