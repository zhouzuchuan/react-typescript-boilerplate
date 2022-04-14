//
import styled from 'styled-components'
import logo from '@/assets/logo.svg'
import { Routes, Route, NavLink } from 'react-router-dom'
import AsyncAbout from '@/containers/Views/About'
import AsyncHome from '@/containers/Views/Home'

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
                            className={(navData) =>
                                navData.isActive ? 'active' : ''
                            }
                            key={name}
                            to={path}
                        >
                            {name}
                        </NavLink>
                    ))}
                </Headerbox>
            </header>
            <section>
                <Routes>
                    <Route element={<AsyncHome />} path="/" />
                    <Route element={<AsyncAbout />} path="/about" />
                </Routes>
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
            color: #fff;
            background: #61dafb;
        }
    }
`
