const {
    override,
    fixBabelImports,
    addWebpackAlias,
    addLessLoader,
    addDecoratorsLegacy,
    addBundleVisualizer,
} = require('customize-cra');
const { paths } = require('react-app-rewired');
const path = require('path');
const fs = require('fs');
const DataMock = require('data-mock');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const globby = require('globby');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function resolve(dir) {
    return path.join(__dirname, dir);
}

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
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
const lintSwitch = 1;

const { analyze = '0' } = process.env;

module.exports = {
    webpack: override(
        (config, env) => {
            const isProd = env === 'production';
            const isLint = !(lintSwitch === 0 || (lintSwitch === 1 && config.mode === 'development'));

            const entries = globby.sync([resolveApp('src/pages') + '/*/index.tsx'], { cwd: process.cwd() }).reduce(
                (r, filePath) => ({
                    ...r,
                    [filePath.split('/').slice(-2, -1)[0]]: [
                        require.resolve('react-app-polyfill/stable'),
                        ...(!isProd ? [require.resolve('react-dev-utils/webpackHotDevClient')] : []),
                        filePath,
                    ],
                }),
                {},
            );

            let styleCacheGroups = {};

            // 配置 HtmlWebpackPlugin 插件, 指定入口文件生成对应的 html 文件
            const htmlPlugin = Object.keys(entries).map(item => {
                // 将 css|less 文件合并成一个文件, mini-css-extract-plugin 的用法请参见文档：https://www.npmjs.com/package/mini-css-extract-plugin
                // MiniCssExtractPlugin 会将动态 import 引入的模块的样式文件也分离出去，将这些样式文件合并成一个文件可以提高渲染速度
                const styleName = `${item}Styles`;
                styleCacheGroups = {
                    ...styleCacheGroups,
                    [styleName]: {
                        name: styleName,
                        test: (m, c, entry = styleName) =>
                            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
                        chunks: 'all', // merge all the css chunk to one file
                        enforce: true,
                    },
                };

                return new HtmlWebpackPlugin({
                    inject: true,
                    template: paths.appHtml,
                    filename: item + '.html',
                    chunks: [item],
                    ...(isProd && {
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
                    }),
                });
            });

            config.plugins.forEach((item, i) => {
                const strConstructor = item.constructor.toString();

                if (!isLint && strConstructor.indexOf('class ForkTsCheckerWebpackPlugin') > -1) {
                    item.ignoreLintWarnings = true;
                }

                if (isProd) {
                    // 更改输出的样式文件名
                    if (strConstructor.indexOf('class MiniCssExtractPlugin') > -1) {
                        item.options.filename = 'static/css/[name].[chunkhash:8].css';
                        item.options.chunkFilename = 'static/css/[name].chunk.[chunkhash:8].css';
                    }

                    // SWPrecacheWebpackPlugin: 使用 service workers 缓存项目依赖
                    // if (strConstructor.indexOf('class GenerateSW') > -1) {
                    //     // 更改输出的文件名
                    //     item.config.precacheManifestFilename = 'precache-manifest.[chunkhash:8].js';
                    // }
                }

                // 修改 HtmlWebpackPlugin 插件
                if (strConstructor.indexOf('class HtmlWebpackPlugin') > -1) {
                    config.plugins.splice(i, 1);
                }
            });

            // dd;

            // 更改输出的文件名
            if (isProd) {
                config.output.filename = 'static/js/[name].[chunkhash:8].js';
                config.output.chunkFilename = 'static/js/[name].chunk.[chunkhash:8].js';
            } else {
                config.output.filename = 'static/js/[name].js';
                config.output.chunkFilename = 'static/js/[name].chunk.js';
            }

            // 修改入口
            config.entry = entries;

            config.plugins.push(...htmlPlugin);

            if (isLint) {
                // 配置stylelint
                config.plugins.push(
                    new StyleLintPlugin({
                        files: ['src/**/*.?(le|c)ss'],
                    }),
                );
            }
            // 配置 lodash 树摇
            config.plugins.push(new LodashModuleReplacementPlugin({ paths: true }));

            // 修改代码拆分规则，详见 webpack 文档：https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks
            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        // 通过正则匹配，将 react react-dom react-enhanced  styled-components 等公共模块拆分为 vendor
                        // 这里仅作为示例，具体需要拆分哪些模块需要根据项目需要进行配置
                        // 可以通过 BundleAnalyzerPlugin 帮助确定拆分哪些模块包
                        vendor: {
                            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                            name: 'vendor',
                            chunks: 'all', // all, async, and initial
                        },
                        // ...styleCacheGroups,
                    },
                },
            };

            return config;
        },
        fixBabelImports('import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: {
                /*'@primary-color': '#1DA57A'*/
            },
        }),
        addBundleVisualizer(
            {
                analyzerMode: 'static',
                reportFilename: 'report.html',
            },
            !+analyze,
        ),
        addWebpackAlias({
            '@a': resolve('src/assets'),
            '@m': resolve('src/models'),
            '@c': resolve('src/components'),
            '@cn': resolve('src/containers'),
            '@s': resolve('src/styles'),
            '@mk': resolve('src/mocks'),
            '@u': resolve('src/utils'),
            '@rw': resolve('src/serviceWorker.ts'),
            '@': resolve('src'),
        }),
        addDecoratorsLegacy(),
    ),
    devServer: configFn => (proxy, allowedHost) => {
        const config = configFn(proxy, allowedHost);
        config.after = server => {
            new DataMock(server, {
                target: path.resolve(__dirname, './src/mocks/'),
                watchTarget: path.resolve(__dirname, './src/api/'),
            });
        };

        return config;
    },
};
