import { request, apiSign } from "./request.js"
import {getToken} from "../hooks/user.js"
import host from "./host.js"
import {getBrand, getStore} from "./shop.js"
import {MessagePlugin} from "tdesign-vue-next";
import {translate} from "../hooks/index.js";

export const createTask = async (date) => {
    let path = '/analysis/sales/create'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&date=${JSON.stringify(date)}&store-id=${getStore()}&brand=${getBrand()}`, 'GET', 'application/json', {}, 120)
}
export const startTask = async () => {
    let path = '/analysis/sales/task'
    return await request(`${host}${path}`)
}
export const queryProgress = async (id) => {
    let path = '/analysis/sales/task/result'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}`)
}
export const categoryInform = async (from, to) => {
    let path = '/analysis/category/inform'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&from=${from}&to=${to}&store-id=${getStore()}&brand=${getBrand()}`)
}
export const refunds = async (from, to) => {
    let path = '/analysis/refunds/get'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&date=${JSON.stringify([from, to])}&store-id=${getStore()}&brand=${getBrand()}`)
}
export const freights = async (from, to) => {
    let path = '/analysis/refunds/freight'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&date=${JSON.stringify([from, to])}&store-id=${getStore()}&brand=${getBrand()}`)
}
export const operational = async (brand, mode, time, store = "") => {
    let path = '/analysis/atomic'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&mode=${mode}&time=${time}&store-id=${store}&brand=${brand}`)
}
export const summaryDayOfMonth = async (month) => {
    let path = '/analysis/summary/month'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&month=${month}&store-id=${getStore()}&brand=${getBrand()}&id=1000000073`)
}
export const annualOverview = async () => {
    let path = '/analysis/annual-overview'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&store-id=${getStore()}&brand=${getBrand()}`)
}
export const famousWord = async () => {
    let path = '/famous-word'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}`)
}