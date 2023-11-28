export default reactive({
    status: 'unlog', // unlog | loged | verify
    inform: false,
    logout: () => {
        localStorage.removeItem('access_token')
        location.href = location.origin + '/login'
    }
})