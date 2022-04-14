const {
    override,
    addWebpackAlias,
    addDecoratorsLegacy,
    disableEsLint,
    addWebpackPlugin,
    overrideDevServer,
} = require('customize-cra')
const { paths } = require('react-app-rewired')
const path = require('path')
const fs = require('fs')
const DataMock = require('data-mock')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackCommentPlugin = require('html-webpack-comment-plugin')
const WebpackBar = require('webpackbar')

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

const isDevelopment = process.env.NODE_ENV === 'development'

const isLint = !(lintSwitch === 0 || (lintSwitch === 1 && isDevelopment))

const multipleEntryPaths = globby
    .sync(
        [resolveApp('src/pages') + '/*/index.tsx'].map((path) =>
            path.replace(/\\/g, '/'),
        ),
        {
            cwd: process.cwd(),
        },
    )
    .map((v) => {
        const entryName = path.parse(v).dir.split('/').pop()
        return {
            entry: v,
            entryName,
            template: paths.appHtml,
            outPath: `static/js/${v}[name].chunk.js`,
        }
    })

module.exports = {
    webpack: override(
        addDecoratorsLegacy(),
        disableEsLint(),
        (config) => {
            config.devtool = isDevelopment
                ? 'eval-cheap-module-source-map'
                : process.env.source_map
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

                // 删除默认 HtmlWebpackPlugin 插件
                if (strConstructor.indexOf('class HtmlWebpackPlugin') > -1) {
                    config.plugins.splice(i, 1)
                }
            })

            //   更改输出的文件名;
            const entryPaths = multipleEntryPaths.reduce((result, item) => {
                config.plugins.push(
                    new HtmlWebpackPlugin(
                        Object.assign(
                            {
                                inject: 'body',
                                template: paths.appHtml,
                                filename: item.entryName + '.html',
                                chunks: [item.entryName],
                            },
                            !isDevelopment && {
                                minify: {
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
                                },
                            },
                        ),
                    ),
                )

                return Object.assign(result, { [item.entryName]: [item.entry] })
            }, {})

            // 更改输出的文件名
            if (isDevelopment) {
                config.output.filename = 'static/js/[name].js'
                config.output.chunkFilename = 'static/js/[name].chunk.js'
            } else {
                config.output.filename = 'static/js/[name].[chunkhash:8].js'
                config.output.chunkFilename =
                    'static/js/[name].chunk.[chunkhash:8].js'
            }

            config.entry = entryPaths

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

        isLint &&
            addWebpackPlugin(
                new StyleLintPlugin({
                    files: ['src/**/*.?(le|c)ss'],
                }),
            ),

        addWebpackPlugin(new LodashModuleReplacementPlugin({ paths: true })),
        addWebpackPlugin(new HtmlWebpackCommentPlugin()),
        addWebpackPlugin(new WebpackBar()),

        addWebpackAlias({
            '@': resolve('src'),
        }),
    ),

    devServer: overrideDevServer((config) => {
        config.onAfterSetupMiddleware = (server) => {
            try {
                new DataMock(server.app, {
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
    }),
}
