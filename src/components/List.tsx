import React from 'react'
import { RequestLoading } from 'react-enhanced'

export default function List({ dataSource }: { dataSource: any[] }) {
    return (
        <>
            <RequestLoading className="mt30" include="serveGetPackageList">
                {dataSource.map((item: any, index: number) => {
                    return (
                        <div className="package-list" key={index}>
                            <h3>{item.get('name')}</h3>
                            <ul className="lay-list">
                                {item.get('list').map((v: any, i: number) => (
                                    <li key={i}>
                                        <a
                                            rel="noopener noreferrer"
                                            className="link"
                                            href={v.get('src')}
                                            target="_blank"
                                        >
                                            {v.get('name')}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </RequestLoading>
        </>
    )
}
