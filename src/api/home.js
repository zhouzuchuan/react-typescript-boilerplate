/**
 * home api
 * */

// @ts-ignore
module.exports = ({ server }) => ({
    get: {
        // 获取包列表
        apiHome_GetPackageList: `${server}/getPackageList`,
    },
})
