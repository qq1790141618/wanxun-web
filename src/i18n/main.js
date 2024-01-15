import zh from './zh.json'
import en from './en.json'
import jp from './jp.json'
import th from './th.json'
import kor from './kor.json'
import fra from './fra.json'
import cht from './cht.json'
import { translate } from '../hooks'

const bet = (number) => {
    if(number == 0){
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
const sld = (number) => {
    if(number == 0){
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
const ttk = (key) => {
    const languagePackage = i18n.options.find(item => item.value === i18n.language).package
    if(languagePackage[key]){
        return languagePackage[key]
    } else {
        return null
    }
}
const cl = (language) => {
    const languagePackage = i18n.options.find(item => item.value === i18n.language)
    if(!languagePackage){
        return false
    }
    
    i18n.language = language
}
const rls = () => {
    return i18n.language
}

export const TranslateTokey = ttk
export const ChangeLanguege = cl
export const ReadLanguageSet = rls
export const BatchEdited = bet
export const Selected = sld

const i18n = reactive({
    language: 'en',
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
        },
        {
            content: 'ภาษาไทย',
            value: 'th',
            disabled: false,
            package: th
        }
    ],
    install: (app) => {
        app.config.globalProperties.$translate = ttk
        app.config.globalProperties.$changeLanguage = cl
        app.config.globalProperties.$readLanguageSet = rls
        app.config.globalProperties.$batchEdited = bet
        app.config.globalProperties.$selected = sld
    }
})

export default i18n