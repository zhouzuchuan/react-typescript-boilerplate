import React from 'react';
import { bindActionCreators, connect } from 'react-enhanced';
import { isRecord } from 'immutable';

import styled, { keyframes } from 'styled-components';

import Logo from '@c/Logo';
import List from '@c/List';

type ThocProps = Partial<{
    getPackageList: any;
    packageList: any;
}>;

type Tprops = ThocProps;

@connect(
    ({ home }: any) => {
        return {
            packageList: home.get('packageList'),
        };
    },
    (dispatch: any) =>
        bindActionCreators(
            {
                getPackageList: () => {
                    return {
                        type: 'home/getPackageList',
                    };
                },
            },
            dispatch,
        ),
)
export default class HomePage extends React.Component<Tprops> {
    render() {
        const { packageList, getPackageList } = this.props;

        return (
            <Wrap>
                <header>
                    <Logo />
                    <h1 className="mt10">Welcome to React</h1>
                </header>

                <p className="mt30 pt20">
                    For guide and recipes on how to configure / customize this project, check out the
                    <a className="link" href="https://github.com/zhouzuchuan/react-enhanced-cli" target="_blank">
                        react-enhanced-cli
                    </a>
                </p>

                <p className="mt30">
                    To get started, edit <code>src/pages/index/App.js</code> and save to reload.
                </p>

                <List dataSource={packageList} startAction={getPackageList} />
            </Wrap>
        );
    }
}

const logoSpin = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

const Wrap = styled.div`
    color: #666;
    text-align: center;

    header {
        padding: 20px;
        background-color: #222;

        h1 {
            font-size: 1.5em;
            color: #fff;
        }

        a {
            color: #fff;
        }

        img {
            height: 80px;
            animation: ${logoSpin} infinite 20s linear;
        }
    }

    .link {
        text-decoration: underline;
    }

    .package-list {
        padding: 10px;
        margin-top: 40px;

        ul {
            margin-top: 15px;

            li {
                margin: 10px;
                font-size: 16px;
            }
        }
    }
`;
