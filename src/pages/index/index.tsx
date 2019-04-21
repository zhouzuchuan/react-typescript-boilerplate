import React from 'react';
import ReactDOM from 'react-dom';
import modelRedux from 'model-redux';
import { init, middlewares } from 'react-enhanced';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import * as serviceWorker from '@rw';
import App from './App';
import apiList from '@/api';

// 重置样式
import 'normalize.css';
import 'css.preset';

const { store, registerModel } = modelRedux.create({
    middlewares: [
        [
            middlewares.requestMiddleware.bind(null, {
                requestCallback: (req: any) => true,
                resultLimit: 'result',
            }),
        ],
    ],
} as any);

init(
    { store, registerModel },
    {
        warehouse: [], // 仓库名
        api: {
            // 指定api挂载的仓库名
            name: '$service',
            list: apiList,
        },
    },
);

const rootEl = document.getElementById('root') as HTMLElement;
const render = (Wrap: any) => {
    ReactDOM.render(
        <Provider store={store}>
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
