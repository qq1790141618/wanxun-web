import md5 from 'md5'
import fetchJSONP from 'fetch-jsonp'
import useClipboard from 'vue-clipboard3'
import {getContent} from '../i18n'
import dayjs from 'dayjs'

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

const { toClipboard } = useClipboard()
export async function copy(value, lang = 'zh') {
    await toClipboard(value)
    MessagePlugin.success(getContent('copySuccess'))
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

export function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

