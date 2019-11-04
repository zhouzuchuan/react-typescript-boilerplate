import React from 'react'
import ReactDOM from 'react-dom'
import { init, middlewares } from 'react-enhanced'
import { hot } from 'react-hot-loader/root'
import { HashRouter as Router, RouteProps } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import * as serviceWorker from '@rw'
import App from './App'
import { createApiList } from '@/plugins/api'
// import sagas from 'model-redux/lib/effects/sagas';
// import epics from 'model-redux/lib/effects/epics';

// 重置样式
import 'normalize.css'
import 'css.preset'
import '@s/index.less'

const apiFiles = require.context('@/api/', true, /\.js$/)

const { Provider } = init({
    warehouse: [], // 仓库名
    api: {
        list: createApiList(apiFiles.keys().map(v => apiFiles(v))),
    },
    // 路由守卫（必须使用components.Route组件）
    guard: (router: RouteProps) => true,
    modelConfig: {
        middlewares: [
            [
                middlewares.requestMiddleware.bind(null, {
                    requestCallback: (req: any) => true,
                    resultLimit: 'result',
                }),
            ],
        ],
        // effects: [sagas('sagas'), epics('epics')],
    },
})

const WithHotReload = process.env.NODE_ENV === 'production' ? App : hot(App)

ReactDOM.render(
    <Provider>
        <Router>
            <Router>
                <ConfigProvider locale={zhCN}>
                    <WithHotReload />
                </ConfigProvider>
            </Router>
        </Router>
    </Provider>,
    document.getElementById('root'),
)
serviceWorker.unregister()
