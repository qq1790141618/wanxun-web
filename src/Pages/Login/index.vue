<template>
    <div class="login-wrapper">
        <header-component />
        <div class="login-container">
            <div data-v-d8f37094="" class="title-container">
                <div data-v-d8f37094="" class="title margin-no">{{ i18n.logto[i18n.language] }}</div>
                <div data-v-d8f37094="" class="title">Miaostreet Sales Analysis</div>
                <div data-v-d8f37094="" class="sub-title">
                    <p data-v-d8f37094="" class="tip">
                        {{ i18n.administratorManagement[i18n.language] }}
                        <t-icon name="scan" style="cursor: pointer; margin-left: 5px;" @click="mode = 3" />
                    </p>
                </div>
            </div>
            <t-form :colon="true" :label-width="0" v-if="mode == 1" @submit="login">
                <t-form-item name="account">
                    <t-input ref="accountInput" v-model="account" :placeholder="i18n.accountWidthUsername[i18n.language]" @enter="() => {
                        $refs.accountInput.blur()
                        $refs.passwordInput.focus()
                    }">
                        <template #prefix-icon>
                            <t-icon name="user-circle" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item name="password">
                    <t-input ref="passwordInput" v-model="password" type="password" :placeholder="i18n.password[i18n.language]" @enter="() => {
                        $refs.passwordInput.blur()
                        login()
                    }">
                        <template #prefix-icon>
                            <t-icon name="lock-on" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item>
                    <t-button theme="primary" type="submit" block>{{ i18n.login[i18n.language] }}</t-button>
                </t-form-item>
                <t-form-item>
                    <t-link theme="primary" @click="mode = 2">{{ i18n.changeMode2[i18n.language] }}</t-link>
                </t-form-item>
            </t-form>
            <t-form :colon="true" :label-width="0" v-if="mode == 2" @submit="login">
                <t-form-item name="account">
                    <t-input ref="phoneInput" v-model="account" :placeholder="i18n.account[i18n.language]" @enter="() => {
                        $refs.phoneInput.blur()
                        sendVerifyCode()
                    }">
                        <template #prefix-icon>
                            <t-icon name="mobile" />
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item name="password">
                    <t-input ref="codeInput" v-model="code" :placeholder="i18n.code[i18n.language]" @enter="() => {
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
                        {{ codeSendCd > 0 ? codeSendCd + 's' + i18n.secondReSend[i18n.language] : i18n.sendCode[i18n.language] }}
                    </t-button>
                </t-form-item>
                <t-form-item>
                    <t-button theme="primary" type="submit" block >{{ i18n.login[i18n.language] }}</t-button>
                </t-form-item>
                <t-form-item>
                    <t-link theme="primary" @click="mode = 1">{{ i18n.changeMode1[i18n.language] }}</t-link>
                </t-form-item>
            </t-form>
            <div v-if="mode == 3">
                <t-card style="text-align: center; margin-bottom: 5px;" :key="qrcodeV">
                    <QRCodeVue3
                    :width="160"
                    :height="160"
                    :value="'fc3ff98e8c6a0d3087d515c0473f8677' + qrcodeV"
                    :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
                    :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
                    :dotsOptions="{
                        type: 'dots',
                        color: '#0052d9',
                        gradient: {
                        type: 'linear',
                        rotation: 0,
                        colorStops: [
                            { offset: 0, color: '#0052d9' },
                            { offset: 1, color: '#0052d9' },
                        ],
                        },
                    }"
                    :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
                    :cornersDotOptions="{ type: undefined, color: '#000000' }"
                    fileExt="png"
                    :download="false"
                    :downloadOptions="{ name: 'vqr', extension: 'png' }"
                    />
                    使用安卓App扫描二维码
                </t-card>
                <t-link theme="primary" @click="mode = 1">{{ i18n.changeMode1[i18n.language] }}</t-link>
            </div>
        </div>
    </div>
</template>

<script>
import { sendCode, translate, verifyUser } from '../../hooks'
import headerComponent from '../../components/header.vue'
import QRCodeVue3 from "qrcode-vue3"
import { watch } from 'vue'

export default {
    components: {
        headerComponent,
        QRCodeVue3
    },
    setup(){
        const serve = inject('serve')
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
            sendCode(serve, account.value, i18n.language)
            .then(response => {
                if(response.result){
                    MessagePlugin.success(i18n.sended[i18n.language])
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
                    translate(response.error, i18n.language)
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
                    return reject(i18n.logFail[i18n.language])
                })
            })
        }

        const qrcodeV = ref(null)
        const createLoginQRcodeR = async () => {
            return fetch(serve + '/user/scan/create')
            .then(response => {
                return Promise.resolve(response.text())
            })
        }
        const fetchScanedR = async () => {
            return fetch(serve + '/user/scan/get?scan-id=' + qrcodeV.value)
            .then(response => {
                return Promise.resolve(response.json())
            })
        }
        const createLoginQRcode = async () => {
            var res = await createLoginQRcodeR()
            qrcodeV.value = res
        }
        const fetchScaned = async () => {
            var res = await fetchScanedR()
            if(res.access_token && res.access_token != null){
                closeScanViewOpen()
                localStorage.setItem('access_token', res.access_token)
                setTimeout(() => {
                    loginVerify()
                }, 100)
            }
        }
        createLoginQRcode()
        setInterval(() => {
            createLoginQRcode()
        }, 1000 * 60 * 5)
        let timer = null
        const createScanViewOpen = () => {
            timer = setInterval(() => {
                fetchScaned()
            }, 1000)
        }
        const closeScanViewOpen = () => {
            clearInterval(timer)
            timer = null
        }
        watch(() => mode.value, (newVal) => {
            if(newVal == 3){
                createScanViewOpen()
            } else {
                closeScanViewOpen()
            }
        })

        const router = useRouter()
        const login = async () => {
            let fun = mode.value == 1 ? 'password' : 'code'
            let url = serve + '/user/login/by' + fun + '?'

            if(account.value == null || account.value == ''){
                MessagePlugin.error(i18n.accountEmpty[i18n.language])
                return
            }
            if(mode.value == 1){
                if(password.value == null || password.value == ''){
                    MessagePlugin.error(i18n.passwordEmpty[i18n.language])
                    return
                }
                url += 'account=' + account.value + '&' + 'password=' + password.value
            } else {
                if(verifyId.value == null){
                    MessagePlugin.error(i18n.notSendToLog[i18n.language])
                    return
                }
                if(code.value == null || code.value.length != 6){
                    MessagePlugin.error(i18n.codeError[i18n.language])
                    return
                }
                url += 'target=' + account.value + '&' + 'verify-id=' + verifyId.value + '&' + 'code=' + code.value
            }

            loginReq(url)
            .then(response => {
                if(response.result){
                    MessagePlugin.success(i18n.loged[i18n.language])
                    localStorage.setItem('access_token', response.token)

                    setTimeout(() => {
                        loginVerify()
                    }, 100)
                } else {
                    translate(response.error, i18n.language)
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

            login,
            qrcodeV,
            createLoginQRcode
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