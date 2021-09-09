import { Switch, Route, NavLink } from 'react-router-dom'
import { asyncComponent } from 'react-enhanced'
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

export default function LayoutPage() {
    return (
        <>
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
                <Switch>
                    <Route
                        component={asyncComponent(
                            () => import('@cn/Views/Home'),
                            {
                                models: [() => import('@m/home')],
                            },
                        )}
                        exact={true}
                        path="/"
                    />
                    <Route
                        component={asyncComponent(
                            () => import('@cn/Views/About'),
                        )}
                        exact={true}
                        path="/about"
                    />
                </Switch>
            </section>
        </>
    )
}

const Logo = styled.img`
    height: 40vmin;
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
            background: #61dafb;
        }
    }
`
