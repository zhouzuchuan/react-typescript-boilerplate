import React from 'react'
import { Switch, NavLink } from 'react-router-dom'
import { asyncComponent, components as C } from 'react-enhanced'
import styled from 'styled-components'
import logo from '@a/logo.svg'

const menuData = [
    {
        name: 'Home',
        path: '/',
    },
    {
        name: 'About',
        path: '/about',
    },
]

const routeRender = () => (
    <Switch>
        <C.Route
            component={asyncComponent({
                component: () => import('@cn/Home'),
                model: () => import('@m/home'),
            })}
            exact={true}
            path="/"
        />
        <C.Route
            component={asyncComponent(() => import('@cn/About'))}
            exact={true}
            path="/about"
        />
    </Switch>
)

const App: React.FC = () => {
    return (
        <AppWrap>
            <header className="App-header">
                <Logo src={logo} alt="logo" />

                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>

                <Headerbox>
                    {menuData.map(({ name, path }: any) => (
                        <NavLink
                            activeClassName="active"
                            exact={true}
                            key={name}
                            strict={true}
                            to={path}
                        >
                            {name}
                        </NavLink>
                    ))}
                </Headerbox>
            </header>
            <section>
                <C.Route render={routeRender} />
            </section>
        </AppWrap>
    )
}

export default App

const Logo = styled.img`
    height: 40vmin;
`

const AppWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: calc(10px + 2vmin);
    color: white;
    text-align: center;
    background-color: #282c34;

    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50vmin;
        height: 100vh;
    }

    section {
        flex: 1;
        padding: 20px;
    }

    a {
        color: #09d3ac;
    }
`

const Headerbox = styled.div`
    padding: 30px;
    margin-top: 5vmin;
    line-height: 26px;
    text-align: center;

    a {
        padding: 0 10px;
        margin: 0 10px;
        color: #fff;
        text-decoration: none;

        &.active {
            background: #09d3ac;
        }
    }
`
