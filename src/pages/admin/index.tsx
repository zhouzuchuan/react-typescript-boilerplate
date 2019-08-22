import React from 'react'
import ReactDOM from 'react-dom'

// 重置样式
import 'normalize.css'
import 'css.preset'
import '@s/index.less'

const App = () => <div className="tac fz20 fwb mt30">我是多页面 - admin</div>

ReactDOM.render(<App />, document.getElementById('root'))
