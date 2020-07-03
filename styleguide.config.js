const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const tsConfigPaths = require('./tsconfig.paths.json')

const alias = _.reduce(
    tsConfigPaths.compilerOptions.paths,
    (r, v, k) => {
        return {
            ...r,
            [k.replace('/*', '')]: path.resolve(
                __dirname,
                _.first(v).replace('*', ''),
            ),
        }
    },
    {},
)

module.exports = {
    title: 'react-typescript-boilerplate',

    components: function () {
        return glob
            .sync(path.resolve(__dirname, 'src/components/**/*.tsx'))
            .filter(function (module) {
                return /\/[A-Z]\w*\.tsx$/.test(module)
            })
    },
    // 定义props和方法选项卡的初始状态
    usageMode: 'expand',
    // 定义示例代码选项卡的初始状态
    exampleMode: 'collapse',

    // 生成的静态HTML样式指南的文件夹
    styleguideDir: 'docs',

    pagePerSection: true,
    // propsParser: require('react-docgen').parse,

    moduleAliases: alias,

    ribbon: {
        // Link to open on the ribbon click (required)
        url: 'https://github.com/zhouzuchuan/react-typescript-boilerplate',
        // Text to show on the ribbon (optional)
        text: 'Fork me on GitHub',
    },

    // resolver: require('react-docgen').resolver.findAllComponentDefinitions,
    propsParser: require('react-docgen-typescript').withDefaultConfig({
        propFilter: { skipPropsWithoutDoc: true },
    }).parse,
}
