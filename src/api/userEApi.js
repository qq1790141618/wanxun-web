import { request, apiSign } from "./request.js"
import { getToken } from "../hooks/user.js"
import host from "./host.js"

export const userView = async () => {
    let path = '/user/view'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`)
}

export const userChangeIdentity = async (uid, identity) => {
    let path = '/user/change_identity'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&uid=${uid}&identity=${identity}`)
}

export const createUser = async (inform) => {
    let path = '/user/create'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`, 'POST', 'application/json', inform)
}

export const removeUser = async (uid) => {
    let path = '/user/remove'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&uid=${uid}`)
}