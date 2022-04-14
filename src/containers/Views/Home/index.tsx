import List from '@/components/List'
import { useHome_Request, useHome_Value } from '@/models/home'
import { useEffect } from 'react'
import styled from 'styled-components'

export default function HomePage() {
    const requestHome = useHome_Request()
    const homeValue = useHome_Value()

    useEffect(() => {
        requestHome()
    }, [requestHome])

    return (
        <StyledWrap>
            <p className="mt-7 pt-5">
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
            <p className="mt-7">
                To get started, edit <code>src/pages/index/index.ts</code> and
                save to reload.
            </p>

            <List dataSource={homeValue.packageList} />
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
