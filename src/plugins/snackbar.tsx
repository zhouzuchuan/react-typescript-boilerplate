import { useEffect } from 'react'
import {
    useSnackbar,
    SnackbarProvider as Provider,
    ProviderContext,
} from 'notistack'

// snackbar 数据
export const snackbar: ProviderContext = {
    enqueueSnackbar: (msg) => '',
    closeSnackbar: () => null,
}

// 注入 snackbar 工具
export const useSnackbarUtils = () => {
    const snackbarContext = useSnackbar()
    useEffect(() => {
        for (let [key, fn] of Object.entries(snackbarContext)) {
            Reflect.set(snackbar, key, fn)
        }
    }, [snackbarContext])
}

export const InitProvider = () => {
    useSnackbarUtils()
    return null
}

export const SnackbarProvider: React.FC = ({ children }) => (
    <Provider>
        <InitProvider />
        {children}
    </Provider>
)
