import dayjs from "dayjs"
import host from "./host.js"
import { MessagePlugin } from "tdesign-vue-next"
import md5 from "md5"

export const request = (url, method = 'GET', contentType = 'application/json', body = {}, timeout = 10) => {
    return new Promise((resolve, reject) => {
        const controller = new AbortController()
        const signal = controller.signal

        const options = {
            method,
            signal,
            mode: "cors",
            credentials: "same-origin",
            redirect: "follow",
            headers: {
                "Content-Type": contentType,
                "X-Secret-A": 'SubFixeam'
            }
        }
        if(method !== 'GET' && method !== 'HEAD'){
            options.body = JSON.stringify(body)
        }

        fetch(url, options)
            .then(response => {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    resolve(response.json())
                } else {
                    resolve(response.text())
                }
            })
            .catch(error => {
                console.error(error)
                reject(error)
            })

        setTimeout(() => {
            controller.abort()
            reject({
                result: false,
                error: {
                    code: 'TIMEOUT',
                    message: '请求超时'
                }
            })
        }, timeout * 1000)
    })
}

export const apiKeyFromSession = () => {
    let apiKeyData = sessionStorage.getItem('api-key-data')
    if(apiKeyData){
        try {
            apiKeyData = JSON.parse(apiKeyData)
            if(apiKeyData.period === dayjs().format('YYYYMMDDHH')) {
                return apiKeyData.key
            }
            return null
        } catch (e) {
            console.error(e)
            return null
        }
    }
}

export const apiKey = () => {
    return new Promise(async (resolve, reject) => {
        let key = apiKeyFromSession()
        if(key){
            return resolve(key)
        }
        let keyResponse = await request(host + '/api-key')
        if(keyResponse.result){
            sessionStorage.setItem('api-key-data', JSON.stringify(keyResponse.content))
            resolve(keyResponse.content.key)
        } else {
            await MessagePlugin.error(keyResponse.error.message)
            reject(keyResponse.error)
        }
    })
}

export const apiSign = (apiRoute) => {
    return new Promise(async (resolve) => {
        const str = dayjs().format('YYYYMMDD') + 'api/v1' + apiRoute + await apiKey()
        resolve(md5(str))
    })
}