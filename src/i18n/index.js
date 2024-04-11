import zh from './zh.json'
import en from './en.json'
import jp from './jp.json'
import th from './th.json'
import kor from './kor.json'
import fra from './fra.json'
import cht from './cht.json'
import { translate } from '../hooks'

function batchEdited(number) {
    if(number === 0){
        return {
            zh: '未修改任何数据',
            en: 'No data edited',
            kor: '수정된 데이터가 없습니다',
            jp: '編集されたデータはありません',
            th: 'ไม่มีข้อมูลที่แก้ไข',
            cht: '未修改任何數據',
            fra: 'Aucune donnée modifiée'
        }
    }
    return {
        zh: `已修改 ${number} 个SKU`,
        en: `Edited ${number} SKU`,
        kor: `${number}개의 SKU 수정됨`,
        jp: `${number}個のSKU 編集されました`,
        th: `แก้ไขข้อมูล ${number} รายการ SKU`,
        cht: `已修改${number}個SKU`,
        fra: `${number} SKU modifié`
    }
}

function selected(number) {
    if(number === 0){
        return {
            zh: '未选择任何数据',
            en: 'No data selected',
            kor: '선택된 데이터가 없습니다',
            jp: '選択されたデータはありません',
            th: 'ไม่มีข้อมูล',
            cht: '未選擇任何數據',
            fra: 'Aucune donnée sélectionnée'
        }
    }
    return {
        zh: `已选择 ${number} 项数据`,
        en: `Selected ${number} items`,
        kor: `${number}개 선택됨`,
        jp: `${number}件 選択されました`,
        th: `เลือก ${number} รายการ`,
        cht: `已選擇 ${number} 項數據`,
        fra: `${number} item données sélectionnées`
    }
}

const i18n = reactive({
    language: 'en',
    batchEdited,
    selected,
    options: [
        {
            content: '简体中文',
            value: 'zh',
            disabled: false,
            package: zh
        },
        {
            content: '繁体中文',
            value: 'cht',
            disabled: false,
            package: cht
        },
        {
            content: 'English',
            value: 'en',
            disabled: false,
            package: en
        },
        {
            content: 'Français',
            value: 'fra',
            disabled: false,
            package: fra
        },
        {
            content: '한국어',
            value: 'kor',
            disabled: false,
            package: kor
        },
        {
            content: '日本語',
            value: 'jp',
            disabled: false,
            package: jp
        }
    ],
    checkEmpty: async () => {
        for (let i = 0; i < i18n.options.length; i++) {
            let languageCode = i18n.options[i].value
            let languagePackage = i18n.options[i].package
            let hasEmpty = false
        
            for (const key in languagePackage) {
                if(languagePackage[key] === ''){
                    hasEmpty = true
                    let f = await translate(zh[key], languageCode)
                    languagePackage[key] = f['trans_result'][0]['dst']
                }
            }

            if(hasEmpty){
                console.log(JSON.stringify(languagePackage))
                return
            }
        }
    }
})

export const getLanguageOptionItem = (value) => {
    return i18n.options.find(item => item.value === value) ? i18n.options.find(item => item.value === value).content : ''
}

export const getLanguage = () => {
    let language = 'en'
    let localLanguage = localStorage.getItem('language')
    if(localLanguage){
        language = localLanguage
    }
    return language
}

export const getString = (key) => {
    let language = getLanguage()
    let languagePackage = {}

    switch (language) {
        case 'zh':
            languagePackage = zh
            break
        case 'en':
            languagePackage = en
            break
        case 'cht':
            languagePackage = cht
            break
        case 'fra':
            languagePackage = fra
            break
        case 'jp':
            languagePackage = jp
            break
        case 'th':
            languagePackage = th
            break
        case 'kor':
            languagePackage = kor
            break
        default:
            languagePackage = zh
    }
    if(languagePackage[key]){
        return languagePackage[key]
    }

    return key
}

export const getStringAsync = async (key) => {
    let str = await getString(key)
    if(str === key || str === ''){
        let f = await translate(key, getLanguage())
        return f['trans_result'][0]['dst']
    }
}

export default i18n