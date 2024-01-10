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
                <t-loading
                size="small"
                v-if="current === 0 && !verified"
                :text="i18n.checkingEnvironmentalSecurity[i18n.language] + '...'"
                style="width: 100%; height: 240px;"
                />
                <div
                v-if="current === 0 && verified"
                style="margin: 110px 0; text-align: center;"
                >
                    <t-icon name="check" />
                    {{ i18n.verified[i18n.language] }}
                </div>

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
                    <t-button @click="changeToNew" style="margin-top: 5px;">
                        {{ i18n.confirm[i18n.language] }}
                    </t-button>
                </div>
            </div>
        </div>
    </t-dialog>
</template>

<script>
import { updateUserInfo, translate, delay } from '../../hooks'
import OpenAuthentication from './OpenAuthentication.vue'

export default {
    components: {
        OpenAuthentication
    },
    setup(){
        const i18n = inject('i18n')
        const visible = ref(false)
        const open = async () => {
            current.value = 0
            visible.value = true

            // verified.value = false
            // let timestamp = (new Date()).getTime()
            // await delay(timestamp % 3500)

            // verified.value = true
            // await delay(700)

            current.value = 1
            current.value = 2
        }

        const current = ref(0)
        const verified = ref(false)

        const close = () => {
            return new Promise((resolve, reject) => {
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
        const changeToNew = () => {
            
        }

        return {
            i18n,
            visible,
            open,
            current,
            verified,
            close,
            newPassword
        }
    }
}
</script>

<style>

</style>