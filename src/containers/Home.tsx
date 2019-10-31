import React from 'react'
import { Dispatch } from 'redux'
import { connect, hooks } from 'react-enhanced'
import styled from 'styled-components'

import List from '@c/List'

type ThocProps = Partial<{
    getPackageList: any
    packageList: any
}>

type Tprops = ThocProps

const HomePage = ({ packageList, getPackageList }: Tprops) => (
    <Wrap>
        <p className="mt30 pt20">
            For guide and recipes on how to configure / customize this project,
            check out the
        </p>

        <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/zhouzuchuan/project-boilerplates"
        >
            project-boilerplates
        </a>
        <p className="mt30">
            To get started, edit <code>src/pages/index/App.js</code> and save to
            reload.
        </p>
        <List dataSource={packageList} startAction={getPackageList} />
    </Wrap>
)

export default connect(
    ({ home }: any) => ({
        packageList: home.get('packageList'),
    }),
    (dispatch: Dispatch) => ({
        getPackageList: hooks.useAction('home/getPackageList'),
    }),
)(HomePage)

const Wrap = styled.div`
    line-height: 1.4;
    text-align: center;

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
`
