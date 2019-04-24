import React from 'react';
import ReactDOM from 'react-dom';
import { init, middlewares } from 'react-enhanced';
import { HashRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { createTransform } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import * as serviceWorker from '@rw';
import App from './App';
import apiList from '@/api';

// 重置样式
import 'normalize.css';
import 'css.preset';
import { fromJS, Record } from '../../../node_modules/immutable';

var Immutable = require('immutable');
var Serialize = require('remotedev-serialize');
var serializer = Serialize.immutable(Immutable);
const SetTransform = createTransform(
    // transform state on its way to being serialized and persisted.
    (state: any, key) => {
        console.log(state, key);
        // convert mySet to an Array.
        return JSON.stringify(state.toJS());
    },
    // transform state being rehydrated
    (state, key) => {
        console.log(JSON.parse(state), key, '===');
        return JSON.parse(state);
    },
    // define which reducers this transform gets called for.
    { whitelist: ['home'] },
);

const { Provider } = init({
    warehouse: [], // 仓库名
    api: {
        // 指定api挂载的仓库名
        name: '$service',
        list: apiList,
    },
    modelConfig: {
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
