import React, { useEffect } from 'react';
import { components as Component } from 'react-enhanced';

type Tprops = {
    dataSource: any;
    startAction: any;
};

const List = (props: Tprops) => {
    useEffect(() => {
        props.startAction();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Component.Loading className="mt30" include="serveGetPackageList">
            {props.dataSource.map((item: any, index: number) => {
                return (
                    <div className="package-list" key={index}>
                        <h3>{item.get('name')}</h3>
                        <ul className="lay-list">
                            {item.get('list').map((v: any, i: number) => (
                                <li key={i}>
                                    <a rel="noopener noreferrer" className="link" href={v.get('src')} target="_blank">
                                        {v.get('name')}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </Component.Loading>
    );
};

export default List;
