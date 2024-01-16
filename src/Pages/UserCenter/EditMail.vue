<template>
    <t-dialog
    v-model:visible="visible"
    :footer="false"
    :close-btn="false"
    :close-on-esc-keydown="false"
    :close-on-overlay-click="false"
    width="600px"
    destroy-on-close
    >
        <template #header>
            <div style="width: 100%;">
                {{ i18n.edit[i18n.language] }}
                {{ i18n.mail[i18n.language] }}

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
            readonly
            style="flex-shrink: 0;"
            >
                <t-step-item :content="i18n.verifyEnvironmentalSecurity[i18n.language]" />
                <t-step-item :content="i18n.verifyIndentiy[i18n.language]" />
                <t-step-item :content="i18n.edit[i18n.language] + i18n.mail[i18n.language]" />
                <t-step-item :content="i18n.result[i18n.language]" />
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
                @verified="current = 2"
                />

                <div v-if="current === 2">
                    <t-row style="width: calc(100% - 12px);" :gutter="[12, 12]">
                        <t-col :span="12">
                            <t-auto-complete
                            v-model="newMail"
                            :options="newMailOptions"
                            @change="onNewMailChange"
                            :input-props="{
                                label: i18n.newMail[i18n.language]
                            }"
                            ></t-auto-complete>
                        </t-col>
                        <t-col :span="8">
                            <t-input
                            :label="i18n.verifycode[i18n.language]"
                            v-model="code"
                            :placeholder="i18n.code[i18n.language]"
                            >
                            </t-input>
                        </t-col>
                        <t-col :span="4">
                            <t-button
                            theme="primary"
                            @click="sendVerifyCode"
                            :loading="codeSendLd"
                            :disabled="codeSendCd > 0"
                            block
                            >
                                {{ codeSendCd > 0 ? codeSendCd + 's' + i18n.secondReSend[i18n.language] : i18n.sendCode[i18n.language] }}
                            </t-button>
                        </t-col>
                        <t-col :span="12">
                            <t-button @click="changeToNew" :loading="changeLoading">
                                {{ i18n.confirm[i18n.language] }}
                            </t-button>
                        </t-col>
                    </t-row>
                </div>

                <div v-if="current === 3" style="text-align: center; margin-top: 20px;">
                    <t-icon name="check-circle" size="80px" color="var(--td-success-color)" />
                    <div style="margin: 10px 0; font-size: 14px;">
                        {{ i18n.mailHasChanged[i18n.language] }}!
                    </div>
                    <t-button @click="visible = false">
                        <template #icon>
                            <t-icon name="close" />
                        </template>
                        {{ i18n.close[i18n.language] }}
                    </t-button>
                </div>
            </div>
        </div>
    </t-dialog>
</template>

<script>
import { updateUser, translate, sendCode } from '../../hooks'
import EnvironmentalSecurity from './EnvironmentalSecurity.vue'
import OpenAuthentication from './OpenAuthentication.vue'

export default {
    components: {
        OpenAuthentication,
        EnvironmentalSecurity
    },
    setup(){
        const i18n = inject('i18n')
        const user = inject('user')
        const serve = inject('serve')

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
                    header: '关闭对话框',
                    body: '操作尚未完成，确认关闭当前对话框？关闭后编辑内容将消失',
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
        const timer = ref(null)
        const onNewMailChange = (value) => {
            clearTimeout(timer.value)
            timer.value = setTimeout(() => {
                newMailOptions.value = []
                if(!value || value === '' || value === null){
                    return
                }

                let pset = ['qq.com', '163.com', 'gmail.com', 'sina.com', 'msn.com', 'hotmail.com', 'ask.com', 'live.com', '126.com', '193.com', 'mail.com', 'yahoo.com']

                if(value.includes('@') && value.indexOf('@') !== value.length - 1){
                    let suf = value.split('@').pop()
                    
                    for (let i = 0; i < pset.length; i++) {
                        if(pset[i].startsWith(suf)){
                            newMailOptions.value.push(value.replace('@' + suf, '') + '@' + pset[i])
                        }
                    }
                } else {
                    let cent = '@'
                    if(value.includes('@')){
                        cent = ''
                    }
                    newMailOptions.value = pset.map(val => value + cent + val)
                }
            }, 300)
        }

        const changeLoading = ref(false)
        const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        
        const loginReq = () => {
            let url = serve + '/user/login/bycode?target=' + newMail.value + '&' + 'verify-id=' + verifyId.value + '&' + 'code=' + code.value

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

        const changeToNew = async () => {
            if(newMail.value.length < 6 || !pattern.test(newMail.value)){
                MessagePlugin.error(i18n.newMailError[i18n.language])
                return
            }
            if(verifyId.value == null){
                MessagePlugin.error(i18n.notSendToLog[i18n.language])
                return
            }
            if(code.value == null || code.value.length != 6){
                MessagePlugin.error(i18n.codeError[i18n.language])
                return
            }

            changeLoading.value = true

            let v = await loginReq()
            if(v.result){
                let f = await translate('邮箱已经存在', i18n.language)
                MessagePlugin.error(f.trans_result[0].dst)

                changeLoading.value = false
                return
            }
            if(v.error !== '手机号或者邮箱对应的账号不存在'){
                let f = await translate(v.error, i18n.language)
                MessagePlugin.error(f.trans_result[0].dst)

                changeLoading.value = false
                return
            }

            let res = await updateUser({
                uid: user.inform.uid,
                mail: newMail.value
            })

            if(res.result){
                MessagePlugin.success(i18n.editSuccess[i18n.language])

                user.inform.mail = newMail.value
                localStorage.setItem('user', JSON.stringify(user.inform))

                current.value++
            } else {
                let f = await translate(res.error, i18n.language)
                MessagePlugin.error(f.trans_result[0].dst)
            }

            changeLoading.value = false
        }

        const codeSendCd = ref(0)
        const codeSendLd = ref(false)
        const sendVerifyCode = async () => {
            codeSendLd.value = true
            sendCode(serve, newMail.value, i18n.language)
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

        return {
            i18n,
            visible,
            open,
            current,
            close,

            newMail,
            newMailOptions,
            onNewMailChange,

            changeToNew,
            changeLoading,

            verifyId,
            code,

            codeSendCd,
            codeSendLd,
            sendVerifyCode
        }
    }
}
</script>

<style>

</style>