import Cookies from 'js-cookie'
const localToken = 'UYUJI-HOT-SEARCH-TOKEN'

/**
 * 获取 本地存储的 token
 *
 */
export const getToken = () => {
    return Cookies.get(localToken)
    // return localStorage.getItem(localToken)
}

/**
 * 设置 本地存储的 token
 *
 */
export const setToken = (key: string) => {
    if (process.env.NODE_ENV === 'development') {
        Cookies.set(localToken, key, {
            domain: 'localhost',
        })
    }

    return Cookies.set(localToken, key, {
        domain: '.uyuji.com',
    })
    // return localStorage.setItem(localToken, key)
}

/**
 * 删除 本地存储的 token
 *
 */
export const removeToken = () => {
    if (process.env.NODE_ENV === 'development') {
        Cookies.remove(localToken, {
            domain: 'localhost',
        })
    }
    return Cookies.remove(localToken, {
        domain: '.uyuji.com',
    })
    // return localStorage.removeItem(localToken)
}
