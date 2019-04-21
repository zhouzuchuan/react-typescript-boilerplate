import * as React from 'react';
import { Route, RouteProps } from 'react-router-dom';

import { extendsClass } from './utils';

export default class RcRoute extends React.Component<RouteProps> {
    componentRender = (mothed: any, ...params: any[]) => {
        const [{ history, location }] = params;

        // console.log('route   111', location, mothed);

        const token = true;

        if (location.pathname === '/login') {
            if (token) {
                history.replace('/');
                return null;
            }
        } else {
            if (!token) {
                history.push({
                    pathname: '/login',
                    state: location.pathname,
                });
                return null;
            }
        }

        if (typeof mothed === 'function') {
            if (mothed.name === 'LoadableComponent') {
                const CustComponent = extendsClass(mothed);
                return new CustComponent();
            } else {
                // @ts-ignore
                return new mothed(...params);
            }
        } else {
            return mothed;
        }
    };

    render() {
        return (
            <Route
                {...['component', 'render'].reduce(
                    (r: any, v: any) => ({
                        ...r,
                        ...(r[v] && { [v]: (...a: any[]) => this.componentRender(r[v], ...a) }),
                    }),
                    this.props,
                )}
            />
        );
    }
}
