import { hooks } from 'react-enhanced';
import { map, switchMap } from 'rxjs/operators';
import { ActionsObservable } from 'redux-observable';
import { fromJS, Record } from 'immutable';
import { AnyAction } from 'redux';

const nameList = ['Installed CLI Package', 'Installed CLI Rely Package'];

export default () => {
    // 获取通过request包装后的api服务
    const { serveGetPackageList } = hooks.useRequest();

    return {
        // model 名称
        namespace: 'home',

        // 默认数据
        state: fromJS({
            packageList: [],
        }),
        /**
         *
         * 这里的副作用分别通过 redux-observable 的 epics 和 redux-saga 的 effects 来实现
         * 根据习惯 选择其中之一即可，个人建议采用epics来组织副作用，因为它是基于rxjs响应式编程实现，对于复杂的异步交互更加得心应手，但是其学习门槛比较高，谨慎选择
         *
         */
        epics: {
            getPackageList: (epic$: ActionsObservable<AnyAction>) =>
                epic$.pipe(
                    switchMap(() => serveGetPackageList()),
                    map((v: any) => ({
                        type: 'home/setState',
                        payload: {
                            packageList: fromJS(v.map((o: any, i: number) => ({ name: nameList[i], list: o }))),
                        },
                    })),
                ),
        },
        // effects: {
        //     *getPackageList(action: any, { put, call }: any) {
        //         const data = yield call(serveGetPackageList);
        //         if (data) {
        //             yield put({
        //                 type: 'home/setState',
        //                 payload: data.map((v: string, i: number) => ({ name: nameList[i], list: v })),
        //             });
        //         }
        //     },
        // },
        reducers: {
            setState: (state: Record<any>, action: AnyAction) =>
                Object.entries(action.payload || {}).reduce(
                    (r, [k, v]: any[]) => r.setIn(k.split('.'), fromJS(v)),
                    state,
                ),
        },
    };
};
