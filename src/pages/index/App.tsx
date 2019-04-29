import React from 'react';
import { Switch, NavLink } from 'react-router-dom';
import { asyncComponent, components } from 'react-enhanced';
import styled from 'styled-components';

const { Route } = components;

const menuData = [
    {
        name: 'Home',
        path: '/',
    },
    {
        name: 'About',
        path: '/about',
    },
];

const routeRender = () => (
    <Switch>
        <Route
            component={asyncComponent({
                component: () => import('@cn/Home'),
                model: () => import('@m/home'),
            })}
            exact={true}
            path="/"
        />
        <Route component={asyncComponent(() => import('@cn/About'))} exact={true} path="/about" />
    </Switch>
);

const App = () => {
    return (
        <div className="flex-box vertical">
            <Headerbox>
                {menuData.map(({ name, path }: any) => (
                    <NavLink activeClassName="active" exact={true} key={name} strict={true} to={path}>
                        {name}
                    </NavLink>
                ))}
            </Headerbox>
            <div className="item">
                <Route render={routeRender} />
            </div>
        </div>
    );
};

export default App;

const Headerbox = styled.div`
    padding: 30px;
    line-height: 26px;
    text-align: center;

    a {
        margin: 0 10px;
        font-size: 18px;
        color: #999;
        text-decoration: none;

        &.active {
            color: #1890ff;
        }
    }
`;
