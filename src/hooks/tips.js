import {translate} from "./index.js";
import {MessagePlugin} from "tdesign-vue-next";
import {getLanguage} from "../i18n/index.js";

/**
 * 提示函数，根据消息内容和语言显示不同状态的提示信息。
 * @param {string} message - 要显示的消息内容。
 * @param {string} [status='info'] - 消息的状态，可选值包括 'info', 'success', 'warning', 'error'。
 */
export const tips = (message, status = 'info') => {
    let language = getLanguage()
    translate(message, language)
        .then(res => {
            MessagePlugin[status](res['trans_result'][0]['dst'])
        })
        .catch(() => {
            MessagePlugin[status](message)
        })
}