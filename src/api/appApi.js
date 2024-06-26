import { request, apiSign } from "./request.js"
import host from "./host.js"
import {getToken} from "../hooks/user.js"

export const appView = async () => {
    let path = '/app/version'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`)
}

export const appLatestVersion = async (platform) => {
    let path = '/app/latest'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&platform=${platform}`)
}

export const appPublish = async (info) => {
    let path = '/app/version/publish'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`, 'POST', 'application/json', {
        info
    })
}