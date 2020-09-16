import React from 'react'
import List from './List'

export default {
    component: List,
    title: 'Design System/List',
}

export const placeholder = () => (
    <List
        dataSource={[
            {
                name: '分类一',
                list: [
                    {
                        name: '百度',
                        src: 'https://www.baidu.com',
                    },
                ],
            },
        ]}
    />
)
