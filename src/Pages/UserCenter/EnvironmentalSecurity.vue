<template>
    <t-loading
    size="small"
    v-if="verified === 1"
    :text="i18n.checkingEnvironmentalSecurity[i18n.language] + '...'"
    style="width: 100%; height: 240px;"
    />
    <div
    v-if="verified === 0"
    style="margin: 30px 0; text-align: center;"
    >
        <t-icon name="check" size="80px" color="var(--td-success-color)" />

        <div style="margin: 10px 0; font-size: 14px;">
            {{ i18n.verified[i18n.language] }}
        </div>
    </div>
    <div
    v-if="verified === 2"
    style="margin: 30px 0; text-align: center;"
    >
        <t-icon name="close-circle" size="80px" color="var(--td-error-color)" />

        <div style="margin: 10px 0; font-size: 14px;">
            {{ i18n.verifyClosed[i18n.language] }}
        </div>
        
        <t-button @click="$emit('close')">
            <template #icon>
                <t-icon name="close" />
            </template>
            {{ i18n.close[i18n.language] }}
        </t-button>
    </div>
</template>

<script>
import { delay } from '../../hooks'

export default {
    emits: ['verified', 'close'],
    setup(props, { emit }){
        const i18n = inject('i18n')
        const verified = ref(1)
        const appid = '193645753'

        const verify = async () => {
            verified.value = 1
            try {
                var captcha = new TencentCaptcha(appid, vcallback, {})
                captcha.show()
            } catch (error) {
                var date = new Date()
                var ticket = 'terror_1001_' + appid + '_' + Math.floor(date.getTime() / 1000)
                await delay(date.getTime() % 2500)
                vcallback({
                    ret: 0,
                    randstr: '@'+ Math.random().toString(36).substr(2),
                    ticket,
                    errorCode: 1001,
                    errorMessage: 'jsload_error'
                })
            }
        }
        const vcallback = async (res) => {
            console.log('callback:', res)
            if(res.ret === 2){
                verified.value = 2
            }
            if(res.ret === 0){
                verified.value = 0
                await delay(700)
                emit('verified')
            }

            if (res.ret === 0) {
                var str = '【randstr】->【' + res.randstr + '】      【ticket】->【' + res.ticket + '】'
                console.log(str)
            }
        }

        onMounted(() => {
            verify()
        })

        return {
            i18n,
            verified
        }
    }
}
</script>

<style>

</style>