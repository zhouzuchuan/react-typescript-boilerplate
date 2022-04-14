const {
    DM: {
        api: { apiHome_GetPackageList },
        relypackageList,
        packageList,
        returnAcition,
    },
} = global

module.exports = {
    [apiHome_GetPackageList]: (req, res) => {
        returnAcition(res, [packageList, relypackageList])
    },
}
