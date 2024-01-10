<template>
    <div style="padding: 7px 24px;">
        <t-space align="center">
            {{ i18n.chooseVerifyMode[i18n.language] }}:
            <t-select
            v-model="m"
            style="width: 220px;"
            >
                <t-option
                v-if="usePassword || usePassword === ''"
                :label="i18n.oldPasswordVerification[i18n.language]"
                :value="0"
                >
                </t-option>
                <t-option
                :label="i18n.mobilePhoneVerification[i18n.language]"
                :value="1"
                >
                </t-option>
                <t-option
                :label="i18n.emailVerification[i18n.language]"
                :value="2"
                >
                </t-option>
            </t-select>
        </t-space>

        <div>
        </div>

        <t-space align="center" v-if="m == 0" style="margin: 10px 0;">
            {{ i18n.oldPassword[i18n.language] }}:
            <t-input style="width: 270px;" type="password" v-model="oldPassword" ></t-input>
        </t-space>

        <t-space align="center" v-if="m == 1" style="margin-top: 10px;">
            {{ i18n.phone[i18n.language] }}:
            {{ user.inform.phone }}
        </t-space>
        <div>
        </div>
        <t-space align="center" v-if="m == 1" style="margin-bottom: 10px;">
            {{ i18n.code[i18n.language] }}:
            <t-input style="width: 160px;" v-model="phone.code" :maxlength="6" ></t-input>
            <t-button @click="sendVCode" :loading="phone.ld" :disabled="phone.cd > 0" >
                {{ phone.cd > 0 ? phone.cd + 's' + i18n.secondReSend[lang] : i18n.sendCode[i18n.language] }}
            </t-button>
        </t-space>

        <t-space align="center" v-if="m == 2" style="margin-top: 10px;">
            {{ i18n.mail[i18n.language] }}:
            {{ user.inform.mail }}
        </t-space>
        <div>
        </div>
        <t-space align="center" v-if="m == 2" style="margin-bottom: 10px;">
            {{ i18n.code[i18n.language] }}:
            <t-input style="width: 160px;" v-model="mail.code" :maxlength="6" ></t-input>
            <t-button @click="sendVCode" :loading="mail.ld" :disabled="mail.cd > 0" >
                {{ mail.cd > 0 ? mail.cd + 's' + i18n.secondReSend[i18n.language] : i18n.sendCode[i18n.language] }}
            </t-button>
        </t-space>

        <div>
        </div>

        <t-button @click="check">
            {{ i18n.nextStep[i18n.language] }}
        </t-button>
    </div>
</template>

<script>
import { sendCode, translate, verifyUser } from '../../hooks'
import md5 from 'md5'

export default {
    props: ['use-password'],
    emits: ['verified'],
    setup(props, { emit }) {
        const i18n = inject('i18n')
        const user = inject('user')
        const serve = inject('serve')
        const m = ref(0)

        const oldPassword = ref('')
        const phone = ref({
            number: '',
            vid: '',
            code: '',
            cd: '',
            ld: false
        })
        const mail = ref({
            number: '',
            vid: '',
            code: '',
            cd: '',
            ld: false
        })

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
        const check = async () => {
            if(m.value == 0){
                let op = md5(oldPassword.value)

                if(op === user.inform.password){
                    emit('verified')
                } else {
                    MessagePlugin.error(i18n.oldPasswordError[i18n.language])
                }

                return
            }

            let info 
            if(m.value == 1){
                info = phone.value
            }
            if(m.value == 2){
                info = mail.value
            }

            if(!info.vid){
                MessagePlugin.error(i18n.notSendToLog[i18n.language])
                return
            }
            if(info.code == null || info.code.length != 6){
                MessagePlugin.error(i18n.codeError[i18n.language])
                return
            }

            let url = serve + '/user/login/bycode?'
            url += 'target=' + info.number + '&' + 'verify-id=' + info.vid + '&' + 'code=' + info.code

            loginReq(url)
            .then(response => {
                if(response.result){
                    emit('verified')
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
        const sendVCode = async () => {
            let account
            if(m.value == 1){
                phone.value.number = user.inform.phone
                phone.value.ld = true
                account = phone.value.number
            }
            if(m.value == 2){
                mail.value.number = user.inform.mail
                mail.value.ld = true
                account = mail.value.number
            }
            
            sendCode(serve, account, i18n.language)
            .then(response => {
                if(response.result){
                    MessagePlugin.success(i18n.sended[i18n.language])

                    if(m.value == 1){
                        phone.value.cd = 60
                        phone.value.vid = response.verify_id

                        let timer = setInterval(() => {
                            phone.value.cd--
                            if(phone.value.cd <= 0){
                                clearInterval(timer)
                                phone.value.cd = 0
                            }
                        }, 1000)
                    }

                    if(m.value == 2){
                        mail.value.cd = 60
                        mail.value.vid = response.verify_id

                        let timer = setInterval(() => {
                            mail.value.cd--
                            if(mail.value.cd <= 0){
                                clearInterval(timer)
                                mail.value.cd = 0
                            }
                        }, 1000)
                    }
                    
                    phone.value.ld = false
                    mail.value.ld = false
                } else {
                    translate(response.error, i18n.language)
                    .then(res => {
                        MessagePlugin.error(res.trans_result[0].dst)
                    })
                    .catch(() => {
                        MessagePlugin.error(response.error)
                    })
                    
                    phone.value.ld = false
                    mail.value.ld = false
                }
            })
            .catch(error => {
                MessagePlugin.error(error)
                phone.value.ld = false
                mail.value.ld = false
            })
        }

        onMounted(() => {
            if(!props.usePassword && props.usePassword !== ''){
                m.value = 1
            }
        })

        return {
            i18n,
            m,
            check,
            oldPassword,
            phone,
            mail,
            user,
            sendVCode
        }
    }
}
</script>

<style>

</style>