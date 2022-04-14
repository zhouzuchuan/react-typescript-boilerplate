import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import reportWebVitals from '@/reportWebVitals'

// 重置样式
import 'normalize.css'
import 'css.preset'
import '@/styles/index.less'
import AppProvider from '@/containers/Providers'

ReactDOM.render(
    <AppProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AppProvider>,
    document.getElementById('root'),
)
reportWebVitals()
