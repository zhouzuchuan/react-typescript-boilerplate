import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { RequestLoading } from 'react-enhanced'

import List from '@c/List'

export default function HomePage() {
    const packageList = useSelector(({ home }: any) => home?.packageList)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({
            type: 'home/getPackageList',
        })
    }, [dispatch])

    return (
        <StyledWrap>
            <p className="mt30 pt20">
                For guide and recipes on how to configure / customize this
                project, check out the
            </p>

            <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/zhouzuchuan/project-boilerplates"
            >
                project-boilerplates
            </a>
            <p className="mt30">
                To get started, edit <code>src/pages/index/App.js</code> and
                save to reload.
            </p>
            <RequestLoading className="pad30" include="serveGetPackageList">
                <List dataSource={packageList} />
            </RequestLoading>
        </StyledWrap>
    )
}

const StyledWrap = styled.div`
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
