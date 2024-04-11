<template>
    <div class="login-wrapper">
        <header-component />
        <div class="login-container">
            <div class="title-container">
                <div class="title margin-no">{{ getString('logto') }}</div>
                <div class="title">Miaostreet Sales Analysis</div>
                <div class="sub-title">
                    <p class="tip">
                        {{ getString('administratorManagement') }}
                        <t-icon name="scan" style="cursor: pointer; margin-left: 5px;" v-if="mode !== 3" @click="mode = 3" />
                    </p>
                </div>
            </div>
            <t-form :colon="true" :label-width="0" v-if="mode === 1" @submit="login">
                <t-form-item name="account">
                    <t-input ref="accountInput" v-model="account" :placeholder="getString('accountWidthUsername')" @enter="() => {
                        $refs.accountInput.blur()
                        $refs.passwordInput.focus()
                    }">
                        <template #prefix-icon>
                            <t-icon name="user-circle" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item name="password">
                    <t-input ref="passwordInput" v-model="password" type="password" :placeholder="getString('password')" @enter="() => {
                        $refs.passwordInput.blur()
                        login()
                    }">
                        <template #prefix-icon>
                            <t-icon name="lock-on" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item>
                    <t-button theme="primary" type="submit" :block="true">{{ getString('login') }}</t-button>
                </t-form-item>
                <t-form-item>
                    <t-link theme="primary" @click="mode = 2">{{ getString('changeMode1') }}</t-link>
                </t-form-item>
            </t-form>
            <t-form :colon="true" :label-width="0" v-if="mode === 2" @submit="login">
                <t-form-item name="account">
                    <t-input ref="phoneInput" v-model="account" :placeholder="getString('account')" @enter="() => {
                        $refs.phoneInput.blur()
                        sendVerifyCode()
                    }">
                        <template #prefix-icon>
                            <t-icon name="mobile" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item name="password">
                    <t-input ref="codeInput" v-model="code" :placeholder="getString('code')" @enter="() => {
                        $refs.codeInput.blur()
                        login()
                    }" style="margin-right: 10px;">
                        <template #prefix-icon>
                            <t-icon name="data-display" />
                        </template>
                    </t-input>
                    <t-button
                    theme="primary"
                    @click="() => {
                        $refs.codeInput.focus()
                        sendVerifyCode()
                    }"
                    :loading="codeSendLd"
                    :disabled="codeSendCd > 0"
                    style="min-width: 135px;"
                    >
                        {{ codeSendCd > 0 ? codeSendCd + 's' + getString('secondReSend') : getString('sendCode') }}
                    </t-button>
                </t-form-item>
                <t-form-item>
                    <t-button theme="primary" type="submit" :block="true">{{ getString('login') }}</t-button>
                </t-form-item>
                <t-form-item>
                    <t-link theme="primary" @click="mode = 1">{{ getString('changeMode2') }}</t-link>
                </t-form-item>
            </t-form>
            <div v-if="mode === 3">
                <ScanCard />
                <t-link theme="primary" @click="mode = 1">{{ getString('changeMode2') }}</t-link>
            </div>
        </div>
    </div>
</template>

<script>
import headerComponent from '../../components/header.vue'
import ScanCard from './ScanCard.vue'
import service from "../../api/service.js"
import {MessagePlugin} from "tdesign-vue-next"
import {useRouter} from "vue-router"
import {tips} from "../../hooks/tips.js"
import {getString} from "../../i18n/index.js"

export default {
    methods: {getString},
    components: {
        headerComponent,
        ScanCard
    },
    setup(){
        const i18n = inject('i18n')
        const user = inject('user')

        const mode = ref(1)
        const account = ref(null)
        const password = ref(null)
        const verifyId = ref(null)
        const code = ref(null)

        const codeSendCd = ref(0)
        const codeSendLd = ref(false)
        const sendVerifyCode = async () => {
            codeSendLd.value = true
            service.api.user.codeSend(account.value)
                .then(response => {
                    if(response.result){
                        getString('sended')
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
                        tips(response.error.message, 'error')
                    }
                    codeSendLd.value = false
                })
                .catch(error => {
                    console.error(error)
                    codeSendLd.value = false
                })
        }

        const accountInput = ref(null)
        const passwordInput = ref(null)
        const phoneInput = ref(null)
        const codeInput = ref(null)

        const router = useRouter()
        const login = async () => {
            if(account.value == null || account.value === ''){
                await MessagePlugin.error(getString('accountEmpty'))
                return
            }
            if(mode.value === 1){
                if(password.value == null || password.value === ''){
                    await MessagePlugin.error(getString('passwordEmpty'))
                    return
                }
                service.api.user.passwordLogin(account.value, password.value)
                    .then(response => loginThen(response))
                    .catch(error => MessagePlugin.error(error))
            } else {
                if(verifyId.value == null){
                    await MessagePlugin.error(getString('notSendToLog'))
                    return
                }
                if(code.value == null || code.value.length !== 6){
                    await MessagePlugin.error(getString('codeError'))
                    return
                }
                service.api.user.verifyCodeLogin(account.value, verifyId.value, code.value)
                    .then(response => loginThen(response))
                    .catch(error => MessagePlugin.error(error))
            }
        }
        const loginThen = (response) => {
            if(response.result){
                MessagePlugin.success(getString('loged'))

                const token = response.content['token']
                localStorage.setItem('access_token', token)
                location.href = location.origin
            } else {
                tips(response.error.message, 'error')
            }
        }

        return {
            i18n,

            account,
            password,
            verifyId,
            code,
            mode,

            sendVerifyCode,
            codeSendCd,
            codeSendLd,

            accountInput,
            passwordInput,
            phoneInput,
            codeInput,

            login
        }
    }
}
</script>

<style scoped>
.login-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-size: cover;
    background-position: 100%;
    position: relative;
    background-color: #fff;
    background-image: url('../../assets/assets-login-bg-white.png');
}
.login-container{
    position: absolute;
    top: 27%;
    left: 5%;
    min-height: 500px;
    min-width: 420px;
}
.title-container .title.margin-no {
    margin-top: 0;
}
.title-container .title {
    font-family: 'Rubik', 'Raleway', 'Pingfang SC Medium', 'Pingfang SC Regular', 'Noto sans', 'Quicksand', Arial, sans-serif;
    font-weight: 500;
    font-size: 27px;
    color: var(--td-text-color-primary);
    margin-top: var(--td-comp-margin-xs);
}
.title-container .sub-title {
    margin-top: var(--td-comp-margin-xxl);
}
</style>