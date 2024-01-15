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
                {{ i18n.editPassword[i18n.language] }}

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
                <t-step-item :content="i18n.editPassword[i18n.language]" />
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
                use-password
                @verified="current = 2"
                />

                <div v-if="current === 2">
                    <t-space align="center">
                        {{ i18n.newPassword[i18n.language] }}:
                        <t-input style="width: 340px;" type="password" v-model="newPassword" ></t-input>
                    </t-space>
                    <t-button @click="changeToNew" :loading="changeLoading" style="margin-top: 5px;">
                        {{ i18n.confirm[i18n.language] }}
                    </t-button>
                </div>

                <div v-if="current === 3" style="text-align: center; margin-top: 20px;">
                    <t-icon name="check-circle" size="80px" color="var(--td-success-color)" />
                    <div style="margin: 10px 0; font-size: 14px;">
                        {{ i18n.passwordHasChanged[i18n.language] }}!
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
import { updateUser, translate, delay } from '../../hooks'
import EnvironmentalSecurity from './EnvironmentalSecurity.vue'
import OpenAuthentication from './OpenAuthentication.vue'
import md5 from 'md5'

export default {
    components: {
        OpenAuthentication,
        EnvironmentalSecurity
    },
    setup(){
        const i18n = inject('i18n')
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

        const newPassword  = ref('')
        const changeLoading = ref(false)
        const changeToNew = async () => {
            if(newPassword.value.length < 6){
                MessagePlugin.error(i18n.newPasswordError[i18n.language])
                return
            }

            changeLoading.value = true
            let newp = md5(newPassword.value)
            let res = await updateUser({
                uid: user.inform.uid,
                password: newp
            })
            if(res.result){
                MessagePlugin.success(i18n.editSuccess[i18n.language])

                user.inform.password = newp
                localStorage.setItem('user', JSON.stringify(user.inform))

                current.value++
            } else {
                let f = await translate(res.error, i18n.language)
                MessagePlugin.error(f.trans_result[0].dst)
            }

            changeLoading.value = false
        }

        return {
            i18n,
            visible,
            open,
            current,
            close,
            newPassword,
            changeToNew,
            changeLoading
        }
    }
}
</script>

<style>

</style>