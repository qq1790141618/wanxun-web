import md5 from 'md5'
import fetchJSONP from 'fetch-jsonp'
import useClipboard from 'vue-clipboard3'
import i18n, {getLanguage} from '../i18n'
import dayjs from 'dayjs'

const serve = 'https://work-serve.fixeam.com/api'

export function sendCode(serve, target, lang = 'zh'){
    return new Promise((resolve, reject) => {
        const pattern = {
            phone: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            mail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        }

        if(!pattern.phone.test(target) && !pattern.mail.test(target)){
            return reject(i18n.targetIsFail[lang])
        }

        fetch(serve + '/user/send-code?target=' + target)
        .then(response => {
            return resolve(response.json())
        })
        .catch(() => {
            return reject(i18n.httpFail[lang])
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
    MessagePlugin.success(i18n.copySuccess[lang])
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

export function getQuickDateRangePicker(language = 'zh'){
    return new Promise(async (resolve) => {
        let primary = {
            '去年': [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')],
            '今年': [dayjs().startOf('year'), dayjs().subtract(1, 'day')],
            '上个月': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
            '这个月': [dayjs().startOf('month'), dayjs().subtract(1, 'day')],
            '最近30天': [dayjs().subtract(30, 'day'), dayjs().subtract(1, 'day')],
            '最近7天': [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')]
        }
        if(language === 'zh'){
            return resolve(primary)
        }
    
        let res = {}
        for (const key in primary) {
            let f = await translate(key, language)
            let transKey = f.trans_result[0].dst
            res[transKey] = primary[key]
        }

        return resolve(res)
    })
}

export function uniqueArray(array, primaryKey = false) {
    if(typeof(primaryKey) == 'string'){
        array = array.map(obj => obj[primaryKey])
    }
    if(typeof(primaryKey) == 'function'){
        array = primaryKey(array)
    }

    return array.filter((value, index, self) => {
        return self.indexOf(value) === index
    })
}

export function imageFileToBase(file) {
    return new Promise((resolve) => {
        if(file[0].raw){
            file = file[0].raw
        }

        var reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = function () { 
            return resolve(this.result)
        }
    })
}

export function getGreeting() {
    var date = new Date()
    var hour = date.getHours()
    var greeting = ''

    if (hour >= 0 && hour < 5) {
        greeting = 'before dawn'
    } else if (hour >= 5 && hour < 11) {
        greeting = 'morning'
    } else if (hour >= 11 && hour < 13) {
        greeting = 'noon'
    } else if (hour >= 13 && hour < 18) {
        greeting = 'afternoon'
    } else if (hour >= 18 && hour < 24) {
        greeting = 'night'
    }

    return greeting
}

export async function updateUserInfo(inform) {
    if(!inform.uid){
        return Promise.reject('Propertype `uid` is not found in inform')
    }
    let access_token = localStorage.getItem('access_token')
    inform = JSON.stringify(inform)

    return fetch(serve + `/user/inform/update?token=${ access_token }&user-inform=${ inform }`)
    .then(response => {
        return Promise.resolve(response.json())
    })
    .catch(() => {
        MessagePlugin.error(i18n.httpFail[i18n.language])
    })
}

export async function updateUser(inform) {
    if(!inform.uid){
        return Promise.reject('Propertype `uid` is not found in inform')
    }
    let access_token = localStorage.getItem('access_token')
    inform = JSON.stringify(inform)

    return fetch(serve + `/user/base/update?token=${ access_token }&user=${ inform }`)
    .then(response => {
        return Promise.resolve(response.json())
    })
    .catch(() => {
        MessagePlugin.error(i18n.httpFail[i18n.language])
    })
}

export function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

export async function GetAllUserInform() {
    let access_token = localStorage.getItem('access_token')
    return fetch(serve + '/user/inform/all?token=' + access_token)
    .then(response => {
        return Promise.resolve(response.json())
    })
}

