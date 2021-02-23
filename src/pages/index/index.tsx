import React from 'react'
import ReactDOM from 'react-dom'
import { init } from 'react-enhanced'
import { ThemeProvider } from 'styled-components'
import { hot } from 'react-hot-loader/root'
import { routerMiddleware } from 'connected-react-router'
import { Router } from 'react-router-dom'
import axios from 'axios'
import App from './App'
import { createApiList } from '@/plugins/api'
import { history } from '@/plugins/history'
import reportWebVitals from '@/reportWebVitals'
// import sagas from 'model-redux/lib/effects/sagas';
// import epics from 'model-redux/lib/effects/epics';

// 重置样式
import 'normalize.css'
import 'css.preset'
import '@s/index.less'
import { snackbar, SnackbarProvider } from '@p/snackbar'

const apiFiles = require.context('@/api/', true, /\.js$/)

const { Provider } = init({
    apiConfig: {
        request: axios as any,
        CancelRequest: axios.CancelToken,
        list: createApiList(apiFiles.keys().map((v) => apiFiles(v))),
        // 提取response值
        limitResponse: (res: any) => res.data.result,
        // 验证 返回的数据 不通过 则 请求函数 reject
        validate: () => {
            snackbar.enqueueSnackbar('请求成功', {
                variant: 'info',
            })
            return true
        },
    },
    modelConfig: {
        middlewares: [[routerMiddleware(history)]],
        // effects: [sagas('sagas'), epics('epics')],
    } as any,
    requestLoadingConfig: {
        color: '#61dafb',
    },
})

const WithHotReload = process.env.NODE_ENV === 'production' ? App : hot(App)

ReactDOM.render(
    <SnackbarProvider>
        <Provider>
            <ThemeProvider theme={{}}>
                <Router history={history}>
                    <WithHotReload />
                </Router>
            </ThemeProvider>
        </Provider>
    </SnackbarProvider>,
    document.getElementById('root'),
)
reportWebVitals()
