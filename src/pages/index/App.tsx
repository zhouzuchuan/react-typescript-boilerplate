import React from 'react';
import { Switch, NavLink } from 'react-router-dom';
import { asyncComponent } from 'react-enhanced';
import styled from 'styled-components';

import Route from '@c/Route';

export default class App extends React.Component {
    state = {
        menuData: [
            {
                name: 'Home',
                path: '/',
            },
            {
                name: 'About',
                path: '/about',
            },
        ],
    };
    render() {
        const { menuData } = this.state;
        return [
            <Headerbox key="header">
                {menuData.map(({ name, path }) => (
                    <NavLink activeClassName="active" exact={true} key={name} strict={true} to={path}>
                        {name}
                    </NavLink>
                ))}
            </Headerbox>,
            <Route key="body" render={this.routeRender} />,
        ];
    }
    private routeRender = ({ match }: { match: any }) => {
        return (
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
    };
}

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
