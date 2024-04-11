import {apiSign, request} from "./request.js";
import host from "./host.js";
import {getToken} from "../hooks/user.js";

const shop = reactive({
    store: '',
    storeOptions: [],
    brand: '',
    brandOptions: []
})

export default shop

export const getAllStore = async () => {
    let path = '/shop/store'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}`)
}

export const createStore= async (id = "", name = "", brand = [], location = "") => {
    let path = '/shop/create-store'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}&name=${name}&brand=${JSON.stringify(brand)}&location=${location}`)
}

export const setStoreInfo = async (id = "", name = "", brand = [], location = "") => {
    let path = '/shop/set-store'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}&name=${name}&brand=${JSON.stringify(brand)}&location=${location}`)
}

export const removeStore = async (id = "") => {
    let path = '/shop/remove-store'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}`)
}

export const getAllBrand = async () => {
    let path = '/shop/brand'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}`)
}

export const createBrand = async (id = "", name = "", keyword = "", suffix = "", logo = "") => {
    let path = '/shop/create-brand'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}&name=${name}&keyword=${keyword}&suffix=${suffix}&logo=${logo}`)
}

export const setBrandInfo = async (id = "", name = "", keyword = "", suffix = "", logo = "") => {
    let path = '/shop/set-brand'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}&name=${name}&keyword=${keyword}&suffix=${suffix}&logo=${logo}`)
}

export const removeBrand = async (id = "") => {
    let path = '/shop/remove-brand'
    let sign = await apiSign(path)
    return await request(`${host}${path}?api_sign=${sign}&access_token=${getToken()}&id=${id}`)
}

export function getStore(){
    let str = 'HZ13'
    let local = localStorage.getItem('store')
    if(local){
        str = local
    }
    return str
}

export function getBrand(){
    let str = '兔皇'
    let local = localStorage.getItem('brand')
    if(local){
        str = local
    }
    return str
}