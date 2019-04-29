import React from 'react';
import ReactDOM from 'react-dom';
import { init, middlewares } from 'react-enhanced';
import { HashRouter as Router, RouteProps } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import * as serviceWorker from '@rw';
import App from './App';
import apiList from '@/api';

// 重置样式
import 'normalize.css';
import 'css.preset';
import '@s/index.less';

const { Provider } = init({
    warehouse: [], // 仓库名
    api: {
        // 指定api挂载的仓库名
        name: '$service',
        list: apiList,
    },
    // 路由守卫（必须使用components.Route组件）
    guard: (router: RouteProps) => true,
    modelConfig: {
        persist: {
            // 通过在这里设置需要持久化的 model (model的namespace)
            whitelist: [],
        },
        middlewares: [
            [
                middlewares.requestMiddleware.bind(null, {
                    requestCallback: (req: any) => true,
                    resultLimit: 'result',
                }),
            ],
        ],
    },
});

const rootEl = document.getElementById('root') as HTMLElement;
const render = (Wrap: any) => {
    ReactDOM.render(
        <Provider>
            <Router>
                <LocaleProvider locale={zhCN}>
                    <Wrap />
                </LocaleProvider>
            </Router>
        </Provider>,
        rootEl,
    );
    serviceWorker.unregister();
};

render(App);

const { hot } = module as any;
if (hot) {
    hot.accept('./App', () => {
        const NextApp = require('./App').default;
        render(NextApp);
    });
}
