export default reactive({
    status: 'unlog', // unlog | loged | verify
    inform: false,
    logout: () => {
        localStorage.removeItem('access_token')
        const router = useRouter()
        router.push('/login')
        console.log(this)
    }
})