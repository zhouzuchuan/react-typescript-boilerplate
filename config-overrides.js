const {
    override,
    fixBabelImports,
    addWebpackAlias,
    addBabelPlugins,
    addLessLoader,
    addDecoratorsLegacy,
    disableEsLint,
} = require('customize-cra')
const { paths } = require('react-app-rewired')
const path = require('path')
const fs = require('fs')
const DataMock = require('data-mock')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackCommentPlugin = require('html-webpack-comment-plugin')

const globby = require('globby')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

function resolve(dir) {
    return path.join(__dirname, dir)
}

/**
 *
 * 各个环境 eslint/stylelint 验证开关
 *
 * 0:     全部关闭
 * 1:     生产环境开启
 * 2/其他: 全部开启
 *
 * */
const lintSwitch = 1

module.exports = {
    webpack: override(
        addDecoratorsLegacy(),
        disableEsLint(),

        addLessLoader({
            lessOptions: {
                javascriptEnabled: true,
                // modifyVars: { '@primary-color': '#1DA57A' },
            },
        }),
        (config) => {
            const env = process.env.NODE_ENV
            const isProd = env === 'production'

            const isLint = !(
                lintSwitch === 0 ||
                (lintSwitch === 1 && env === 'development')
            )

            config.devtool =
                env === 'development'
                    ? 'cheap-module-eval-source-map'
                    : !!process.env.source_map
                    ? 'source-map'
                    : false

            config.plugins.forEach((item, i) => {
                const strConstructor = item.constructor.toString()

                if (
                    strConstructor.indexOf('class ForkTsCheckerWebpackPlugin') >
                    -1
                ) {
                    item.ignoreLintWarnings = !isLint
                    item.options.async = isLint
                }

                if (isProd) {
                    // 更改输出的样式文件名
                    if (
                        strConstructor.indexOf('class MiniCssExtractPlugin') >
                        -1
                    ) {
                        item.options.filename =
                            'static/css/[name].[chunkhash:8].css'
                        item.options.chunkFilename =
                            'static/css/[name].chunk.[chunkhash:8].css'
                    }
                }

                // 删除默认 HtmlWebpackPlugin 插件
                if (strConstructor.indexOf('class HtmlWebpackPlugin') > -1) {
                    config.plugins.splice(i, 1)
                }
            })

            // 更改输出的文件名
            if (isProd) {
                config.output.filename = 'static/js/[name].[chunkhash:8].js'
                config.output.chunkFilename =
                    'static/js/[name].chunk.[chunkhash:8].js'
            } else {
                config.output.filename = 'static/js/[name].js'
                config.output.chunkFilename = 'static/js/[name].chunk.js'
            }

            // 处理多页面

            // 修改入口
            config.entry = globby
                .sync([resolveApp('src/pages') + '/*/index.tsx'], {
                    cwd: process.cwd(),
                })
                .reduce((r, v) => {
                    const entryName = path.parse(v).dir.split('/').pop()

                    config.plugins.push(
                        new HtmlWebpackPlugin({
                            inject: true,
                            template: paths.appHtml,
                            filename: entryName + '.html',
                            chunks: [entryName],

                            minify: {
                                ...(isProd && {
                                    removeComments: true,
                                    collapseWhitespace: true,
                                    removeRedundantAttributes: true,
                                    useShortDoctype: true,
                                    removeEmptyAttributes: true,
                                    removeStyleLinkTypeAttributes: true,
                                    keepClosingSlash: true,
                                    minifyJS: true,
                                    minifyCSS: true,
                                    minifyURLs: true,
                                }),
                            },
                        }),
                    )

                    return {
                        ...r,
                        [entryName]: [
                            require.resolve('react-app-polyfill/stable'),
                            ...(!isProd
                                ? [
                                      //   require.resolve(
                                      //       'react-dev-utils/webpackHotDevClient',
                                      //   ),
                                  ]
                                : []),
                            v,
                        ],
                    }
                }, {})

            if (isLint) {
                // 配置stylelint
                config.plugins.push(
                    new StyleLintPlugin({
                        files: ['src/**/*.?(le|c)ss'],
                    }),
                )
            }

            // 配置 lodash 树摇
            config.plugins.push(
                new LodashModuleReplacementPlugin({ paths: true }),
                new HtmlWebpackCommentPlugin(),
            )

            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/](react|react-dom|core-js)[\\/]/,
                            name: 'vendor',
                            chunks: 'all', // all, async, and initial
                        },
                    },
                },
            }

            return config
        },
        fixBabelImports(
            'import',
            {
                libraryName: '@material-ui/core',
                libraryDirectory: 'esm',
                camel2DashComponentName: false,
            },
            'core',
        ),

        // fixBabelImports('import', {
        //     libraryName: 'antd',
        //     libraryDirectory: 'es',
        //     style: 'css',
        // }),
        ...addBabelPlugins('react-hot-loader/babel'),
        addWebpackAlias({
            'react-dom':
                process.env.NODE_ENV === 'production'
                    ? 'react-dom'
                    : '@hot-loader/react-dom',
            react: path.resolve('./node_modules/react'),
            'react-redux': path.resolve('./node_modules/react-redux'),
            '@a': resolve('src/assets'),
            '@m': resolve('src/models'),
            '@c': resolve('src/components'),
            '@cn': resolve('src/containers'),
            '@s': resolve('src/styles'),
            '@p': resolve('src/plugins'),
            '@u': resolve('src/utils'),
            '@rw': resolve('src/serviceWorker.ts'),
            '@': resolve('src'),
        }),
    ),
    devServer: (configFn) => (proxy, allowedHost) => {
        const config = configFn(proxy, allowedHost)
        config.after = (server) => {
            try {
                new DataMock(server, {
                    target: path.resolve(__dirname, './src/mocks/'),
                    watchTarget: [
                        path.resolve(__dirname, './src/plugins/api'),
                        path.resolve(__dirname, './src/api/'),
                    ],
                })
            } catch (err) {
                console.log('mock server start error!')
                console.log(err)
            }
        }

        return config
    },
}
