const {
    override,
    fixBabelImports,
    addWebpackAlias,
    addLessLoader,
    addDecoratorsLegacy,
    addBundleVisualizer,
} = require('customize-cra');
const path = require('path');
const { bindServer } = require('data-mock');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, dir);
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
const lintSwitch = 2;

const { analyze = '0' } = process.env;

module.exports = {
    webpack: override(
        config => {
            const size = config.entry.length;
            config.entry.splice(size - 1, 1, path.resolve(__dirname, './src/pages/index/index.tsx'));
            return config;
        },
        config => {
            if (lintSwitch === 0 || (lintSwitch === 1 && config.mode === 'development')) {
                config.plugins = config.plugins.filter(v => !(v.options || {}).tsconfig);
            } else {
                config.plugins.push(
                    new StyleLintPlugin({
                        files: ['src/**/*.?(le|c)ss'],
                    }),
                );
            }
            return config;
        },
        config => {
            config.plugins.push(new LodashModuleReplacementPlugin());
            return config;
        },
        fixBabelImports('lodash', {}),
        fixBabelImports('import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#1DA57A' },
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
            bindServer({
                server,
                target: path.resolve(__dirname, './src/mocks/'),
                watchTarget: path.resolve(__dirname, './src/api/'),
            });
        };

        return config;
    },
};
