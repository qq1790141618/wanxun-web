import { request, apiSign } from "./request.js"
import {getToken} from "../hooks/user.js"
import host from "./host.js"

export const identityView = async () => {
    let path = '/manage/identity_view'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`)
}

export const apiView = async () => {
    let path = '/manage/api_view'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`)
}

export const setIdentityApiPermissions = async (identity, permissions) => {
    let path = '/manage/set_identity_api_permission'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`, 'POST', 'application/json', {
        id: identity,
        api_permission: permissions
    })
}

export const createIdentity = async (id, name, create_by_identity) => {
    let path = '/manage/create_identity'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`, 'POST', 'application/json', {
        id,
        name,
        create_by_identity
    })
}

export const removeIdentity = async (id) => {
    let path = '/manage/remove_identity'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}`)
}