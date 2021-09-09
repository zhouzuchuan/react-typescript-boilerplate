import { createApiList } from '@/plugins/api'
import { snackbar } from '@p/snackbar'
import { routerMiddleware } from 'connected-react-router'
import { init, useApi } from 'react-enhanced'
import axios from 'axios'
import { history } from '@/plugins/history'
import { getToken, removeToken } from '@u/storage'
import { layoutConfig } from '@/config/layout'

const apiFiles = require.context('@/api/', true, /\.js$/)

let switch401 = false

// 401 提示
const tip401 = (message: string) => {
    if (!switch401) {
        switch401 = true
        removeToken()

        // confirm({
        //     description: message,
        //     onAction: (state) => {
        //         if (state === 'confirm') {
        //             history.replace(
        //                 `${paths.login}?redirect=${encodeURIComponent(
        //                     history.location.pathname,
        //                 )}`,
        //             )
        //         }
        //         return Promise.resolve()
        //     },
        // })
    }
}

// 请求统一处理
export const service = axios.create({
    withCredentials: true,
    timeout: 1 * 60 * 1000,
})

service.interceptors.request.use(
    (config) => {
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
        } else if (status === 503) {
            message = '会员等级不足，无法使用此功能!'
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

const { Provider } = init({
    apiConfig: {
        request: service as any,
        CancelRequest: axios.CancelToken,
        list: createApiList(apiFiles.keys().map((v) => apiFiles(v))),
        // 提取response值
        limitResponse: (res: any) => res.data?.data,
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
    },
    modelConfig: {
        middlewares: [[routerMiddleware(history)]],
    } as any,
    requestLoadingConfig: {
        color: layoutConfig.primary_color,
    },
})

const EnhancedProvider: React.FC = ({ children }) => {
    const serviceMap = useApi()

    // useEffect(() => {
    Object.entries(serviceMap).forEach(([k, v]) => {
        Reflect.set(requestServiceMap, k, v)
    })
    // }, [])

    return <Provider>{children}</Provider>
}
export default EnhancedProvider

// 本地暂存请求函数数据
export const requestServiceMap: Record<string, any> = {}
