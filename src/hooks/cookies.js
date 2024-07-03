class cookies {
    // 设置cookie
    static set(name, value, daysToLive) {
        let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (typeof daysToLive === 'number') {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + daysToLive);
            cookie += `; expires=${expirationDate.toUTCString()}`;
        }

        document.cookie = cookie;
    }

    // 获取cookie
    static get(name) {
        const cookies = document.cookie.split(';')
            .map(cookie => cookie.trim().split('='))
            .reduce((acc, [name, value]) => ({ ...acc, [name]: decodeURIComponent(value) }), {})

        return cookies[name]
    }

    // 删除cookie
    static delete(name) {
        document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}

export default cookies