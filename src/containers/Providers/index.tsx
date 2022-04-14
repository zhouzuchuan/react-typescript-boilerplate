import React from 'react'
import { CssBaseline, Theme } from '@mui/material'
import {
    createTheme,
    ThemeProvider as MaterialThemeProvider,
} from '@mui/material/styles'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateAdapter from '@mui/lab/AdapterDayjs'
import zhLocale from 'dayjs/locale/zh-cn'
import { RecoilRoot } from 'recoil'

import { ThemeProvider, createGlobalStyle } from 'styled-components'

// 重置样式

import { SnackbarProvider } from '@/plugins/snackbar'

import { layoutConfig } from '@/config/layout'

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

const AppProvider: React.FC = ({ children }) => (
    <RecoilRoot>
        <MaterialThemeProvider theme={materialThemeConfig}>
            <ThemeProvider theme={materialThemeConfig}>
                <CssBaseline />
                <StyledInjectRoot />
                <LocalizationProvider
                    dateAdapter={DateAdapter}
                    locale={zhLocale}
                >
                    <SnackbarProvider>
                        <React.Suspense fallback={<div>ddd</div>}>
                            {children}
                        </React.Suspense>
                    </SnackbarProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </MaterialThemeProvider>
    </RecoilRoot>
)

export default AppProvider

const StyledInjectRoot = createGlobalStyle<{ theme: Theme }>` 
    :root {
        --primary-color: ${({ theme }) => theme.palette.primary.main};
        --secondary-color: ${({ theme }) => theme.palette.secondary.main};
    } 
`
