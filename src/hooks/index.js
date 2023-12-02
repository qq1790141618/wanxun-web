import md5 from 'md5'
import fetchJSONP from 'fetch-jsonp'
import useClipboard from 'vue-clipboard3'
const serve = 'https://work-serve.fixeam.com/api'

export function sendCode(serve, target, lang = 'zh'){
    return new Promise((resolve, reject) => {
        const pattern = {
            phone: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            mail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        }

        if(!pattern.phone.test(target) && !pattern.mail.test(target)){
            const targetFail = {
                zh: '请输入正确的手机号或邮箱',
                en: 'Please enter a valid phone number or email address',
                kor: '请 입력 맞는 핸드폰 번호 또는 이메일',
                jp: '请 入力 正确的 電話番号 か 電子メール',
                th: '请 输入 正确的 电话号码 或 电子邮件'
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
                en: 'Verification code sending failed: Server request error',
                kor: '인증 코드 전송 실패::서버 요청 오류',
                jp: '認証コード送信失敗::サーバーリクエストエラー',
                th: 'ข้อความยืนยันอีเมล์หรือเบอร์โทรศ'
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
        en: 'Copied',
        kor: '복사 성공',
        jp: 'コピー 成功',
        th: 'สร้าง เสร็จ'
     }
    MessagePlugin.success(message[lang])
}

export function sort(val, sortArray, defaultSort = { sortBy: 'salesCount', descending: true }) {
    if(!val){
        val = defaultSort
    }

    for (let i = 0; i < sortArray.length; i++) {
        for (let t = i + 1; t < sortArray.length; t++) {
            if(val.descending){
                if(sortArray[i][val.sortBy] < sortArray[t][val.sortBy]){
                    let tp1 = sortArray[i]
                    sortArray[i] = sortArray[t]
                    sortArray[t] = tp1
                }
            }
            if(!val.descending){
                if(sortArray[i][val.sortBy] > sortArray[t][val.sortBy]){
                    let tp2 = sortArray[i]
                    sortArray[i] = sortArray[t]
                    sortArray[t] = tp2
                }
            }
        }
    }

    return sortArray
}

export function miaostreetGoodsLink(item) {
    if(!item['miaostreet-id'] || item['miaostreet-id'] == null){
        return
    }
    window.open('https://www.miaostreet.com/clmj/hybrid/miaojieWeex?pageName=goods-detail&wx_navbar_transparent=true&wh_weex=true&itemId=' + item['miaostreet-id'], "newwindow","height=800, width=420, top=120, left=685, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")

    let history = JSON.parse(localStorage.getItem('history')) || {
        menus: [],
        goods: []
    }
    if(!history.goods){
        history.goods = []
    }
    
    for (let i = 0; i < history.goods.length; i++) {
        if(history.goods[i].stylenumber === item.stylenumber){
            history.goods.splice(i, 1)
            history.goods.unshift(item)
            localStorage.setItem('history', JSON.stringify(history))
            return
        }
    }

    history.goods.unshift(item)
    localStorage.setItem('history', JSON.stringify(history))
}

export async function getCategoryOptions(serve) {
    return fetch(serve + '/goods/category/get')
    .then(res => {
        return Promise.resolve(res.json())
    })
}

export async function getSupplierOptions(serve) {
    return fetch(serve + '/goods/supplier/get')
    .then(res => {
        return Promise.resolve(res.json())
    })
}

export async function getGoods(store, brand, condition, start, number, isExport) {
    let s = start || 0
    let num = number || 0
    let url = serve + '/goods/mul/get?with-sales=cfdd&start=' + s + '&number=' + num

    if(isExport){
        url += '&export=export'
    }
    
    return fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            'store-id': store,
            brand,
            condition: !condition ? false : JSON.stringify(condition)
        })
    })
    .then(response => {
        if(isExport){
            return Promise.resolve(response.text())
        }
        return Promise.resolve(response.json())
    })
    .catch(error => {
        return Promise.resolve(error)
    })
}