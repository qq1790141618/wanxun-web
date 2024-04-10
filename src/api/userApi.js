import { request, apiSign } from "./request.js"
import host from "./host.js"
import {getToken} from "../hooks/user.js";

export const passwordLogin = async (account, password) => {
    let path = '/login/password'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&account=${account}&password=${password}`)
}
export const verifyCodeLogin = async (target, verifyId, code) => {
    let path = '/login/code'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&target=${target}&verify-id=${verifyId}&code=${code}`)
}
export const codeSend = async (target) => {
    let path = '/code/send'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&target=${target}`)
}
export const inform = async (overToken) => {
    let path = '/user/inform'
    let sign = await apiSign(path)

    let token = overToken
    if(!overToken){
        token = localStorage.getItem('access_token')
    }
    if(!token){
        return
    }

    return await request(`${host}${path}?api_sign=${sign}&access_token=${token}`)
}

export const saveUserInform = async (inform) => {
    let path = '/user/edit'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`, 'POST', 'application/json', {
        user: inform
    })
}

export const imageUpload = async (file) => {
    let path = '/import/upload/image'
    let sign = await apiSign(path)

    let formData = new FormData
    formData.append('file', file)

    return new Promise((resolve, reject) => {
        fetch( `${host}/import/upload/image?api_sign=${sign}&access_token=${getToken()}`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            resolve(response.json())
        })
        .catch(error => {
            console.error(error)
            reject(error)
        })
    })
}