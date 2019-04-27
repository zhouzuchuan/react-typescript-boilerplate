import React from 'react';
import ReactDOM from 'react-dom';
import { init, middlewares } from 'react-enhanced';
import { HashRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import * as serviceWorker from '@rw';
import App from './App';
import apiList from '@/api';

// 重置样式
import 'normalize.css';
import 'css.preset';

const { Provider } = init({
    warehouse: [], // 仓库名
    api: {
        // 指定api挂载的仓库名
        name: '$service',
        list: apiList,
    },
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

const render = (Wrap: any) => {
    const rootEl = document.getElementById('root') as HTMLElement;
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
