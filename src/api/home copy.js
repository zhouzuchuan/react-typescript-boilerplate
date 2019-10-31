/**
 * home api
 * */

// @ts-ignore
module.exports = ({ server }) => ({
    get: {
        // 获取包列表
        apiGetPackageList2: `${server}/getPackageList`,
    },
})
