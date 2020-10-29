import React from 'react'
import ReactDOM from 'react-dom'
import { init } from 'react-enhanced'
import { hot } from 'react-hot-loader/root'
import { routerMiddleware } from 'connected-react-router'
import { Router } from 'react-router-dom'
import axios from 'axios'
// import { ConfigProvider } from 'antd'
// import zhCN from 'antd/lib/locale-provider/zh_CN'
import * as serviceWorker from '@rw'
import App from './App'
import { createApiList } from '@/plugins/api'
import { history } from '@/plugins/history'
import '@/plugins/icons'
// import sagas from 'model-redux/lib/effects/sagas';
// import epics from 'model-redux/lib/effects/epics';

// 重置样式
import 'normalize.css'
import 'css.preset'
import '@s/index.less'

const apiFiles = require.context('@/api/', true, /\.js$/)

const { Provider } = init({
    apiConfig: {
        request: axios as any,
        CancelRequest: axios.CancelToken,
        list: createApiList(apiFiles.keys().map((v) => apiFiles(v))),
        // 提取response值
        limitResponse: (res: any) => res.data.result,
        // 验证 返回的数据 不通过 则 请求函数 reject
        validate: () => true,
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
    <Provider>
        <Router history={history}>
            {/* <ConfigProvider locale={zhCN}> */}
            <WithHotReload />
            {/* </ConfigProvider> */}
        </Router>
    </Provider>,
    document.getElementById('root'),
)
serviceWorker.unregister()
