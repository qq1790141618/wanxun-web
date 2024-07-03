<template>
    <t-card style="text-align: center; margin-bottom: 5px;" :key="qrcodeV">
        <t-loading style="width: 160px; height: 160px; " size="small" :text="getString('loading')" v-if="!qrcodeV && !scanEd" />
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
            {{ getString('scanInAndroidApp') }}
        </span>
        <t-icon v-if="scanEd" name="check" style="margin: 40px 0;" size="50px" color="green" />
        <br />
        <span v-if="scanEd">
            {{ getString('scanSuccess') }},
            {{ getString('pleaseConfirmInAndroidApp') }}
        </span>
    </t-card>
</template>

<script setup>
import QRCodeVue3 from "qrcode-vue3"
import service from "../../api/service.js"
import {useRouter} from "vue-router"
import {getString} from "../../i18n/index.js";
import {request} from "../../api/request.js";
import {MessagePlugin} from "tdesign-vue-next";
import {tips} from "../../hooks/tips.js";

const qrcodeV = ref(null)
const scanEd = ref(false)
const user = inject('user')
const router = useRouter()

let socket
const connectToSocket = () => {
    socket = new WebSocket('wss://scan.fixeam.com/wss')
    socket.onopen = function() {
        console.log("WebSocket Open")
        const message = JSON.stringify({
            type: 'create'
        })
        socket.send(message)
        setTimeout(() => {
            socket.close()
            socket = null
            qrcodeV.value = null
            connectToSocket()
        }, 60 * 5 * 1000)
    }
    socket.onclose = function(event) {
        console.log(event.data)
        console.log("WebSocket Close")
    }
    socket.onmessage = async function(event) {
        console.log(JSON.parse(event.data) || event.data)
        const message = event.data
        const data = JSON.parse(message)

        if(data['type'] === 'create'){
            qrcodeV.value = data['content']
        }
        if(data['type'] === 'mobile scan'){
            scanEd.value = true
        }
        if(data['type'] === 'upload token'){
            let response = await request("/user/login/token", {
                accessToken: data['content']
            }, 'POST')
            if(response.status === 'success'){
                await MessagePlugin.success(getString('loged'))
            } else {
                tips(response.error.msg, 'error')
            }
            socket.send(JSON.stringify({
                type: 'loged',
                sign: qrcodeV.value
            }))
            socket.close()
            location.href = location.origin
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