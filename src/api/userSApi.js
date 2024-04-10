import { request, apiSign } from "./request.js"
import { getToken } from "../hooks/user.js"
import host from "./host.js"
import { getLanguage } from "../i18n/index.js"

export const locationOptions = async (level, parent_id = '') => {
    let path = '/location/options'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&level=${level}&parent_id=${parent_id}&language=${getLanguage()}`)
}

export const locationFormat = async (location) => {
    let path = '/location/format'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&location=${location}&language=${getLanguage()}`)
}

export const verifyPassword = async (password) => {
    let path = '/user/verifyPasswordToChange'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&password=${password}`)
}

export const changePassword = async (authToken, newPassword) => {
    let path = '/user/changePassword'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&auth_token=${authToken}&new_password=${newPassword}`)
}

export const sendCodeFromSelf = async (type) => {
    let path = '/code/sendFromSelf'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&type=${type}`)
}

export const verifyCodeToSet = async (type, verifyId, code, action) => {
    let path = '/user/verifyCodeToSet'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&target-type=${type}&verify-id=${verifyId}&code=${code}&operate=${action}`)
}

export const changeBind = async (authToken, type, target, verifyId, code) => {
    let path = '/user/changeBind'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&change_type=${type}&change_target=${target}&verify-id=${verifyId}&code=${code}&auth_token=${authToken}`)
}