import React from 'react';
import ReactDOM from 'react-dom';
import { init } from 'react-enhanced';
import { HashRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import * as serviceWorker from '@rw';
import App from './App';
import apiList from '@/api';

// 重置样式
import 'normalize.css';
import '@s/commonly.less';

const { Provider } = init({
    warehouse: [], // 仓库名
    resultLimit: 'result',
    api: {
        // 指定api挂载的仓库名
        name: '$service',
        list: apiList,
    },
});

console.log('sssss');

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
