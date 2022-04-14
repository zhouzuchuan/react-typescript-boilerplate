import { createApiList } from '@/api.config.js'
import { snackbar } from '@/plugins/snackbar'
import ApiManage from 'api-manage'
import axios from 'axios'
import { getToken, removeToken } from '@/utils/storage'
import { useMemo } from 'react'

const apiFiles = require.context('@/api/', true, /\.js$/)

let switch401 = false

// 401 提示
const tip401 = (message: string) => {
    if (!switch401) {
        switch401 = true
        removeToken()
    }
}

// 请求统一处理
export const service = axios.create({
    withCredentials: true,
    timeout: 1 * 60 * 1000,
})

service.interceptors.request.use(
    (config: any) => {
        const token = getToken()
        if (token) config.headers.hotSearchToken = token
        return config
    },
    (error) => Promise.reject(error),
)
service.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        let { message } = error
        const { data = {}, status } = error.response ?? {}
        if (message === 'Network Error') {
            message = '接口连接异常'
        } else if (message.includes('timeout')) {
            message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
            message =
                data?.msg ||
                '系统接口' + message.substr(message.length - 3) + '异常'
        }

        if (status === 401) {
            tip401(message)
        } else if (status === 503) {
            snackbar.enqueueSnackbar(message, {
                variant: 'error',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
            })
        } else {
            if (message !== '取消重复请求')
                snackbar.enqueueSnackbar(message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                })
        }

        return Promise.reject(error)
    },
)

export const useApi = () => {
    return useMemo(() => serviceMap, [])
}

export const serviceMap = new ApiManage({
    request: service as any,

    CancelRequest: axios.CancelToken,

    list: createApiList(apiFiles.keys().map((v) => apiFiles(v))),

    // 验证 返回的数据 不通过 则 请求函数 reject
    validate: (res) => {
        const { headers, data } = res

        // 如果返回的是文件数据流 则下载文件
        const contentDisposition = headers?.['content-disposition']

        if (contentDisposition) {
            let fileName = decodeURI(
                contentDisposition.match(/(filename=(.*))/)[2],
            )
            const blob = new Blob([data], {
                type: headers['content-type'],
            })
            if ((window.navigator as any).msSaveOrOpenBlob) {
                // 兼容ie, edge
                ;(window.navigator as any)?.msSaveBlob?.(blob, fileName)
            } else {
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = fileName
                document.body.appendChild(a)
                // 此写法兼容火狐
                let evt = document.createEvent('MouseEvents')
                evt.initEvent('click', false, false)
                a.dispatchEvent(evt)
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
            }

            return true
        }

        const success = res?.data?.code === 200

        if (!success) {
            snackbar.enqueueSnackbar(res?.data?.msg, {
                variant: 'error',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
            })
        }

        if (res?.data?.code === 401) {
            // 重新登录
            tip401(res?.data?.msg)
        }

        return success
    },

    // 提取 response
    limitResponse: (res) => res?.data?.data,
}).getService()
