import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { Router } from 'react-router-dom'
import App from './App'
import { history } from '@/plugins/history'
import reportWebVitals from '@/reportWebVitals'

// 重置样式
import 'normalize.css'
import 'css.preset'
import '@s/index.less'
import AppProvider from '@cn/Providers'

const WithHotReload = process.env.NODE_ENV === 'production' ? App : hot(App)

ReactDOM.render(
    <AppProvider>
        <Router history={history}>
            <WithHotReload />
        </Router>
    </AppProvider>,
    document.getElementById('root'),
)
reportWebVitals()
