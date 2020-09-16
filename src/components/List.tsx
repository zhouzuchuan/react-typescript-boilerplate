import React from 'react'

export default function List({ dataSource }: { dataSource: any[] }) {
    return (
        <>
            {dataSource.map((item) => (
                <div className="package-list" key={item.name}>
                    <h3>{item.name}</h3>
                    <ul className="lay-list">
                        {item?.list.map(({ src, name }: any) => (
                            <li key={name}>
                                <a
                                    rel="noopener noreferrer"
                                    className="link"
                                    href={src}
                                    target="_blank"
                                >
                                    {name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    )
}
