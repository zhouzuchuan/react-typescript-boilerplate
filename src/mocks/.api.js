/**
 * api储存
 * */

const globby = require('globby')
const path = require('path')
const { mock } = require('mockjs')

const { createApiList } = require('../plugins/api')

const extractApi = (data) =>
    Object.entries(data).reduce(
        (r, [method, apis]) =>
            Object.entries(apis).reduce(
                (r2, [apiName, apiPath]) => ({
                    ...r2,
                    [apiName]: `${method} ${apiPath}`,
                }),
                r,
            ),
        {},
    )

module.exports = {
    // 载入api目录清单
    api: extractApi(
        createApiList(
            globby
                .sync([path.resolve(__dirname, '../api') + '/*.js'])
                .map((v) => require(v)),
        ),
    ),

    // 接口返回统一格式
    returnAcition(res, result = {}, options = {}) {
        setTimeout(
            () =>
                res.json(
                    mock({
                        status: '0001',
                        message: '成功',
                        result: [],
                        ...result,
                    }),
                ),
            options.delay || 1000,
        )
    },
}
