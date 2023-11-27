import md5 from 'md5'
import fetchJSONP from 'fetch-jsonp'
import useClipboard from 'vue-clipboard3'

export function sendCode(serve, target, lang = 'zh'){
    return new Promise((resolve, reject) => {
        const pattern = {
            phone: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            mail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        }

        if(!pattern.phone.test(target) && !pattern.mail.test(target)){
            const targetFail = {
                zh: '请输入正确的手机号或邮箱',
                en: 'Please enter a valid phone number or email address'
            }
            return reject(targetFail[lang])
        }

        fetch(serve + '/user/send-code?target=' + target)
        .then(response => {
            return resolve(response.json())
        })
        .catch(() => {
            const httpFail = {
                zh: '验证码发送失败::服务器请求错误',
                en: 'Verification code sending failed: Server request error'
            }
            return reject(httpFail[lang])
        })
    })
}

export function translate(text, lang){
    return new Promise((resolve, reject) => {
        text = text.replace(/_/g, " ")
        let salt = (new Date()).getTime()
        let sign = md5('20230411001636877' + text + salt + 'L4hHUCkB24zQnWGgdZrr')
        let url = 'https://fanyi-api.baidu.com/api/trans/vip/translate/?q=' + text + '&from=auto&to=' + lang + '&appid=20230411001636877&salt=' + salt + '&sign=' + sign

        fetchJSONP(url)
        .then(res => {
            return resolve(res.json())
        })
        .catch(() => reject())
    })
}

export function verifyUser(serve) {
    return new Promise((resolve, reject) => {
        let access_token = localStorage.getItem('access_token')
        if(!access_token){
            return reject(false)
        }
        
        fetch(serve + '/user/login/verify?token=' + access_token)
        .then(response => {
            return resolve(response.json())
        })
        .catch(() => {
            return reject(false)
        })
    })
}

const { toClipboard } = useClipboard()
export async function copy(value, lang = 'zh') {
    await toClipboard(value)
    let message = {
        zh: '复制成功',
        en: 'Copied'
    }
    MessagePlugin.success(message[lang])
}