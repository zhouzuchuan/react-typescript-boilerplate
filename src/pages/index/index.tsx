import React from 'react';
import ReactDOM from 'react-dom';
import { init, middlewares } from 'react-enhanced';
import { BrowserRouter as Router, RouteProps } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import * as serviceWorker from '@rw';
import App from './App';
import apiList from '@/api';
import sagas from 'model-redux/lib/effects/sagas';
import epics from 'model-redux/lib/effects/epics';

// 重置样式
import 'normalize.css';
import 'css.preset';
import '@s/index.less';

const { Provider } = init({
    warehouse: [], // 仓库名
    api: {
        list: apiList,
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
        effects: [sagas('sagas'), epics('epics')],
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
