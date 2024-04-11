import { request, apiSign } from "./request.js"
import {getToken} from "../hooks/user.js"
import host from "./host.js"
import {getBrand, getStore} from "./shop.js"

export const create = async (type, content) => {
    let path = '/import/task/create'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&name=${type}`, 'POST', 'application/json', content)
}

export const start = async (type, id) => {
    return await request(`${host}/import/task/${type}/start?&id=${id}`)
}

export const get = async (start = 0, number = 20) => {
    let path = '/import/task'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&start=${start}&number=${number}`)
}

export const remove = async (id) => {
    let path = '/import/task/remove'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}`)
}

export const removeOrder = async (dateFrom) => {
    let path = '/order/remove'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&brand=${getBrand()}&store-id=${getStore()}&date-from=${dateFrom}`)
}