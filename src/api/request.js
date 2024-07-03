import dayjs from "dayjs"
import host from "./host.js"
import { MessagePlugin } from "tdesign-vue-next"
import md5 from "md5"
import { getToken } from "../hooks/user.js"

export const request = (path, body = {}, method = 'GET', contentType = 'application/json', timeout = 10) => {
    return new Promise(async (resolve, reject) => {
        const controller = new AbortController()
        const signal = controller.signal

        const options = {
            method,
            signal,
            mode: "cors",
            credentials: "include",
            redirect: "follow",
            headers: {
                "Content-Type": contentType,
                "X-Secret-A": 'SubFixeam',
                "X-Fixeam-Key": md5(dayjs().format('YYYYMMDD'))
            }
        }
        let secret = await apiKey()
        let sign = await apiSign(path)
        path += `?api_secret=${secret}&api_sign=${sign}`
        if(method !== 'GET' && method !== 'HEAD' && method !== 'DELETE'){
            options.body = JSON.stringify(body)
        } else {
            for (const bodyKey in body) {
                path += `&${ bodyKey }=${ body[bodyKey] }`
            }
        }

        fetch(host + path, options)
            .then(response => {
                const contentType = response.headers.get('content-type')
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
            if(dayjs(apiKeyData.expired).isAfter(dayjs())) {
                return apiKeyData.secret
            }
            return null
        } catch (e) {
            console.error(e)
            return null
        }
    }
}

export const apiKeyFromWeb = () => {
    return new Promise( (resolve, reject) => {
        fetch(host + '/secret', {
            mode: "cors",
            credentials: "include",
            redirect: "follow",
            headers: {
                "X-Secret-A": 'SubFixeam',
                "X-Fixeam-Key": md5(dayjs().format('YYYYMMDD'))
            }
        })
            .then(res => resolve(res.json()))
            .catch(e => reject(e.response))
    })
}

export const apiKey = () => {
    return new Promise(async (resolve, reject) => {
        let key = apiKeyFromSession()
        if(key){
            return resolve(key)
        }
        let keyResponse = await apiKeyFromWeb()
        if(keyResponse.status === 'success'){
            sessionStorage.setItem('api-key-data', JSON.stringify(keyResponse.content))
            resolve(keyResponse.content.secret)
        } else {
            await MessagePlugin.error(keyResponse.error.code ? keyResponse.error.code + '::' + keyResponse.error.msg
                : keyResponse.status + '::' + keyResponse.error)
            reject(keyResponse.error)
        }
    })
}

export const apiSign = (apiRoute) => {
    return new Promise(async (resolve) => {
        const str = dayjs().format('YYYYMMDD') + apiRoute + await apiKey()
        resolve(md5(str))
    })
}