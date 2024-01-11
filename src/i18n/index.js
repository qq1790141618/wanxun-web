import zh from './zh.json'
import en from './en.json'
import jp from './jp.json'
import th from './th.json'
import kor from './kor.json'
import fra from './fra.json'
import cht from './cht.json'
import { translate } from '../hooks'

function batchEdited(number) {
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
function selected(number) {
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
        },
        {
            content: 'ภาษาไทย',
            value: 'th',
            disabled: false,
            package: th
        }
    ],
    checkEmpty: async () => {
        for (let i = 0; i < i18n.options.length; i++) {
            let languageCode = i18n.options[i].value
            let languagePackage = i18n.options[i].package
            let hasEmpty = false
        
            for (const key in languagePackage) {
                if(languagePackage[key] == ''){
                    hasEmpty = true
                    let f = await translate( i18n[key]["zh"], languageCode)
                    languagePackage[key] = f.trans_result[0].dst
                    i18n[key][languageCode] = f.trans_result[0].dst
                }
            }

            if(hasEmpty){
                console.log(JSON.stringify(languagePackage))
                return
            }
        }
    }
})

const initLanguage = () => {
    for (let i = 0; i < i18n.options.length; i++) {
        let languageCode = i18n.options[i].value
        let languagePackage = i18n.options[i].package
    
        for (const key in languagePackage) {
            if(!i18n[key]){
                i18n[key] = new Object
    
                for (let l = 0; l < i18n.options.length; l++) {
                    i18n[key][i18n.options[l].value] = ''
                }
            }
            i18n[key][languageCode] = languagePackage[key]
        }
    }
}
initLanguage()

export default i18n