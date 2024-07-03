import { request } from "../api/request.js"

export default reactive({
    status: 'unlog', // unlog | loged | verify
    inform: false,
    logout: async () => {
        await request('/user/logout', {}, 'POST')
        location.href = location.origin + '/login'
    }
})

export function getToken(){
    return localStorage.getItem('access_token')
}