<template>
    <div style="padding: 7px 24px;">
        <t-space align="center">
            {{ getString('chooseVerifyMode') }}:
            <t-select
            v-model="mode"
            style="width: 220px;"
            >
                <t-option
                v-if="action === 'ChangePassword'"
                :label="getString('oldPasswordVerification')"
                :value="0"
                >
                </t-option>
                <t-option
                :label="getString('mobilePhoneVerification')"
                :value="1"
                >
                </t-option>
                <t-option
                v-if="user.inform.mail"
                :label="getString('emailVerification')"
                :value="2"
                >
                </t-option>
            </t-select>
        </t-space>

        <div>
        </div>

        <t-space align="center" v-if="mode === 0" style="margin: 10px 0;">
            {{ getString('oldPassword') }}:
            <t-input style="width: 270px;" type="password" v-model="oldPassword" ></t-input>
        </t-space>

        <t-space align="center" v-if="mode === 1" style="margin-top: 10px;">
            {{ getString('phone') }}:
            {{ user.inform.phone }}
        </t-space>
        <t-space align="center" v-if="mode === 2" style="margin-top: 10px;">
            {{ getString('mail') }}:
            {{ user.inform.mail }}
        </t-space>
        <div>
        </div>
        <t-space v-if="mode !== 0" align="center" style="margin-bottom: 10px;">
            {{ getString('code') }}:
            <t-input style="width: 160px;" v-model="code" :maxlength="6" ></t-input>
            <t-button @click="sendVCode" :loading="codeSending" :disabled="codeCrash > 0" >
                {{ codeCrash > 0 ? codeCrash + 's' + getString('secondReSend') : getString('sendCode') }}
            </t-button>
        </t-space>
        
        <div>
        </div>

        <t-button @click="check">
            {{ getString('nextStep') }}
        </t-button>
    </div>
</template>

<script setup>
import {getString} from "../../i18n/index.js"
import {tips} from "../../hooks/tips.js"
import service from "../../api/service.js"
import {request} from "../../api/request.js";

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
    let res = await request('/account/sendcode/self', { mode: type })

    if(res.status !== 'success'){
        tips(res.error.msg, 'error')
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
        let res = await request('/account/verify/password', { password: oldPassword.value })
        if(res.status !== 'success'){
            tips(res.error.msg, 'error')
            checking.value = false
            return
        }

        emit('verified')
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
    let res = await request('/account/verify/code', {
        mode: type,
        id: vId.value,
        code: code.value,
        operate: props['action']
    })
    if(res.status !== 'success'){
        tips(res.error.msg, 'error')
        checking.value = false
        return
    }

    checking.value = false
    emit('verified')
}

onMounted(() => {
    if(props['action'] !== 'ChangePassword'){
        mode.value = 1
    }
})
</script>

<style>

</style>