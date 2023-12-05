<template>
    <div class="login-wrapper">
        <header-component />
        <div class="login-container">
            <div data-v-d8f37094="" class="title-container">
                <div data-v-d8f37094="" class="title margin-no">{{ i18n.logto[lang] }}</div>
                <div data-v-d8f37094="" class="title">Miaostreet Sales Analysis</div>
                <div data-v-d8f37094="" class="sub-title">
                    <p data-v-d8f37094="" class="tip">{{ i18n.administratorManagement[lang] }}</p>
                </div>
            </div>
            <t-form :colon="true" :label-width="0" v-if="mode == 1" @submit="login">
                <t-form-item name="account">
                    <t-input ref="accountInput" v-model="account" :placeholder="i18n.accountWidthUsername[lang]" @enter="() => {
                        $refs.accountInput.blur()
                        $refs.passwordInput.focus()
                    }">
                        <template #prefix-icon>
                            <t-icon name="user-circle" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item name="password">
                    <t-input ref="passwordInput" v-model="password" type="password" :placeholder="i18n.password[lang]" @enter="() => {
                        $refs.passwordInput.blur()
                        login()
                    }">
                        <template #prefix-icon>
                            <t-icon name="lock-on" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item>
                    <t-button theme="primary" type="submit" block>{{ i18n.login[lang] }}</t-button>
                </t-form-item>
                <t-form-item>
                    <t-link theme="primary" @click="mode = 2">{{ i18n.changeMode2[lang] }}</t-link>
                </t-form-item>
            </t-form>
            <t-form :colon="true" :label-width="0" v-if="mode == 2" @submit="login">
                <t-form-item name="account">
                    <t-input ref="phoneInput" v-model="account" :placeholder="i18n.account[lang]" @enter="() => {
                        $refs.phoneInput.blur()
                        sendVerifyCode()
                    }">
                        <template #prefix-icon>
                            <t-icon name="mobile" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item name="password">
                    <t-input ref="codeInput" v-model="code" :placeholder="i18n.code[lang]" @enter="() => {
                        $refs.codeInput.blur()
                        login()
                    }" style="margin-right: 10px;">
                        <template #prefix-icon>
                            <t-icon name="data-display" />
                        </template>
                    </t-input>
                    <t-button
                    theme="primary"
                    @click="sendVerifyCode"
                    :loading="codeSendLd"
                    :disabled="codeSendCd > 0"
                    style="min-width: 135px;"
                    >
                        {{ codeSendCd > 0 ? codeSendCd + 's' + i18n.secondReSend[lang] : i18n.sendCode[lang] }}
                    </t-button>
                </t-form-item>
                <t-form-item>
                    <t-button theme="primary" type="submit" block >{{ i18n.login[lang] }}</t-button>
                </t-form-item>
                <t-form-item>
                    <t-link theme="primary" @click="mode = 1">{{ i18n.changeMode1[lang] }}</t-link>
                </t-form-item>
            </t-form>
        </div>
    </div>
</template>

<script>
import { sendCode, translate, verifyUser } from '../../hooks'
import headerComponent from '../../components/header.vue'

export default {
    components: {
        headerComponent
    },
    setup(){
        const serve = inject('serve')
        const i18n = inject('i18n')
        const lang = ref('zh')
        lang.value = i18n.language
        const user = inject('user')
        watch(() => i18n.language, () => {
            lang.value = i18n.language
        })

        const mode = ref(1)
        const account = ref(null)
        const password = ref(null)
        const verifyId = ref(null)
        const code = ref(null)

        const codeSendCd = ref(0)
        const codeSendLd = ref(false)
        const sendVerifyCode = async () => {
            codeSendLd.value = true
            sendCode(serve, account.value, lang.value)
            .then(response => {
                if(response.result){
                    MessagePlugin.success(i18n.sended[lang.value])
                    codeSendCd.value = 60
                    let timer = setInterval(() => {
                        codeSendCd.value--
                        if(codeSendCd.value <= 0){
                            clearInterval(timer)
                            codeSendCd.value = 0
                        }
                        verifyId.value = response.verify_id
                        codeInput.value.focus()
                    }, 1000)
                } else {
                    translate(response.error, lang.value)
                    .then(res => {
                        MessagePlugin.error(res.trans_result[0].dst)
                    })
                    .catch(() => {
                        MessagePlugin.error(response.error)
                    })
                }
                codeSendLd.value = false
            })
            .catch(error => {
                MessagePlugin.error(error)
                codeSendLd.value = false
            })
        }

        const accountInput = ref(null)
        const passwordInput = ref(null)
        const phoneInput = ref(null)
        const codeInput = ref(null)

        const loginReq = (url) => {
            return new Promise((resolve, reject) => {
                fetch(url)
                .then(response => {
                    return resolve(response.json())
                })
                .catch(() => {
                    return reject(i18n.logFail[lang.value])
                })
            })
        }
        const router = useRouter()
        const login = async () => {
            let fun = mode.value == 1 ? 'password' : 'code'
            let url = serve + '/user/login/by' + fun + '?'

            if(account.value == null || account.value == ''){
                MessagePlugin.error(i18n.accountEmpty[lang.value])
                return
            }
            if(mode.value == 1){
                if(password.value == null || password.value == ''){
                    MessagePlugin.error(i18n.passwordEmpty[lang.value])
                    return
                }
                url += 'account=' + account.value + '&' + 'password=' + password.value
            } else {
                if(verifyId.value == null){
                    MessagePlugin.error(i18n.notSendToLog[lang.value])
                    return
                }
                if(code.value == null || code.value.length != 6){
                    MessagePlugin.error(i18n.codeError[lang.value])
                    return
                }
                url += 'target=' + account.value + '&' + 'verify-id=' + verifyId.value + '&' + 'code=' + code.value
            }

            loginReq(url)
            .then(response => {
                if(response.result){
                    MessagePlugin.success(i18n.loged[lang.value])
                    localStorage.setItem('access_token', response.token)

                    setTimeout(() => {
                        loginVerify()
                    }, 100)
                } else {
                    translate(response.error, lang.value)
                    .then(res => {
                        MessagePlugin.error(res.trans_result[0].dst)
                    })
                    .catch(() => {
                        MessagePlugin.error(response.error)
                    })
                }
            })
            .catch(error => {
                MessagePlugin.error(error)
            })
        }
        const loginVerify = () => {
            verifyUser(serve)
            .then(res => {
                user.inform = res.user
                user.status = 'loged'
                localStorage.setItem('user', JSON.stringify(res.user))
                router.push('/')
            })
        }

        return {
            lang,
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