import React from 'react';
import { components } from 'react-enhanced';

const { Loading } = components;

type Tprops = {
    dataSource: any;
    startAction: any;
};

export default class List extends React.Component<Tprops> {
    componentDidMount() {
        this.props.startAction();
    }
    render() {
        const { dataSource } = this.props;

        return (
            <Loading className="mt30" include="serveGetPackageList">
                {dataSource.map((item: any, index: number) => {
                    return (
                        <div className="package-list" key={index}>
                            <h3>{item.get('name')}</h3>
                            <ul className="lay-list">
                                {item.get('list').map((v: any, i: number) => (
                                    <li key={i}>
                                        <a className="link" href={v.get('src')} target="_blank">
                                            {v.get('name')}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </Loading>
        );
    }
}
