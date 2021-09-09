import React from 'react'
import { CssBaseline, Theme } from '@material-ui/core'
import {
    createTheme,
    ThemeProvider as MaterialThemeProvider,
} from '@material-ui/core/styles'
import { LocalizationProvider } from '@material-ui/pickers'
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns'
import zhLocale from 'date-fns/locale/zh-CN'

import { getRequestLoadingProps } from 'react-enhanced'
import Loading from 'react-enhanced/lib/components/Loading'
import { ThemeProvider, createGlobalStyle } from 'styled-components'

// 重置样式
import { SnackbarProvider } from '@p/snackbar'

import EnhancedProvider from '@/plugins/apiMange'
import { layoutConfig } from '@/config/layout'
import { RecoilRoot } from 'recoil'

const materialThemeConfig = createTheme({
    palette: {
        primary: {
            main: layoutConfig.primary_color,
        },
        secondary: {
            main: layoutConfig.secondary_color,
        },
    },
})

const AppProvider: React.FC = ({ children }) => {
    return (
        <RecoilRoot>
            <MaterialThemeProvider theme={materialThemeConfig}>
                <ThemeProvider theme={materialThemeConfig}>
                    <CssBaseline />
                    <StyledInjectRoot />
                    <LocalizationProvider
                        dateAdapter={DateFnsAdapter}
                        locale={zhLocale}
                    >
                        <SnackbarProvider>
                            <EnhancedProvider>
                                <React.Suspense
                                    fallback={
                                        <Loading
                                            loading={true}
                                            spinnerProps={getRequestLoadingProps()}
                                        />
                                    }
                                >
                                    {children}
                                </React.Suspense>
                            </EnhancedProvider>
                        </SnackbarProvider>
                    </LocalizationProvider>
                </ThemeProvider>
            </MaterialThemeProvider>
        </RecoilRoot>
    )
}

export default AppProvider

const StyledInjectRoot = createGlobalStyle<{ theme: Theme }>` 
    :root {
        --primary_color: ${({ theme }) => theme.palette.primary.main};
        --secondary_color: ${({ theme }) => theme.palette.secondary.main};
    } 
`
