import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { useApi } from '@/plugins/api'
import { useCallback } from 'react'

const nameList = ['Installed CLI Package', 'Installed CLI Rely Package']

const atomHome = atom({
    key: 'ATOM-HOME',
    default: {
        packageList: [],
    },
})

/**
 * 请求 首页数据
 * */
export const useHome_Request = () => {
    const { serveHome_GetPackageList } = useApi()
    const setAtomHome = useSetRecoilState(atomHome)

    return useCallback(async () => {
        const result = await serveHome_GetPackageList()
        setAtomHome((old) => ({
            ...old,
            packageList: result.map((o: any, i: number) => ({
                name: nameList[i],
                list: o,
            })),
        }))
    }, [serveHome_GetPackageList, setAtomHome])
}

/**
 * 获取数据
 * */
export const useHome_Value = () => {
    const value = useRecoilValue(atomHome)
    return value
}
