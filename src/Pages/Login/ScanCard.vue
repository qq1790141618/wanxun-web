<template>
    <t-card style="text-align: center; margin-bottom: 5px;" :key="qrcodeV">
        <t-loading style="width: 160px; height: 160px; " size="small" text="加载中..." v-if="!qrcodeV && !scanEd" />
        <QRCodeVue3
            v-if="qrcodeV && !scanEd"
            :width="160"
            :height="160"
            :value="qrcodeV"
            :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
            :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
            :dotsOptions="{
                type: 'dots',
                color: '#888',
                gradient: {
                    type: 'linear',
                    rotation: 0,
                    colorStops: [
                        { offset: 0, color: '#888' },
                        { offset: 1, color: '#888' }
                    ]
                }
            }"
            :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
            :cornersDotOptions="{ type: undefined, color: '#000000' }"
            fileExt="png"
            :download="false"
            :downloadOptions="{ name: 'vqr', extension: 'png' }"
            />
        <span v-if="qrcodeV && !scanEd">
            使用安卓App扫描二维码
        </span>
        <t-icon v-if="scanEd" name="check" style="margin: 40px 0;" size="50px" color="green" />
        <br />
        <span v-if="scanEd">
            扫描成功, 请在手机端确认登录
        </span>
    </t-card>
</template>

<script setup>
import QRCodeVue3 from "qrcode-vue3"
import service from "../../api/service.js"
import {useRouter} from "vue-router"

const qrcodeV = ref(null)
const scanEd = ref(false)
const user = inject('user')
const router = useRouter()

let socket
const connectToSocket = () => {
    socket = new WebSocket('wss://work-scan.fixeam.com/wss')
    socket.onopen = function() {
        console.log("WebSocket连接已打开")
        socket.send(JSON.stringify({
            type: 'create'
        }))
        setTimeout(() => {
            socket.close()
            socket = null
            qrcodeV.value = null
            connectToSocket()
        }, 60 * 5 * 1000)
    }
    socket.onclose = function(event) {
        console.log(event)
        console.log("WebSocket连接已关闭")
    }
    socket.onmessage = function(event) {
        const message = event.data
        const data = JSON.parse(message)

        if(data['type'] === 'create'){
            qrcodeV.value = data['content']
        }
        if(data['type'] === 'mobile scan'){
            scanEd.value = true
        }
        if(data['type'] === 'upload token'){
            localStorage.setItem('access_token', data['content'])
            service.api.user.inform(token)
                .then(res => {
                    user.inform = res.content.user
                    user.status = 'loged'
                    localStorage.setItem('user', JSON.stringify(user.inform))

                    socket.send(JSON.stringify({
                        type: 'loged'
                    }))
                    socket.close()

                    router.push('/')
                })
        }
        if(data['type'] === 'expired'){
            socket.close()
            socket = null
            qrcodeV.value = null
            connectToSocket()
        }
    }
}

onMounted(() => {
    connectToSocket()
})
</script>

<style scoped>

</style>