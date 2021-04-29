import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

// 重置样式
import 'normalize.css'

const App = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: calc(10px + 4vmin);
`

ReactDOM.render(<App>我是多页面 - Admin</App>, document.getElementById('root'))
