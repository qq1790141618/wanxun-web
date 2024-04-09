import { request, apiSign } from "./request.js"
import {getToken} from "../hooks/user.js"
import host from "./host.js"
import {getBrand, getStore} from "../hooks/shop.js"

export const categoryOptions = async () => {
    let path = '/goods/category/get'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`)
}

export const supplierOptions = async () => {
    let path = '/goods/supplier/get'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`)
}

export const get = async (condition = {}, start = 0, number = 20) => {
    let path = '/goods/mul/get'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`, 'POST', 'application/json', {
        condition,
        start,
        number,
        'store-id': getStore(),
        'brand': getBrand()
    })
}

export const getItem = async (stylenumber) => {
    let path = '/goods/item/get'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&stylenumber=${stylenumber}&store-id=${getStore()}&brand=${getBrand()}`, 'POST')
}

export const batchEdit = async (stylenumbers, content) => {
    let path = '/goods/batch-edit'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`, 'POST', 'application/json', {
        stylenumbers,
        content,
        'store-id': getStore(),
        'brand': getBrand()
    })
}

export const supplierMap = async (from, to, onlyStore = true) => {
    let path = '/goods/supplier/map'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&from=${from}&to=${to}&store=${ onlyStore ? getStore() : '' }&brand=${getBrand()}`)
}

export const getMirrors = async (stylenumber) => {
    let path = '/goods/mirrors'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`)
}